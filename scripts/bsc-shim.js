/*
 * bsc-shim.js — drop into any Bow Sports Capital GitHub Pages activity to
 * auto-submit claim codes to the parent unified app.
 *
 * How to install:
 *   <script src="https://bowsportscapital.com/shim/bsc-shim.js"></script>
 *   Then, when your activity generates a claim code:
 *     window.BSC.claim("T201-M1-L2-GMN", { score: 125, tier: "GOLD" });
 *
 * Behaviour:
 *   - postMessages { type: "BSC_CLAIM", code, payload } to the parent
 *   - Also shows a small toast at the top of the iframe so students see it
 *     fired (useful when an activity is opened in a new tab instead of
 *     embedded).
 */
(function (global) {
  if (global.BSC && global.BSC.__installed) return;

  function postToParent(code, payload) {
    try {
      if (global.parent && global.parent !== global) {
        global.parent.postMessage(
          { type: "BSC_CLAIM", code: String(code), payload: payload || null },
          "*",
        );
      }
    } catch (err) {
      // Intentionally swallow — parent might be cross-origin; postMessage itself
      // catches that case internally.
      console.warn("[BSC] postMessage failed:", err);
    }
  }

  function showToast(code) {
    try {
      var el = document.createElement("div");
      el.setAttribute("role", "status");
      el.style.cssText = [
        "position:fixed",
        "top:16px",
        "left:50%",
        "transform:translateX(-50%)",
        "z-index:2147483647",
        "font:600 13px/1.4 system-ui,Segoe UI,Roboto,Arial,sans-serif",
        "color:#fff",
        "background:linear-gradient(135deg,#2563eb,#1d4ed8)",
        "padding:10px 16px",
        "border-radius:999px",
        "box-shadow:0 10px 30px -12px rgba(37,99,235,0.6)",
      ].join(";");
      el.textContent = "✓ Claim code sent: " + code;
      document.body.appendChild(el);
      setTimeout(function () {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 3400);
    } catch (_e) {
      /* no-op */
    }
  }

  var queryEmail = (function () {
    try {
      var u = new URL(global.location.href);
      return u.searchParams.get("studentEmail") || null;
    } catch (_e) {
      return null;
    }
  })();

  global.BSC = {
    __installed: true,
    version: "1.0.0",
    studentEmail: queryEmail,
    /**
     * Report a claim code to the parent app.
     * @param {string} code — the claim code string (e.g. "T201-M1-L2-GMN")
     * @param {object} [payload] — optional metadata (score, tier, timing)
     */
    claim: function (code, payload) {
      if (!code) return;
      postToParent(code, payload);
      showToast(code);
    },
  };
})(window);
