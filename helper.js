/**
 * ==========================================
 * CONFIGURATION & CONSTANTS
 * ==========================================
 */
const AppConfig = (() => {
  const URL_MAPPER = {
    ac: "everlusting_life",
    el: "everlusting_life",
    ell: "everlusting_life",
    aw: "lust_goddess",
    lg: "lust_goddess",
    aw_mirror: "lust_goddess_mirror",
    "aw-mirror": "lust_goddess_mirror",
    awmirror: "lust_goddess_mirror",
    awm: "lust_goddess_mirror",
    pd: "prime_desire",
    lf: "lust_frontiers",
    bv: "blur_vpn",
    lr: "laguna_rosa",
    "ac-mirror": "everlusting_life_mirror",
    ac_mirror: "everlusting_life_mirror",
    acmirror: "everlusting_life_mirror",
  };

  const URL_CONFIG = {
    everlusting_life: {
      game_url: "https://everlustinglife.com/play",
      game_url_android: "https://everlustinglife.com/play",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/adult_chess/visits",
      title: "Everlusting Life",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/ac/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    everlusting_life_mirror: {
      game_url: "https://2025everlustinglife.com/play",
      game_url_android: "https://2025everlustinglife.com/play",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/adult_chess/visits",
      title: "Everlusting Life",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/ac/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    lust_goddess: {
      game_url: "https://lustgoddess.com/play",
      game_url_android: "https://lustgoddess.com/play",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/adult_lyssa/visits",
      title: "Lust Goddess",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/aw/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    lust_goddess_mirror: {
      game_url: "https://2025lustgoddess.com/play",
      game_url_android: "https://2025lustgoddess.com/play",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/adult_lyssa/visits",
      title: "Lust Goddess",
      icons: [
        {
          rel: "icon",
          href: "/assets/favicon-32x32.png",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    prime_desire: {
      game_url: "https://www.prime-desire.com",
      game_url_android:
        "https://prime-desire.store/d41d8cd98f00b204e9800998ecf8427e/",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/prime_desire/visits",
      title: "Prime Desire",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/pd/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/pd/favicon-32x32.webp",
          type: "image/webp",
          sizes: "32x32",
        },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    lust_frontiers: {
      game_url: "https://www.lustfrontiers.com",
      game_url_android: "https://www.lustfrontiers.com",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/lust_frontiers/visits",
      title: "Lust Frontiers",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/lf/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    blur_vpn: {
      game_url: "https://blur-vpn.com/",
      game_url_android:
        "https://play.google.com/store/apps/details?id=com.senocomltd.bvpn",
      game_url_ios: "https://apps.apple.com/eg/app/bvpn/id6766581158",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/blur_vpn/visits",
      // Сбор атрибуции включён только для blur_vpn. При клике по кнопке
      // формируется запрос на attribution_url со всеми URL-параметрами.
      send_attribution: true,
      attribution_url: "https://actions.lu-analytics.com/track/blur_vpn/",
      title: "Blur VPN",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/bv/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
        // { rel: "icon", href: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        // { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" },
      ],
    },
    laguna_rosa: {
      game_url: "https://lagunarosa.com/",
      game_url_android:
        "https://laguna-rosa.store/baf9c4afc061758dd6229157735befa2/",
      analytics_url:
        "https://ingest.lu-analytics.com/preland_stats/laguna_rosa/visits",
      title: "Laguna Rosa",
      icons: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/devsenocom/landing-helpers@latest/lr/favicon.webp",
          type: "image/webp",
          sizes: "16x16",
        },
      ],
    },
  };

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
    return { ...base, icons: base.icons || [] };
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
   * Инъекция мета-тегов, иконок и заголовка в <head>
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
      console.warn("⚠️ LS unavailable (VPN/Incognito), relying on URL params.");
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
    const counterId = 109994992;
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
      clickmap: true,
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
   * Sends an attribution request to attribution_url with all URL params
   * attached as query params. Fired on button interaction when the project
   * config has send_attribution enabled.
   */
  static sendAttribution(attributionUrl, params) {
    if (!attributionUrl) return;
    try {
      const payload = {
        event: "install",
        full_params: JSON.stringify(params || {}),
      };
      fetch(attributionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      console.log("📡 Attribution sent:", payload);
    } catch (error) {
      console.warn("⚠️ Attribution failed:", error);
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

    // --- 4. Define Core Redirect Action ---
    const executeRedirect = (triggerSource) => {
      const params = StorageService.getParams(originalUrl);
      // Select appropriate game URL based on device
      const gameUrl = DeviceDetector.getGameUrl(config);
      const targetUrl = NavigationManager.buildRedirectUrl(gameUrl, params);

      console.log(`🎮 Using game URL: ${gameUrl}`);

      // Fire analytics (non-blocking)
      // AnalyticsService.send(
      //   config.analytics_url,
      //   originalReferrer,
      //   triggerSource,
      //   location.href,
      //   utmFull,
      // );

      // Fire attribution (non-blocking) — only when enabled in config
      if (config.send_attribution) {
        AnalyticsService.sendAttribution(config.attribution_url, params);
      }

      // Go!
      NavigationManager.redirect(targetUrl);
    };

    // --- 5. Bind Interactions ---

    // A. Global exposure for onclick="goToSite()"
    window.goToSite = () => executeRedirect("click");

    // B. Data Attribute Binding for <button data-action="play-redirect">
    const bindDataButtons = () => {
      const buttons = document.querySelectorAll(
        '[data-action="play-redirect"]',
      );
      buttons.forEach((btn) => {
        // Удаляем старые листенеры (на всякий случай) и ставим новые
        btn.onclick = (e) => {
          e.preventDefault(); // Если это ссылка <a>, не переходим по href
          executeRedirect("click");
        };
      });
    };
    bindDataButtons();

    // C. Activity Tracking (Passive)
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
    console.log(`✅ App initialized for: ${config.title}`);
  } catch (err) {
    console.error("🔥 App Init Error:", err);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
