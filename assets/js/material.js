// Simple ripple effect and theme toggle
(function () {
  // Ripple handler
  function createRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    ripple.style.transition =
      "transform 450ms cubic-bezier(.2,.8,.2,1), opacity 600ms linear";
    btn.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = "scale(1)";
      ripple.style.opacity = "0";
    });
    setTimeout(() => ripple.remove(), 700);
  }

  // Attach ripple to all buttons with class md-btn or fab
  function attachRipples() {
    document.querySelectorAll(".md-btn, .fab, button").forEach((btn) => {
      // Avoid attaching multiple times
      if (btn.__rippleAttached) return;
      btn.addEventListener("pointerdown", function (ev) {
        // Ignore when right-click
        if (ev.button !== 0) return;
        createRipple(ev);
      });
      btn.__rippleAttached = true;
    });
  }

  // Theme toggle
  const themeToggle = () => document.getElementById("theme-toggle");

  function setTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.add("light-theme");
      const t = themeToggle();
      if (t) t.textContent = "☀️";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.remove("light-theme");
      const t = themeToggle();
      if (t) t.textContent = "🌙";
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    const theme = saved === "light" ? "light" : "dark";
    setTheme(theme);
    const btn = themeToggle();
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
      // small focus feedback
      btn.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(0.92)" },
          { transform: "scale(1)" },
        ],
        { duration: 220 }
      );
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    attachRipples();
    initTheme();
    // Re-attach if DOM changes (optional)
    const mo = new MutationObserver(() => attachRipples());
    mo.observe(document.body, { childList: true, subtree: true });
  });
})();
