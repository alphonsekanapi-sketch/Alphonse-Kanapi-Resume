/* ============================================================
   ALPHONSE KANAPI PORTFOLIO
   Vanilla JavaScript only
   ============================================================ */

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const progressBar = document.getElementById("scrollProgress");
const currentYear = document.getElementById("currentYear");
const navAnchors = document.querySelectorAll(".nav-links a");
const pageSections = document.querySelectorAll("main section[id]");

if (currentYear) currentYear.textContent = new Date().getFullYear();



function openMenu() {
  navLinks.classList.add("open");
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  navLinks.classList.contains("open") ? closeMenu() : openMenu();
});

navAnchors.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.11, rootMargin: "0px 0px -42px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
}

function updateScrollUI() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  siteHeader?.classList.toggle("scrolled", scrollTop > 18);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const currentSectionId = entry.target.id;
    navAnchors.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentSectionId}`);
    });
  });
}, { threshold: 0.28, rootMargin: "-15% 0px -58% 0px" });
pageSections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

// If an external project thumbnail is unavailable, the card keeps its built in fallback.
document.querySelectorAll("[data-project-preview]").forEach((image) => {
  image.addEventListener("error", () => { image.style.display = "none"; });
});
