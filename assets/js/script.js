'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});



/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {

  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);

});



/**
 * skills toggle
 */

const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", function () {

    elemToggleFunc(toggleBtnBox);
    for (let i = 0; i < toggleBtns.length; i++) { elemToggleFunc(toggleBtns[i]); }
    elemToggleFunc(skillsBox);

  });
}



/**
 * dark & light theme
 */

const themeToggleBtn = document.querySelector("[data-theme-btn]");
const themeColorMeta = document.querySelector("#theme-color-meta");

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_COLOR_LIGHT = "#e8eaed";
const THEME_COLOR_DARK = "#12141a";

function setBodyTheme(mode) {
  const isLight = mode === THEME_LIGHT;

  document.body.classList.remove(isLight ? "dark_theme" : "light_theme");
  document.body.classList.add(isLight ? "light_theme" : "dark_theme");

  if (themeToggleBtn) {
    /* .active = dark mode ON (toggle appears “on”) */
    themeToggleBtn.classList.toggle("active", !isLight);
    themeToggleBtn.setAttribute("aria-label", isLight ? "Turn on dark mode" : "Turn off dark mode");
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isLight ? THEME_COLOR_LIGHT : THEME_COLOR_DARK);
  }
}

function initTheme() {
  /* Always light after refresh — dark is session-only */
  setBodyTheme(THEME_LIGHT);
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", function () {
    const next = document.body.classList.contains("light_theme") ? THEME_DARK : THEME_LIGHT;
    setBodyTheme(next);
  });
}

initTheme();



/**
 * Contact form → Web3Forms API only (avoids legacy FormSubmit URLs if an old page is cached)
 */

const contactForm = document.querySelector(".contact-form");
const contactStatus = document.getElementById("contact-form-status");

function setContactStatus(text, variant) {
  if (!contactStatus) return;
  contactStatus.textContent = text || "";
  contactStatus.hidden = !text;
  contactStatus.classList.remove("contact-form-status--ok", "contact-form-status--error");
  if (variant === "ok") contactStatus.classList.add("contact-form-status--ok");
  if (variant === "error") contactStatus.classList.add("contact-form-status--error");
}

if (contactForm) {
  contactForm.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    setContactStatus("", null);

    const keyInput = contactForm.querySelector('[name="access_key"]');
    const accessKey = keyInput && keyInput.value.trim();

    if (!accessKey) {
      setContactStatus(
        "This form is not set up yet. Please use the email address in the contact list below.",
        "error"
      );
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const payload = {
      access_key: accessKey,
      subject: contactForm.querySelector('[name="subject"]')?.value || "",
      from_name: contactForm.querySelector('[name="from_name"]')?.value || "",
      name: contactForm.querySelector('[name="name"]').value.trim(),
      email: contactForm.querySelector('[name="email"]').value.trim(),
      message: contactForm.querySelector('[name="message"]').value.trim(),
    };

    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        contactForm.reset();
        setContactStatus("Thanks — your message was sent.", "ok");
      } else {
        setContactStatus(result.message || "Could not send. Try again or use the email below.", "error");
      }
    } catch (err) {
      setContactStatus("Network error. Check your connection and try again.", "error");
    }

    submitBtn.disabled = false;
  });
}