(function () {
  "use strict";

  /* ---- language toggle (EN / VI), remembered per browser ---- */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var initial = saved || ((navigator.language || "").toLowerCase().indexOf("vi") === 0 ? "vi" : "en");
  setLang(initial);

  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    try { localStorage.setItem("lang", l); } catch (e) {}
  }

  var btn = document.getElementById("lang");
  if (btn) {
    btn.addEventListener("click", function () {
      setLang(root.getAttribute("data-lang") === "en" ? "vi" : "en");
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- scroll reveal: fade in when a block enters, fade out when it leaves ---- */
  // children of [data-stagger] get revealed one after another
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.setAttribute("data-reveal", "up");
      child.style.setProperty("--d", i * 90 + "ms");
    });
  });

  var targets = document.querySelectorAll("[data-reveal]");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle("in", e.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- contact form (posts to Formspree, no backend needed) ---- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  function msg(text, cls) {
    status.textContent = text;
    status.className = cls || "";
  }
  function t(en, vi) { return root.getAttribute("data-lang") === "vi" ? vi : en; }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      msg(t("Form is not configured yet — please email company@mesa.international directly.",
            "Form chưa được cấu hình — vui lòng gửi mail trực tiếp tới company@mesa.international."), "err");
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    msg(t("Sending…", "Đang gửi…"));

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        msg(t("Thanks — your message was sent. We'll reply by email.",
              "Cảm ơn bạn — tin nhắn đã được gửi. Chúng tôi sẽ phản hồi qua email."), "ok");
      } else {
        throw new Error("bad status");
      }
    }).catch(function () {
      msg(t("Could not send. Please email company@mesa.international instead.",
            "Gửi không thành công. Vui lòng gửi mail tới company@mesa.international."), "err");
    }).finally(function () {
      submit.disabled = false;
    });
  });
})();
