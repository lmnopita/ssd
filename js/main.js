/* ==========================================================================
   SEATTLE SENSITIVE DOGS — main.js
   Progressive enhancement only. Every feature no-ops cleanly when its
   markup is absent, so this one file is safe to include on every page.
   1. Mobile nav toggle
   2. FAQ accordion (animates native <details>; works without JS)
   3. Current year in footer
   4. Contact form: Formspree AJAX submit with inline status
   5. Scroll reveal (respects prefers-reduced-motion)
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ------------------------------------------------------------------
     1. Mobile nav toggle
     Markup contract: <button class="nav-toggle" aria-expanded="false"
     aria-controls="site-nav"> + <nav id="site-nav" class="site-nav">
  ------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    var closeNav = function () {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close on Escape, restoring focus to the toggle
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    // Close when a nav link is chosen (relevant for same-page anchors)
    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    // Close when clicking outside the header
    document.addEventListener("click", function (event) {
      if (
        siteNav.classList.contains("is-open") &&
        !event.target.closest(".site-header")
      ) {
        closeNav();
      }
    });
  }

  /* ------------------------------------------------------------------
     2. FAQ accordion — gentle height animation over native <details>
     Markup contract: <details class="faq-item"><summary>…</summary>
     <div class="faq-item__a">…</div></details>
     Without JS (or with reduced motion) the native toggle just works.
  ------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll("details.faq-item");

  if (faqItems.length && !prefersReducedMotion && "animate" in Element.prototype) {
    faqItems.forEach(function (item) {
      var summary = item.querySelector("summary");
      var answer = item.querySelector(".faq-item__a");
      if (!summary || !answer) return;

      summary.addEventListener("click", function (event) {
        if (item.dataset.animating === "true") {
          event.preventDefault();
          return;
        }

        if (item.open) {
          // Animate closed, then remove [open]
          event.preventDefault();
          item.dataset.animating = "true";
          var closing = answer.animate(
            [
              { height: answer.offsetHeight + "px", opacity: 1 },
              { height: "0px", opacity: 0 }
            ],
            { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
          answer.style.overflow = "hidden";
          closing.onfinish = closing.oncancel = function () {
            item.open = false;
            answer.style.overflow = "";
            delete item.dataset.animating;
          };
        } else {
          // Let it open natively, then animate in
          requestAnimationFrame(function () {
            if (!item.open) return;
            item.dataset.animating = "true";
            answer.style.overflow = "hidden";
            var opening = answer.animate(
              [
                { height: "0px", opacity: 0 },
                { height: answer.offsetHeight + "px", opacity: 1 }
              ],
              { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
            );
            opening.onfinish = opening.oncancel = function () {
              answer.style.overflow = "";
              delete item.dataset.animating;
            };
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     3. Current year in footer
     Markup contract: <span class="js-year">2026</span> (fallback text)
  ------------------------------------------------------------------ */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------
     4. Contact form — Formspree AJAX submit
     Markup contract (contact.html):
     <form class="js-contact-form" action="https://formspree.io/f/…" method="POST">
       …fields…
       <p class="form__status" role="status" aria-live="polite" hidden></p>
       <button type="submit">…</button>
     </form>
     Without JS the form posts to Formspree natively — nothing breaks.
  ------------------------------------------------------------------ */
  var contactForm = document.querySelector("form.js-contact-form");

  if (contactForm && window.fetch) {
    var statusEl = contactForm.querySelector(".form__status");
    var submitBtn = contactForm.querySelector('button[type="submit"]');

    var showStatus = function (message, kind) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("is-success", "is-error");
      statusEl.classList.add(kind === "success" ? "is-success" : "is-error");
      statusEl.hidden = false;
    };

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }
      if (statusEl) statusEl.hidden = true;

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.reset();
            showStatus(
              "Thank you — your note is on its way. I reply to everything within one business day, usually much faster.",
              "success"
            );
          } else {
            return response
              .json()
              .catch(function () { return {}; })
              .then(function (data) {
                var msg =
                  data && data.errors && data.errors.length
                    ? data.errors.map(function (e) { return e.message; }).join(" ")
                    : "Something went wrong sending your message. Please try again, or just text me at 206-657-7315.";
                showStatus(msg, "error");
              });
          }
        })
        .catch(function () {
          showStatus(
            "It looks like the message could not be sent — maybe a connection hiccup. Please try again, or text me at 206-657-7315.",
            "error"
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.label || "Send";
          }
        });
    });
  }

  /* ------------------------------------------------------------------
     5. Scroll reveal — content is visible by default; we only enable
     the effect when the browser supports it and motion is allowed.
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    document.documentElement.classList.add("js-reveal");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    revealEls.forEach(function (el) {
      // Elements already in the initial viewport appear instantly
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ------------------------------------------------------------------
     6. Paw trail — a dog walks down the page beside you as you scroll.
     Purely decorative: built in JS so it never ships to users who have
     reduced motion on, or to narrow screens with no margin to spare.
     Paws alternate left/right like a real gait and step in as you pass.
  ------------------------------------------------------------------ */
  (function pawTrail() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia || !window.matchMedia("(min-width: 86em)").matches) return;

    var PAW = "M6.9 1.2c.9 0 1.6 1 1.6 2.2S7.8 5.6 6.9 5.6 5.3 4.6 5.3 3.4 6 1.2 6.9 1.2zm4.2 0c.9 0 1.6 1 1.6 2.2s-.7 2.2-1.6 2.2-1.6-1-1.6-2.2.7-2.2 1.6-2.2zM3.2 4.6c.8 0 1.5.9 1.5 2s-.7 2-1.5 2-1.5-.9-1.5-2 .7-2 1.5-2zm11.6 0c.8 0 1.5.9 1.5 2s-.7 2-1.5 2-1.5-.9-1.5-2 .7-2 1.5-2zM9 7.1c2.2 0 4 1.8 4 4 0 1.6-1.1 2.6-2.6 2.6-.6 0-1-.2-1.4-.2s-.8.2-1.4.2C6.1 13.7 5 12.7 5 11.1c0-2.2 1.8-4 4-4z";

    var trail = document.createElement("div");
    trail.className = "paw-trail";
    trail.setAttribute("aria-hidden", "true");

    var docHeight = document.body.scrollHeight;
    var count = Math.max(8, Math.min(40, Math.round(docHeight / 260)));
    var paws = [];

    for (var i = 0; i < count; i++) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 18 15");
      svg.setAttribute("class", "paw-trail__paw");
      var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", PAW);
      svg.appendChild(p);
      // natural gait: alternate side to side, with a slight rotation
      svg.style.top = ((i + 0.5) / count * 100) + "vh";
      svg.style.left = (i % 2 === 0 ? 0 : 14) + "px";
      svg.style.transform += " rotate(" + (i % 2 === 0 ? -12 : 12) + "deg)";
      trail.appendChild(svg);
      paws.push(svg);
    }
    document.body.appendChild(trail);

    // Step the paws in based on how far down the page you are.
    var ticking = false;
    function step() {
      var max = document.body.scrollHeight - window.innerHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      var walked = Math.round(pct * paws.length);
      for (var i = 0; i < paws.length; i++) {
        paws[i].classList.toggle("is-stepped", i < walked);
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(step); ticking = true; }
    }, { passive: true });
    step();
  })();
})();
