document.addEventListener("DOMContentLoaded", () => {
  // --- Localization (i18n) Logic ---
  const currentLangNameEl = document.getElementById("currentLangName");
  const langDropdown = document.getElementById("langDropdown");
  const langBtn = document.getElementById("langBtn");
  
  const langNames = {
    en: "English",
    zh: "简体中文",
    "zh-TW": "繁體中文",
    es: "Español",
    fr: "Français"
  };

  // Get saved language or default to English
  function detectLanguage() {
    const saved = localStorage.getItem("v_lang");
    if (saved && translations[saved]) return saved;
    return "en";
  }

  function setLanguage(lang) {
    if (!translations[lang]) lang = "en";
    
    // Save to storage
    localStorage.setItem("v_lang", lang);
    
    // Update language button text
    currentLangNameEl.textContent = langNames[lang];
    
    // Set HTML lang attribute
    document.documentElement.lang = lang === "zh" || lang === "zh-TW" ? "zh" : lang;

    // Translate all standard elements
    const i18nElements = document.querySelectorAll("[data-i18n]");
    i18nElements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang][key]) {
        // If string contains HTML (e.g. bold wrappers), use innerHTML, otherwise textContent
        if (translations[lang][key].includes("<span")) {
          el.innerHTML = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    // Translate placeholders
    const i18nPlaceholders = document.querySelectorAll("[data-i18n-placeholder]");
    i18nPlaceholders.forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[lang][key]) {
        el.setAttribute("placeholder", translations[lang][key]);
      }
    });

    // Highlight active option in dropdown
    langDropdown.querySelectorAll("button").forEach(btn => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Language Dropdown Event Listeners
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = langBtn.getAttribute("aria-expanded") === "true";
    langBtn.setAttribute("aria-expanded", !expanded);
    langDropdown.classList.toggle("show");
  });

  langDropdown.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      setLanguage(selectedLang);
      langDropdown.classList.remove("show");
      langBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    langDropdown.classList.remove("show");
    langBtn.setAttribute("aria-expanded", "false");
  });

  // --- Mobile Menu Logic ---
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.querySelector(".main-nav");
  const siteHeader = document.querySelector(".site-header");

  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("open");
    mainNav.classList.toggle("show");
    siteHeader.classList.toggle("nav-open");
  });

  // Close mobile nav when clicking on a link
  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("open");
      mainNav.classList.remove("show");
      siteHeader.classList.remove("nav-open");
    });
  });

  // --- FAQ Accordion Logic ---
  const faqTriggers = document.querySelectorAll(".faq-trigger");
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const faqItem = trigger.parentElement;
      const isOpen = faqItem.classList.contains("open");
      
      // Close all other FAQ items (Accordion mode)
      document.querySelectorAll(".faq-item").forEach(item => {
        item.classList.remove("open");
        item.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        faqItem.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- Header Scroll Effect ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });

  // --- Scroll Spy & Nav Link Highlight ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset header height
      const sectionId = current.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  // Initialize Language
  const initialLang = detectLanguage();
  setLanguage(initialLang);
});
