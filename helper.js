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
  };

  const URL_CONFIG = {
    everlusting_life: {
      game_url: "https://everlustinglife.com/play",
      analytics_url:
        "https://analytic-client.chickgoddess.com/preland_stats/ac/visits",
      title: "Everlusting Life",
    },
    lust_goddess: {
      game_url: "https://lustgoddess.com/play",
      analytics_url:
        "https://analytic-client.chickgoddess.com/preland_stats/aw/visits",
      title: "Lust Goddess",
    },
    lust_goddess_mirror: {
      game_url: "https://2025lustgoddess.com/play",
      analytics_url:
        "https://analytic-client.chickgoddess.com/preland_stats/aw/visits",
      title: "Lust Goddess",
    },
    // Заглушки для Prime Desire и Lust Frontiers
    prime_desire: {
      game_url: "https://prime-desire.com",
      analytics_url:
        "https://analytic-client.chickgoddess.com/preland_stats/pd/visits",
      title: "Prime Desire",
    },
    lust_frontiers: {
      game_url: "https://lustfrontiers.com",
      analytics_url:
        "https://analytic-client.chickgoddess.com/preland_stats/lf/visits",
      title: "Lust Frontiers",
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
    return URL_CONFIG[mappedKey];
  };

  return { get: getProjectConfig };
})();

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

    // 2. Inject Meta & Favicon (Check before inject to avoid duplicates)
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
      {
        tag: "link",
        attrs: {
          rel: "icon",
          href: "favicon.webp",
          type: "image/webp",
          sizes: "233x233",
        },
      },
    ];

    headTags.forEach((item) => {
      const selector = item.attrs.name
        ? `${item.tag}[name="${item.attrs.name}"]`
        : `${item.tag}[rel="${item.attrs.rel}"]`;

      if (
        (!document.head.querySelector(selector) && item.tag !== "meta") ||
        !document.head.querySelector(`meta[name="${item.attrs.name}"]`)
      ) {
        const element = document.createElement(item.tag);
        Object.entries(item.attrs).forEach(([key, value]) =>
          element.setAttribute(key, value),
        );
        document.head.appendChild(element);
      }
    });

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

  static _extractFromUrl(url) {
    return Object.fromEntries(new URL(url).searchParams.entries());
  }
}

// Service: Handles analytics sending
class AnalyticsService {
  /**
   * Sends analytics data to the specified endpoint.
   */
  static async send(
    endpoint,
    referrer,
    action = null,
    currentUrl = location.href,
  ) {
    const payload = {
      url: currentUrl,
      referrer: referrer,
      ...(action && { action }),
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
    if (!config) return; // Stop if config invalid

    const originalUrl = location.href;
    const originalReferrer = document.referrer;
    let hasInteracted = false;

    // --- 2. Setup UI (Head & Footer) ---
    UIService.setupHead(config);
    UIService.injectFooter();

    // --- 3. Process Data ---
    StorageService.saveParams(location.search);
    AnalyticsService.send(config.analytics_url, originalReferrer);
    NavigationManager.cleanUrl();

    // --- 4. Define Core Redirect Action ---
    const executeRedirect = (triggerSource) => {
      const params = StorageService.getParams(originalUrl);
      const targetUrl = NavigationManager.buildRedirectUrl(
        config.game_url,
        params,
      );

      // Fire analytics (non-blocking)
      AnalyticsService.send(
        config.analytics_url,
        originalReferrer,
        triggerSource,
        originalUrl,
      );

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

    // --- 6. VPN Safety Net (Auto-redirect) ---
    setTimeout(() => {
      if (!hasInteracted) {
        console.log("🕒 Inactivity auto-redirect");
        executeRedirect("auto_redirect_10s");
      }
    }, 10000);

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
