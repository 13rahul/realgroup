(function () {
  "use strict";

  var PDF_NAME = "Real-Chakki-Fresh-Atta-Export-Brochure.pdf";
  var FORM_URL =
    "https://ultralooper.com/f/e9360fadb709510a53359692384a7c87?embed=1";
  var ULTRA_ORIGINS = {
    "https://ultralooper.com": true,
    "https://www.ultralooper.com": true,
  };

  var script = document.currentScript;
  var assetBase = script
    ? script.getAttribute("src").replace(/js\/brochure-modal\.js(\?.*)?$/, "")
    : "";

  if (!document.getElementById("brochure-modal-critical")) {
    var critical = document.createElement("style");
    critical.id = "brochure-modal-critical";
    critical.textContent =
      ".brochure-modal{display:none!important}.brochure-modal.is-open{display:flex!important}";
    document.head.appendChild(critical);
  }

  if (!document.querySelector('link[href*="brochure-modal.css"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = assetBase + "css/brochure-modal.css?v=6";
    document.head.appendChild(link);
  }

  var modal = null;
  var iframe = null;
  var closeBtn = null;
  var floater = null;
  var pendingPdfUrl = "";
  var lastFocus = null;
  var listenersBound = false;

  function getDefaultPdfPath() {
    if (/\/brochure(\/|$)/.test(window.location.pathname)) {
      return "Real-Chakki-Fresh-Atta-Export-Brochure.pdf";
    }
    return "brochure/Real-Chakki-Fresh-Atta-Export-Brochure.pdf";
  }

  function ensureFloater() {
    if (floater || document.getElementById("brochure-floater")) {
      floater = document.getElementById("brochure-floater");
      return floater;
    }

    floater = document.createElement("a");
    floater.id = "brochure-floater";
    floater.className = "brochure-floater js-brochure-download";
    floater.href = "#";
    floater.setAttribute("data-brochure-pdf", getDefaultPdfPath());
    floater.setAttribute("aria-label", "Download brochure");
    floater.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4h14v-2H5v2z"/></svg>' +
      "<span>Download brochure</span>";
    document.body.appendChild(floater);
    document.body.classList.add("brochure-floater-active");
    return floater;
  }

  function setFloaterVisible(show) {
    if (!floater) {
      return;
    }
    floater.classList.toggle("is-hidden", !show);
  }

  function ensureModal() {
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.className = "brochure-modal";
    modal.id = "brochure-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    modal.innerHTML =
      '<div class="brochure-modal__backdrop" data-brochure-close></div>' +
      '<div class="brochure-modal__panel" role="dialog" aria-modal="true" aria-label="Brochure download form">' +
      '<div class="brochure-modal__accent" aria-hidden="true"></div>' +
      '<button type="button" class="brochure-modal__close" aria-label="Close">&times;</button>' +
      '<div class="brochure-modal__frame-wrap">' +
      '<iframe class="brochure-modal__frame" title="Brochure download form" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" scrolling="no"></iframe>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);

    iframe = modal.querySelector(".brochure-modal__frame");
    closeBtn = modal.querySelector(".brochure-modal__close");

    closeBtn.addEventListener("click", closeModal);
    modal
      .querySelector("[data-brochure-close]")
      .addEventListener("click", closeModal);

    if (!listenersBound) {
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
          closeModal();
        }
      });

      window.addEventListener("message", function (e) {
        if (!modal || !modal.classList.contains("is-open") || !ULTRA_ORIGINS[e.origin]) {
          return;
        }
        var data = e.data;
        if (typeof data === "object" && data && data.height) {
          var h = parseInt(data.height, 10);
          if (h > 0 && h < 900) {
            iframe.style.height = h + "px";
          }
        }
        if (isSubmitMessage(data) && pendingPdfUrl) {
          window.location.href = pendingPdfUrl;
        }
      });

      listenersBound = true;
    }

    return modal;
  }

  function resolveUrl(path) {
    var anchor = document.createElement("a");
    anchor.href = path;
    return anchor.href;
  }

  function getPdfUrl(trigger) {
    var dataPdf = trigger.getAttribute("data-brochure-pdf");
    if (dataPdf) {
      return resolveUrl(dataPdf);
    }
    var href = trigger.getAttribute("href") || "";
    if (
      href.indexOf(PDF_NAME) !== -1 &&
      href !== "#" &&
      href.indexOf("javascript:") !== 0
    ) {
      return resolveUrl(href);
    }
    return "";
  }

  function isSubmitMessage(data) {
    if (!data) {
      return false;
    }
    if (typeof data === "string") {
      return /submit|success|complete/i.test(data);
    }
    if (typeof data === "object") {
      var key = String(
        data.type || data.event || data.action || data.status || data.message || ""
      ).toLowerCase();
      return (
        /submit|success|complete/.test(key) ||
        data.submitted === true ||
        data.success === true
      );
    }
    return false;
  }

  function openModal(pdfUrl) {
    ensureModal();
    pendingPdfUrl = pdfUrl;
    lastFocus = document.activeElement;
    iframe.style.height = "";
    iframe.src = FORM_URL;
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setFloaterVisible(false);
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
    document.body.style.overflow = "";
    iframe.src = "about:blank";
    setFloaterVisible(true);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  document.addEventListener(
    "click",
    function (e) {
      var trigger =
        e.target.closest(".js-brochure-download") ||
        e.target.closest('a[href*="' + PDF_NAME + '"]');
      if (!trigger) {
        return;
      }
      var pdfUrl = getPdfUrl(trigger);
      if (!pdfUrl) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openModal(pdfUrl);
    },
    true
  );

  ensureFloater();
})();
