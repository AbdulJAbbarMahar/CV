/**
 * main.js — GSAP interactions for Daniyal Mahar Portfolio
 * Kinetic Typography · Magnetic Buttons · Custom Cursor · Scroll Reveals
 */

(function () {
  "use strict";

  // ── Wait for GSAP + ScrollTrigger ──────────────────────────────────────────
  function waitForGSAP(cb) {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      cb();
    } else {
      setTimeout(() => waitForGSAP(cb), 50);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. KINETIC TYPOGRAPHY
  // ═══════════════════════════════════════════════════════════════════════════
  function initKineticTypography() {
    const nameEl = document.querySelector(".kinetic-name");
    if (!nameEl) return;

    // Split into word spans, then letter spans
    const words = nameEl.textContent.trim().split(/\s+/);
    nameEl.innerHTML = words
      .map(
        (word) =>
          `<span class="kinetic-word">${word
            .split("")
            .map((c) => `<span class="kinetic-letter">${c}</span>`)
            .join("")}</span>`
      )
      .join('<span class="kinetic-space"> </span>');

    const letters = nameEl.querySelectorAll(".kinetic-letter");

    // ── Entrance animation ─────────────────────────────────────────────────
    gsap.from(letters, {
      opacity: 0,
      y: 52,
      rotationX: -30,
      filter: "blur(8px)",
      duration: 0.9,
      ease: "back.out(1.7)",
      stagger: 0.025,
      delay: 0.25,
    });

    // ── Scroll-driven letter-spacing stretch ──────────────────────────────
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "80% top",
      scrub: 1.2,
      onUpdate: (self) => {
        const stretch = self.progress;
        const spacing = gsap.utils.interpolate(-0.04, 0.28, stretch);
        const opacity = gsap.utils.interpolate(1, 0, stretch * 1.4);
        gsap.set(nameEl, {
          letterSpacing: spacing + "em",
          opacity: Math.max(0, opacity),
        });
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HERO ENTRANCE SEQUENCE
  // ═══════════════════════════════════════════════════════════════════════════
  function initHeroEntrance() {
    const tl = gsap.timeline({ delay: 0.1 });

    tl.from(".hero-pill", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
    })
      .from(
        ".hero-subtitle-line",
        { opacity: 0, y: 16, duration: 0.55, ease: "power3.out" },
        "-=0.15"
      )
      .from(
        ".hero-sub-text",
        { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
        "-=0.15"
      )
      .from(
        ".hero-cta-group",
        { opacity: 0, y: 20, duration: 0.55, ease: "power3.out" },
        "-=0.1"
      )
      .from(
        ".hero-stats",
        { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
        "-=0.1"
      );

    // Hero content parallax on scroll
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
      onUpdate: (self) => {
        gsap.set(".hero-content", {
          y: self.progress * 80,
        });
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. SCROLL REVEALS
  // ═══════════════════════════════════════════════════════════════════════════
  function initScrollReveals() {
    // Standard fade-up reveal
    gsap.utils.toArray(".reveal").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        opacity: 0,
        y: 36,
        filter: "blur(4px)",
        duration: 0.75,
        ease: "power3.out",
        delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
      });
    });

    // Scale reveal for cards
    gsap.utils.toArray(".reveal-scale").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        opacity: 0,
        scale: 0.93,
        filter: "blur(3px)",
        duration: 0.7,
        ease: "back.out(1.4)",
        delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
      });
    });

    // Stagger children reveals
    gsap.utils.toArray(".stagger-parent").forEach((parent) => {
      const children = parent.querySelectorAll(".stagger-child");
      gsap.from(children, {
        scrollTrigger: {
          trigger: parent,
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 28,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. MAGNETIC BUTTONS
  // ═══════════════════════════════════════════════════════════════════════════
  function initMagneticButtons() {
    const magnets = document.querySelectorAll(".magnetic");

    magnets.forEach((btn) => {
      const strength = 0.35;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        gsap.to(btn, {
          x: dx,
          y: dy,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.5)",
        });
      });

      // Shimmer effect on primary buttons
      if (btn.classList.contains("btn-primary")) {
        const shimmer = btn.querySelector(".btn-shimmer");
        if (shimmer) {
          btn.addEventListener("mouseenter", () => {
            gsap.fromTo(
              shimmer,
              { x: "-110%" },
              { x: "110%", duration: 0.55, ease: "power2.inOut" }
            );
          });
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. CUSTOM CURSOR
  // ═══════════════════════════════════════════════════════════════════════════
  function initCursor() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    document.body.style.cursor = "none";

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let isHovering = false;

    document.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        gsap.set(dot, { x: mx, y: my });
      },
      { passive: true }
    );

    // Lagging ring with GSAP ticker
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      gsap.set(ring, { x: rx, y: ry });
    });

    // Hover states
    const interactives = document.querySelectorAll(
      "a, button, .bento-card, .chip-item, input, textarea, select"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        isHovering = true;
        gsap.to(dot, { scale: 1.8, duration: 0.25, ease: "power2.out" });
        gsap.to(ring, {
          scale: 1.65,
          borderColor: "oklch(72% 0.12 75)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
      el.addEventListener("mouseleave", () => {
        isHovering = false;
        gsap.to(dot, { scale: 1, duration: 0.25 });
        gsap.to(ring, {
          scale: 1,
          borderColor: "oklch(72% 0.12 75 / 0.5)",
          duration: 0.3,
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. NAVBAR
  // ═══════════════════════════════════════════════════════════════════════════
  function initNavbar() {
    const nav = document.getElementById("nav");
    if (!nav) return;

    ScrollTrigger.create({
      start: "top -40",
      onUpdate: (self) => {
        if (self.scroller.scrollY > 40) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      },
    });

    // Hamburger
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    function openMobileMenu() {
      mobileMenu.classList.add("open");
      hamburger.classList.add("open");
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        mobileMenu,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      const links = mobileMenu.querySelectorAll("a");
      gsap.fromTo(
        links,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.06,
          delay: 0.1,
        }
      );
    }

    function closeMobileMenu() {
      gsap.to(mobileMenu, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          mobileMenu.classList.remove("open");
          hamburger.classList.remove("open");
          document.body.style.overflow = "";
        },
      });
    }

    // Close on nav link click
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMobileMenu);
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });

    // Expose for inline onclick use
    window.closeMobileMenu = closeMobileMenu;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. SCROLL TO TOP
  // ═══════════════════════════════════════════════════════════════════════════
  function initScrollTop() {
    const btn = document.getElementById("scroll-top");
    if (!btn) return;

    ScrollTrigger.create({
      start: "top -400",
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to(btn, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.35, ease: "back.out(1.7)" });
        } else {
          gsap.to(btn, { opacity: 0, y: 12, pointerEvents: "none", duration: 0.25 });
        }
      },
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Initial state
    gsap.set(btn, { opacity: 0, y: 12, pointerEvents: "none" });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. BENTO CARDS HOVER
  // ═══════════════════════════════════════════════════════════════════════════
  function initBentoHover() {
    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -6,
          boxShadow: "0 24px 60px oklch(0% 0 0 / 0.5)",
          duration: 0.35,
          ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          boxShadow: "0 0 0 oklch(0% 0 0 / 0)",
          duration: 0.5,
          ease: "elastic.out(1, 0.6)",
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. CHIP HOVER
  // ═══════════════════════════════════════════════════════════════════════════
  function initChipHover() {
    document.querySelectorAll(".chip-item").forEach((chip) => {
      chip.addEventListener("mouseenter", () => {
        gsap.to(chip, { y: -2, duration: 0.2, ease: "power2.out" });
      });
      chip.addEventListener("mouseleave", () => {
        gsap.to(chip, { y: 0, duration: 0.3, ease: "elastic.out(1, 0.6)" });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. CONTACT FORM
  // ═══════════════════════════════════════════════════════════════════════════
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = form.querySelector(".form-submit-btn");
      const btnText = btn.querySelector(".btn-label");
      const successEl = document.getElementById("form-success");
      const errorEl = document.getElementById("form-error");

      if (!btn || !btnText) return;

      successEl.style.display = "none";
      errorEl.style.display = "none";
      btn.disabled = true;
      btnText.textContent = "Sending...";

      try {
        const res = await fetch("https://formspree.io/f/xgolkenv", {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          btnText.textContent = "✓ Sent!";
          btn.style.background = "oklch(74% 0.2 142)";
          form.reset();
          gsap.fromTo(
            successEl,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
          );
          successEl.style.display = "block";
          setTimeout(() => {
            btnText.textContent = "Send Message →";
            btn.style.background = "";
            btn.disabled = false;
            gsap.to(successEl, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => (successEl.style.display = "none"),
            });
          }, 5000);
        } else {
          throw new Error("Request failed");
        }
      } catch {
        btnText.textContent = "Try Again →";
        btn.disabled = false;
        gsap.fromTo(
          errorEl,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 }
        );
        errorEl.style.display = "block";
        setTimeout(() => {
          btnText.textContent = "Send Message →";
          gsap.to(errorEl, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => (errorEl.style.display = "none"),
          });
        }, 4000);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. STAT COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════════════════════
  function initStatCounters() {
    document.querySelectorAll(".stat-counter").forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            { val: 0 },
            { val: target, duration: 1.4, ease: "power2.out" },
            {
              val: target,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val);
              },
            }
          );
          // Direct approach
          let start = 0;
          const step = () => {
            start += Math.ceil((target - start) / 12);
            el.textContent = start;
            if (start < target) requestAnimationFrame(step);
            else el.textContent = target;
          };
          step();
        },
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════════════════════
  function boot() {
    gsap.registerPlugin(ScrollTrigger);

    initKineticTypography();
    initHeroEntrance();
    initScrollReveals();
    initMagneticButtons();
    initCursor();
    initNavbar();
    initScrollTop();
    initBentoHover();
    initChipHover();
    initContactForm();
    initStatCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => waitForGSAP(boot));
  } else {
    waitForGSAP(boot);
  }
})();
