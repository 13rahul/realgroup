(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (header) {
    var onScroll = function () {
      var scrolled = window.scrollY > 12;
      header.style.boxShadow = scrolled
        ? "0 8px 24px rgba(61,42,26,0.08)"
        : "none";
      if (header.classList.contains("site-header--home")) {
        header.classList.toggle("is-scrolled", scrolled || window.scrollY > 40);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    var msg = document.getElementById("form-message");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.elements.namedItem("name") || {}).value || "";
      var phone = (form.elements.namedItem("phone") || {}).value || "";
      var message = (form.elements.namedItem("message") || {}).value || "";

      name = String(name).trim();
      phone = String(phone).trim();
      message = String(message).trim();

      if (!name || !phone || !message) {
        if (msg) {
          msg.textContent = "Please fill in your name, phone, and message.";
          msg.className = "form-message error";
        }
        return;
      }

      if (!/^[0-9+\-\s()]{8,15}$/.test(phone)) {
        if (msg) {
          msg.textContent = "Please enter a valid phone number.";
          msg.className = "form-message error";
        }
        return;
      }

      var body =
        "Name: " +
        name +
        "\nPhone: " +
        phone +
        "\n\n" +
        message;
      var mailto =
        "mailto:realmgmlimit@gmail.com?subject=" +
        encodeURIComponent("Enquiry — Real Chakki Fresh Atta") +
        "&body=" +
        encodeURIComponent(body);

      if (msg) {
        msg.textContent = "Opening your email app… Thank you for reaching out.";
        msg.className = "form-message success";
      }

      window.location.href = mailto;
      form.reset();
    });
  }
})();
