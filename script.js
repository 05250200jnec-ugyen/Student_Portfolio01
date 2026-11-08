// Tells the CSS that JavaScript is running, so scroll animations can be used
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ THEME TOGGLE ============ */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function readSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage can be blocked (e.g. private mode). The toggle still works.
  }
}

const savedTheme = readSavedTheme();
if (savedTheme === "light" || savedTheme === "dark") {
  root.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  saveTheme(next);
});

/* ============ MOBILE MENU ============ */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", String(open));
  hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

hamburger.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("open"));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

/* ============ NAVBAR, BACK TO TOP, ACTIVE LINK ============ */
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
function onScroll() {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  backToTop.classList.toggle("show", window.scrollY > 300);

}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

/* ============ TYPING EFFECT ============ */
const typed = document.getElementById("typed");
const roles = [
  "Network Enthusiast",
  "Computer System & Network Student",
  "Python Programmer",
  "Web Developer",
];

if (typed && reduceMotion) {
  typed.textContent = roles[0];
} else if (typed) {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeStep() {
    const role = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    typed.textContent = role.slice(0, charIndex);

    let delay = deleting ? 40 : 80;
    if (!deleting && charIndex === role.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    setTimeout(typeStep, delay);
  }

  typeStep();
}

/* ============ TERMINAL ============ */
const terminalBody = document.getElementById("terminalBody");
const terminalText = `$ whoami
ugyen_dorji

$ cat focus.txt
networking, systems, coding

$ show goal
Network and Systems Engineer

$ ping opportunities
reply received: open to internships`;

if (terminalBody && reduceMotion) {
  terminalBody.textContent = terminalText;
} else if (terminalBody) {
  let terminalIndex = 0;

  function terminalStep() {
    terminalIndex += 1;
    terminalBody.textContent = terminalText.slice(0, terminalIndex);
    if (terminalIndex < terminalText.length) setTimeout(terminalStep, 28);
  }

  terminalStep();
}

/* ============ SCROLL REVEAL ============ */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

/* ============ SKILL TABS & BARS ============ */
const tabButtons = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".skills-panel");

function fillBars(panel) {
  // Wait one frame so the width change animates after the panel appears
  requestAnimationFrame(() => {
    panel.querySelectorAll(".fill").forEach((bar) => {
      bar.style.width = `${bar.dataset.level}%`;
    });
  });
}

tabButtons.forEach((button) => {
  button.setAttribute("aria-selected", String(button.classList.contains("active")));

  button.addEventListener("click", () => {
    tabButtons.forEach((other) => {
      const isCurrent = other === button;
      other.classList.toggle("active", isCurrent);
      other.setAttribute("aria-selected", String(isCurrent));
    });
    panels.forEach((panel) => {
      const isCurrent = panel.id === button.dataset.tab;
      panel.classList.toggle("active", isCurrent);
      if (isCurrent) fillBars(panel);
    });
  });
});

// Fill the first panel the first time the Skills section is seen
const skillsSection = document.getElementById("skills");
if (skillsSection && "IntersectionObserver" in window) {
  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        fillBars(document.querySelector(".skills-panel.active"));
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  skillsObserver.observe(skillsSection);
} else if (skillsSection) {
  fillBars(document.querySelector(".skills-panel.active"));
}

/* ============ PROJECT FILTER ============ */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((other) => other.classList.toggle("active", other === button));

    projectCards.forEach((card) => {
      // A card can have more than one category, e.g. "code network"
      const categories = card.dataset.category.split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !show);
      if (show) card.classList.add("visible");
    });
  });
});

/* ============ CONTACT FORM ============ */
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const myEmail = document.getElementById("emailText")?.textContent.trim();

if (form) {
  function setError(input, message) {
    const group = input.closest(".form-group");
    group.classList.toggle("invalid", Boolean(message));
    group.querySelector(".error").textContent = message;
  }

  function validate(input) {
    const value = input.value.trim();
    let message = "";

    if (!value) {
      message = `Please enter your ${input.name}.`;
    } else if (input.name === "name" && value.length < 2) {
      message = "Name must be at least 2 characters.";
    } else if (input.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (input.name === "message" && value.length < 10) {
      message = "Message must be at least 10 characters.";
    }

    setError(input, message);
    return !message;
  }

  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.closest(".form-group").classList.contains("invalid")) validate(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = [...fields].map(validate);
    if (results.includes(false)) {
      formStatus.textContent = "";
      fields[results.indexOf(false)].focus();
      return;
    }

    // There is no server, so the message opens in the visitor's email app
    const body = `${form.message.value.trim()}\n\nFrom: ${form.name.value.trim()} (${form.email.value.trim()})`;
    window.location.href =
      `mailto:${myEmail}?subject=${encodeURIComponent(form.subject.value.trim())}` +
      `&body=${encodeURIComponent(body)}`;

    formStatus.textContent = "Opening your email app to send this message…";
  });
}

/* ============ FOOTER YEAR ============ */
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Profile picture slideshow =====
(function () {
  const avatarBox = document.getElementById("avatar");
  if (!avatarBox) {
    console.log("Slideshow: no element with id='avatar' found");
    return;
  }

  const avatarPics = avatarBox.querySelectorAll("img");
  console.log("Slideshow: found " + avatarPics.length + " photos");
  if (avatarPics.length < 2) return;

  let avatarIndex = 0;
  let avatarTimer = null;

  function showNextPic() {
    avatarPics[avatarIndex].classList.remove("active");
    avatarIndex = (avatarIndex + 1) % avatarPics.length;
    avatarPics[avatarIndex].classList.add("active");
  }

  function startAvatarSlides() {
    clearInterval(avatarTimer);
    avatarTimer = setInterval(showNextPic, 2000);
  }

  startAvatarSlides();
  avatarBox.addEventListener("mouseenter", () => clearInterval(avatarTimer));
  avatarBox.addEventListener("mouseleave", startAvatarSlides);
})();
