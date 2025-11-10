// Navigation scroll effect
const nav = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener("click", (e) => {
    navLinks.classList.toggle("active");
    // toggle icon between hamburger and close
    mobileMenuToggle.textContent = navLinks.classList.contains("active")
      ? "✕"
      : "☰";
    e.stopPropagation();
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("nav")) {
      navLinks.classList.remove("active");
      mobileMenuToggle.textContent = "☰";
    }
  });

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenuToggle.textContent = "☰";
    });
  });
}

// Active navigation link highlighting
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 300) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href").includes(current)) {
      item.classList.add("active");
    }
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (target) {
      navLinks.classList.remove("active");
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll animations
const fadeElements = document.querySelectorAll(".fade-in");
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach((element) => {
  scrollObserver.observe(element);
});

// Skills progress animation
const skillBars = document.querySelectorAll(".skill-progress");
const skillObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const progressBar = entry.target;
      const targetWidth = progressBar.getAttribute("data-progress") + "%";
      progressBar.style.width = targetWidth;
      observer.unobserve(progressBar);
    }
  });
}, observerOptions);

skillBars.forEach((bar) => {
  skillObserver.observe(bar);
});

// Projects filter functionality
let currentFilter = "all";
const projectCards = document.querySelectorAll(".project-card");

function filterProjects(filter) {
  currentFilter = filter;
  projectCards.forEach((card) => {
    const technologies = card.getAttribute("data-technologies").split(",");
    if (filter === "all" || technologies.includes(filter)) {
      card.style.display = "flex";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 10);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

// Handle form submission
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showNotification("Message sent successfully!", "success");
        contactForm.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      showNotification("Failed to send message. Please try again.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

// Notification system
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Theme toggle functionality
const themeToggle = document.querySelector("#theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLightTheme = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLightTheme ? "light" : "dark");
  });

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}

// Lazy loading images
const lazyImages = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach((img) => {
  imageObserver.observe(img);
});

// Initialize typed.js if element exists
const typedElement = document.querySelector(".typed-text");
if (typedElement && window.Typed) {
  new Typed(typedElement, {
    strings: [
      "Software Engineer",
      "Frontend Developer",
      "UI/UX Enthusiast",
      "Problem Solver",
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
  });
}

// Initialize AOS if available
if (window.AOS) {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });
}

// Preloader
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});
