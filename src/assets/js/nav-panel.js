/* ============================================================
   NAV PANEL — overlay plein écran, ouverture/fermeture, focus trap
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const trigger = document.getElementById("nav-trigger");
  const panel = document.getElementById("nav-panel");
  const closeBtn = document.getElementById("nav-panel-close");

  if (!trigger || !panel || !closeBtn) return;

  let lastFocused = null;

  function getFocusable() {
    return panel.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    );
  }

  function open() {
    lastFocused = document.activeElement;
    panel.setAttribute("data-open", "true");
    trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-panel-open");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    panel.setAttribute("data-open", "false");
    trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-panel-open");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      close();
      return;
    }

    if (e.key === "Tab") {
      const focusable = Array.from(getFocusable());
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  trigger.addEventListener("click", function () {
    const isOpen = panel.getAttribute("data-open") === "true";
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  closeBtn.addEventListener("click", close);
});
