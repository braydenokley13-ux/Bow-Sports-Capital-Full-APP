/* Published copy of bsc-shim.js — see scripts/bsc-shim.js for source. */
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
      console.warn("[BSC] postMessage failed:", err);
    }
  }
  function showToast(code) {
    try {
      var el = document.createElement("div");
      el.style.cssText = "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:2147483647;font:600 13px/1.4 system-ui,sans-serif;color:#fff;background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:10px 16px;border-radius:999px;box-shadow:0 10px 30px -12px rgba(37,99,235,.6)";
      el.textContent = "✓ Claim code sent: " + code;
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, 3400);
    } catch (_e) { /* no-op */ }
  }
  var queryEmail = null;
  try { queryEmail = new URL(global.location.href).searchParams.get("studentEmail"); } catch (_e) {}
  global.BSC = {
    __installed: true,
    version: "1.0.0",
    studentEmail: queryEmail,
    claim: function (code, payload) {
      if (!code) return;
      postToParent(code, payload);
      showToast(code);
    },
  };
})(window);
