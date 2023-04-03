!(function () {
  "use strict";
  var a = window.location,
    o = window.document,
    // r = o.currentScript || window.myAnalyticsScript;
    s = "https://analytics.flolio.com/api/event";

  // get utms from url and store in ls
  const queryParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  for (let [key, value] of queryParams) {
    if (key.startsWith("utm_")) {
      utmParams[key] = value;
    }
  }
  if (Object.keys(utmParams).length) {
    localStorage.setItem("flo_utms", JSON.stringify(utmParams));
  }

  // get referrer from page and store in ls for later events
  const referrer = document.referrer;
  // Check if the referrer is external
  if (referrer && !referrer.startsWith(window.location.origin)) {
    localStorage.setItem("flo_ref", referrer); // -> check for this value first, if not exists, then pass o.referrer || null
  }

  function l(t) {
    console.warn("Ignoring Event: " + t);
  }
  function t(t, e) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(a.hostname) ||
      "file:" === a.protocol
    )
      return l("localhost");
    if (
      !(
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress
      )
    ) {
      try {
        if ("true" === window.localStorage.plausible_ignore)
          return l("localStorage flag");
      } catch (t) {}
      // Get the utm parameters from local storage
      const utmParams = JSON.parse(localStorage.getItem("flo_utms"));
      const floRef = localStorage.getItem("flo_ref") || null;

      // Create an array to hold the search query parameters
      const queryParams = [];

      // Loop through the utm parameters and add them to the query params array
      for (const key in utmParams) {
        if (utmParams.hasOwnProperty(key)) {
          queryParams.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(utmParams[key])}`
          );
        }
      }
      // Create the search query string by joining the query params with "&"
      const searchQuery =
        queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

      // Attach the search query to the href
      const hrefWithUtm = a.href + (a.href.includes("utm") ? "" : searchQuery);
      // console.log({ hrefWithUtm });
      var i = {},
        n =
          ((i.n = t),
          (i.u = hrefWithUtm),
          (i.d = "exceed.story-demo.ogn-review.net-2"),
          // (i.d = r.getAttribute("data-domain")),
          (i.r = floRef || null),
          e && e.meta && (i.m = JSON.stringify(e.meta)),
          e && e.props && (i.p = e.props),
          new XMLHttpRequest());
      n.open("POST", s, !0),
        n.setRequestHeader("Content-Type", "text/plain"),
        n.send(JSON.stringify(i)),
        (n.onreadystatechange = function () {
          4 === n.readyState && e && e.callback && e.callback();
        });
    }
  }
  var e = (window.plausible && window.plausible.q) || [];
  window.plausible = t;
  for (var i, n = 0; n < e.length; n++) t.apply(this, e[n]);
  function p() {
    i !== a.pathname && ((i = a.pathname), t("pageview"));
  }
  var w,
    c = window.history;
  c.pushState &&
    ((w = c.pushState),
    (c.pushState = function () {
      w.apply(this, arguments), p();
    }),
    window.addEventListener("popstate", p)),
    "prerender" === o.visibilityState
      ? o.addEventListener("visibilitychange", function () {
          i || "visible" !== o.visibilityState || p();
        })
      : p();
})();
