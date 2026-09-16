/**
 * ==========================================
 * helper-custom.js — CUSTOM landing creatives
 * ==========================================
 *
 * How this differs from helper.js (regular landings):
 *   - the custom event is sent ALWAYS, for every project
 *     (in helper.js it is an optional send_attribution flag, enabled only for bv);
 *   - there is a public API for arbitrary events: window.trackEvent(name)
 *     and binding through the data-event="..." attribute.
 *
 * Usage:
 *   <script src="https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/helper-custom.js"></script>
 *   <body data-project="bv">
 *
 * The whole file is wrapped in an IIFE: only goToSite and trackEvent are
 * exposed globally, so loading it next to helper.js by accident breaks nothing.
 */
(() => {
  "use strict";

  /**
   * ==========================================
   * CONFIGURATION & CONSTANTS
   * ==========================================
   */
  const AppConfig = (() => {
    // Base for custom events. Final endpoint: ATTRIBUTION_BASE + attribution_project + "/"
    const ATTRIBUTION_BASE = "https://actions.lu-analytics.com/track/";

    const URL_MAPPER = __ALIASES__;

    // attribution_project — the project slug used in analytics (the same one as in analytics_url).
    // A mirror reuses the slug of its main project: a mirror is that same project.
    const URL_CONFIG = __PROJECTS__;

    // get config from data-project
    const getProjectConfig = () => {
      const projectKey = document.body.getAttribute("data-project");
      const mappedKey = URL_MAPPER[projectKey];

      if (!mappedKey || !URL_CONFIG[mappedKey]) {
        throw new Error(
          `CRITICAL: No config found for project code: ${projectKey}`,
        );
      }
      const base = URL_CONFIG[mappedKey];

      // Events are always on for custom landings, so the endpoint is built
      // here instead of being spelled out by hand in every project config.
      const attributionUrl =
        base.attribution_url ||
        `${ATTRIBUTION_BASE}${base.attribution_project}/`;

      return {
        ...base,
        icons: base.icons || [],
        attribution_url: attributionUrl,
        // Event sent on redirect; can be overridden in the project config.
        attribution_event: base.attribution_event || "install",
      };
    };

    return { get: getProjectConfig };
  })();

  /**
   * ==========================================
   * DEVICE DETECTION
   * ==========================================
   */
  class DeviceDetector {
    static isAndroid() {
      return /android/i.test(navigator.userAgent);
    }

    static isIOS() {
      return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    static isMobile() {
      return this.isAndroid() || this.isIOS();
    }

    static getGameUrl(config) {
      if (this.isAndroid()) return config.game_url_android;
      if (this.isIOS() && config.game_url_ios) return config.game_url_ios;
      return config.game_url;
    }
  }

  /**
   * ==========================================
   * SERVICES
   * ==========================================
   */

  // Service: Handling UI (DOM Manipulation)
  class UIService {
    /**
     * Injects meta tags, icons and the title into <head>
     */
    static setupHead(config) {
      // 1. Set Title
      if (config.title) document.title = config.title;

      // 2. Inject Meta (Check before inject to avoid duplicates)
      const headTags = [
        { tag: "meta", attrs: { name: "robots", content: "noindex" } },
        { tag: "meta", attrs: { charset: "UTF-8" } },
        {
          tag: "meta",
          attrs: {
            name: "viewport",
            content: "width=device-width,initial-scale=1",
          },
        },
      ];

      headTags.forEach((item) => {
        const selector = item.attrs.name
          ? `${item.tag}[name="${item.attrs.name}"]`
          : `${item.tag}[rel="${item.attrs.rel}"]`;

        if (!document.head.querySelector(selector)) {
          const element = document.createElement(item.tag);
          Object.entries(item.attrs).forEach(([key, value]) =>
            element.setAttribute(key, value),
          );
          document.head.appendChild(element);
        }
      });

      // 3. Inject favicon/icons only if none are present in <head>
      const hasIcon =
        document.head.querySelector(
          'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
        ) !== null;

      if (!hasIcon && Array.isArray(config.icons) && config.icons.length > 0) {
        config.icons.forEach((icon) => {
          const element = document.createElement("link");
          Object.entries(icon).forEach(([key, value]) =>
            element.setAttribute(key, value),
          );
          document.head.appendChild(element);
        });
        console.log("🧠 Favicon icons injected from config");
      } else {
        console.log("🧠 Favicon already present, skipping injection");
      }

      console.log("🧠 Head metadata injected");
    }

    static injectFooter() {
      if (document.querySelector(".legal-footer")) return;
      const footerHTML = `
      <footer class="legal-footer" style="padding: 20px; text-align: center; font-size: 12px; color: #666; font-family: sans-serif; margin-top: 40px;">
        <div class="legal-inner">
            <a href="/legal/tos.html" target="_blank" style="color: inherit; text-decoration: none;">Terms and Conditions</a> ·
            <a href="/legal/privacy.html" target="_blank" style="color: inherit; text-decoration: none;">Privacy Policy</a> ·
            <a href="mailto:support@lustpush.com" style="color: inherit; text-decoration: none;">Contact</a>
        </div>
      </footer>
    `;
      document.body.insertAdjacentHTML("beforeend", footerHTML);
    }
  }

  // Service: Provide and manage storages (LocalStorage + Fallback)
  class StorageService {
    static saveParams(searchString) {
      if (!searchString) return;
      try {
        const params = new URLSearchParams(searchString);
        const tracking = Object.fromEntries(params.entries());
        localStorage.setItem("tracking_params", JSON.stringify(tracking));
        const cleanSearch = searchString.startsWith("?")
          ? searchString.substring(1)
          : searchString;
        localStorage.setItem("utm_full", cleanSearch);
        console.log("💾 Params saved to LS");
      } catch (e) {
        console.warn(
          "⚠️ LS unavailable (VPN/Incognito), relying on URL params.",
        );
      }
    }

    static getParams(fallbackUrl) {
      try {
        const stored = localStorage.getItem("tracking_params");
        return stored ? JSON.parse(stored) : this._extractFromUrl(fallbackUrl);
      } catch (e) {
        return this._extractFromUrl(fallbackUrl);
      }
    }

    static getUtmFull(fallbackUrl) {
      try {
        const stored = localStorage.getItem("utm_full");
        return stored || new URL(fallbackUrl).search.substring(1);
      } catch (e) {
        return new URL(fallbackUrl).search.substring(1);
      }
    }

    static _extractFromUrl(url) {
      return Object.fromEntries(new URL(url).searchParams.entries());
    }
  }

  // Service: Handles analytics sending
  class AnalyticsService {
    /**
     * Injects the external counter.dev script to track page visits off-site.
     * Used instead of hitting our own ingest on every visit (reduces ingest load).
     */
    static injectVisitCounter() {
      if (
        document.querySelector('script[src="https://cdn.counter.dev/script.js"]')
      ) {
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.counter.dev/script.js";
      script.setAttribute("data-id", "e7d09afc-0b8b-4d7c-b603-c1c8dd19db5d");
      script.setAttribute("data-utcoffset", "4");
      document.head.appendChild(script);
      console.log("📡 External visit counter injected (counter.dev)");
    }

    /**
     * Injects the Yandex.Metrika counter script and initializes it.
     * Shares one counter across all landing domains.
     */
    static injectYandexMetrika() {
      const counterId = 110342910;
      const tagSrc = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;

      // Bootstrap the ym() queue (same shape as the official snippet).
      window.ym =
        window.ym ||
        function () {
          (window.ym.a = window.ym.a || []).push(arguments);
        };
      window.ym.l = 1 * new Date();

      // Avoid injecting the tag twice if it's already present.
      if (!document.querySelector(`script[src="${tagSrc}"]`)) {
        const script = document.createElement("script");
        script.async = 1;
        script.src = tagSrc;
        const first = document.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script, first);
      }

      window.ym(counterId, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true,
      });

      // <noscript> fallback pixel.
      if (
        !document.querySelector(
          `img[src="https://mc.yandex.ru/watch/${counterId}"]`,
        )
      ) {
        const noscript = document.createElement("noscript");
        noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
        document.body.appendChild(noscript);
      }

      console.log("📡 Yandex.Metrika counter injected");
    }

    /**
     * Sends analytics data to the specified endpoint.
     */
    static async send(
      endpoint,
      referrer,
      action = "visit",
      currentUrl = location.href,
      utmFull = "",
    ) {
      const payload = {
        url: currentUrl,
        referrer: referrer,
        action: action,
        utm_full: utmFull,
      };

      try {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        console.log(`📡 Analytics sent: ${action || "visit"}`);
      } catch (error) {
        console.warn("⚠️ Analytics failed:", error);
      }
    }

    /**
     * Sends a custom event to attribution_url along with every tracking
     * param. Always fired on custom landings — unlike helper.js, where it
     * is gated behind the send_attribution option.
     */
    static sendEvent(attributionUrl, eventName, params) {
      if (!attributionUrl) return;
      try {
        const payload = {
          event: eventName,
          full_params: JSON.stringify(params || {}),
        };
        fetch(attributionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        console.log("📡 Custom event sent:", payload);
      } catch (error) {
        console.warn("⚠️ Custom event failed:", error);
      }
    }
  }

  // Service: Manages URL cleaning and redirection
  class NavigationManager {
    static cleanUrl() {
      if (location.search) {
        const clean = `${location.origin}${location.pathname}`;
        history.replaceState({}, "", clean);
        console.log("🧹 URL Cleaned");
      }
    }

    static buildRedirectUrl(baseUrl, params) {
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      return url.toString();
    }

    static redirect(url) {
      console.log("🚀 Redirecting to:", url);
      window.location.href = url;
    }
  }

  /**
   * ==========================================
   * MAIN APP LOGIC
   * ==========================================
   */
  const initApp = async () => {
    try {
      // --- 1. Init Configuration ---
      const config = AppConfig.get();
      if (!config) return;

      const originalUrl = location.href;
      const originalReferrer = document.referrer;
      let hasInteracted = false;

      // Log device info
      console.log(
        `📱 Device: ${DeviceDetector.isAndroid() ? "Android" : DeviceDetector.isIOS() ? "iOS" : "Desktop"}`,
      );

      // --- 2. Setup UI (Head & Footer) ---
      UIService.setupHead(config);
      UIService.injectFooter();

      // --- 3. Process Data ---
      StorageService.saveParams(location.search);
      const utmFull = StorageService.getUtmFull(originalUrl);

      NavigationManager.cleanUrl();

      // Visit tracking is delegated to an external service (counter.dev)
      // instead of our own ingest, to avoid the load it was generating.
      AnalyticsService.injectVisitCounter();
      AnalyticsService.injectYandexMetrika();

      // --- 4. Custom Events ---
      const trackEvent = (eventName) => {
        const params = StorageService.getParams(originalUrl);
        AnalyticsService.sendEvent(
          config.attribution_url,
          eventName || config.attribution_event,
          params,
        );
      };

      // --- 5. Define Core Redirect Action ---
      const executeRedirect = (triggerSource) => {
        const params = StorageService.getParams(originalUrl);
        // Select appropriate game URL based on device
        const gameUrl = DeviceDetector.getGameUrl(config);
        const targetUrl = NavigationManager.buildRedirectUrl(gameUrl, params);

        console.log(`🎮 Using game URL: ${gameUrl}`);

        // Fire custom event (non-blocking) — always, on custom landings
        AnalyticsService.sendEvent(
          config.attribution_url,
          config.attribution_event,
          params,
        );

        // Go!
        NavigationManager.redirect(targetUrl);
      };

      // --- 6. Bind Interactions ---

      // A. Global exposure for onclick="goToSite()" / onclick="trackEvent('...')"
      window.goToSite = () => executeRedirect("click");
      window.trackEvent = (eventName) => trackEvent(eventName);

      // B. Data Attribute Binding for <button data-action="play-redirect">
      const bindDataButtons = () => {
        const buttons = document.querySelectorAll(
          '[data-action="play-redirect"]',
        );
        buttons.forEach((btn) => {
          // Drop any previous listeners (just in case) and set fresh ones
          btn.onclick = (e) => {
            e.preventDefault(); // If this is an <a>, don't follow its href
            executeRedirect("click");
          };
        });
      };
      bindDataButtons();

      // C. Data Attribute Binding for <button data-event="my_event"> —
      //    sends the event without redirecting.
      const bindEventButtons = () => {
        document.querySelectorAll("[data-event]").forEach((el) => {
          el.addEventListener("click", () =>
            trackEvent(el.getAttribute("data-event")),
          );
        });
      };
      bindEventButtons();

      // D. Activity Tracking (Passive)
      const interactionEvents = [
        "click",
        "mousemove",
        "keydown",
        "touchstart",
        "scroll",
      ];
      interactionEvents.forEach((evt) =>
        document.addEventListener(
          evt,
          () => {
            hasInteracted = true;
          },
          { once: true, passive: true },
        ),
      );
      console.log(`✅ Custom app initialized for: ${config.title}`);
    } catch (err) {
      console.error("🔥 Custom App Init Error:", err);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
