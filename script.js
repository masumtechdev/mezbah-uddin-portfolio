"use strict";


/* ==========================================
   ALWAYS START FROM HOMEPAGE AFTER RELOAD
========================================== */

if ("scrollRestoration" in history) {

  history.scrollRestoration =
    "manual";

}


const resetToHome = () => {

  if (location.hash) {

    history.replaceState(
      null,
      "",
      location.pathname +
      location.search
    );

  }


  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

};


/* Run immediately */

resetToHome();


/* Run again after full page load */

window.addEventListener(
  "load",
  resetToHome,
  {
    once: true
  }
);


/* Handle browser back-forward cache */

window.addEventListener(
  "pageshow",
  event => {

    if (event.persisted) {

      resetToHome();

    }

  }
);


/* ==========================================
   MAIN
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {


    const body =
      document.body;


    const header =
      document.getElementById(
        "siteHeader"
      );


    const menuButton =
      document.getElementById(
        "menuButton"
      );


    const navigation =
      document.getElementById(
        "mainNavigation"
      );


    const scrollProgress =
      document.getElementById(
        "scrollProgress"
      );


    const currentYear =
      document.getElementById(
        "currentYear"
      );


    const portraitImage =
      document.getElementById(
        "portraitImage"
      );


    const internalLinks = [
      ...document.querySelectorAll(
        'a[href^="#"]'
      )
    ];


    const navigationLinks = [
      ...document.querySelectorAll(
        ".main-navigation > a[href^='#']"
      )
    ];


    const sections = [
      ...document.querySelectorAll(
        "main section[id]"
      )
    ];


    const revealElements = [
      ...document.querySelectorAll(
        ".reveal"
      )
    ];


    const counters = [
      ...document.querySelectorAll(
        ".counter"
      )
    ];


    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    let ticking =
      false;


    /* ======================================
       CURRENT YEAR
    ====================================== */

    if (currentYear) {

      currentYear.textContent =
        new Date().getFullYear();

    }


    /* ======================================
       MOBILE CHECK
    ====================================== */

    const isMobile =
      () =>
        window.innerWidth <= 900;


    /* ======================================
       OPEN MENU
    ====================================== */

    const openMenu =
      () => {

        if (
          !menuButton ||
          !navigation
        ) {

          return;

        }


        menuButton.classList.add(
          "active"
        );


        navigation.classList.add(
          "open"
        );


        body.classList.add(
          "menu-open"
        );


        menuButton.setAttribute(
          "aria-expanded",
          "true"
        );


        menuButton.setAttribute(
          "aria-label",
          "Close navigation"
        );

      };


    /* ======================================
       CLOSE MENU
    ====================================== */

    const closeMenu =
      () => {

        if (
          !menuButton ||
          !navigation
        ) {

          return;

        }


        menuButton.classList.remove(
          "active"
        );


        navigation.classList.remove(
          "open"
        );


        body.classList.remove(
          "menu-open"
        );


        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );


        menuButton.setAttribute(
          "aria-label",
          "Open navigation"
        );

      };


    /* Menu button */

    menuButton?.addEventListener(
      "click",
      () => {

        if (
          navigation
            ?.classList
            .contains("open")
        ) {

          closeMenu();

        } else {

          openMenu();

        }

      }
    );


    /* ESC closes menu */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closeMenu();

        }

      }
    );


    /* ======================================
       SMOOTH SCROLL
    ====================================== */

    internalLinks.forEach(
      link => {

        link.addEventListener(
          "click",
          event => {


            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {

              return;

            }


            const target =
              document.querySelector(
                href
              );


            if (!target) {

              return;

            }


            event.preventDefault();


            closeMenu();


            const offset =
              header
                ? header.offsetHeight
                : 0;


            const destination =
              target
                .getBoundingClientRect()
                .top +
              window.scrollY -
              offset +
              6;


            window.scrollTo({

              top:
                Math.max(
                  destination,
                  0
                ),

              behavior:
                reducedMotion
                  ? "auto"
                  : "smooth"

            });


            /*
              Keep URL clean.
              No #experience / #contact
              left in URL.
            */

            history.replaceState(
              null,
              "",
              location.pathname +
              location.search
            );

          }
        );

      }
    );


    /* ======================================
       SCROLL PROGRESS + HEADER
    ====================================== */

    const updateScrollUI =
      () => {


        const scrollTop =
          window.scrollY ||
          document.documentElement
            .scrollTop;


        const total =
          document.documentElement
            .scrollHeight -
          document.documentElement
            .clientHeight;


        const progress =
          total > 0
            ? (
              scrollTop /
              total
            ) * 100
            : 0;


        if (scrollProgress) {

          scrollProgress.style.width =
            `${progress}%`;

        }


        header?.classList.toggle(
          "scrolled",
          scrollTop > 25
        );

      };


    /* ======================================
       ACTIVE NAVIGATION
    ====================================== */

    const updateNavigation =
      () => {


        const marker =
          window.scrollY + 180;


        let currentSection =
          "";


        sections.forEach(
          section => {


            const top =
              section.offsetTop;


            const bottom =
              top +
              section.offsetHeight;


            if (
              marker >= top &&
              marker < bottom
            ) {

              currentSection =
                section.id;

            }

          }
        );


        navigationLinks.forEach(
          link => {


            const active =
              link.getAttribute(
                "href"
              ) ===
              `#${currentSection}`;


            link.classList.toggle(
              "active",
              active
            );


            if (active) {

              link.setAttribute(
                "aria-current",
                "page"
              );

            } else {

              link.removeAttribute(
                "aria-current"
              );

            }

          }
        );

      };


    /* ======================================
       SCROLL HANDLER
    ====================================== */

    const handleScroll =
      () => {


        if (ticking) {

          return;

        }


        ticking =
          true;


        requestAnimationFrame(
          () => {


            updateScrollUI();


            updateNavigation();


            ticking =
              false;

          }
        );

      };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );


    /* ======================================
       PORTRAIT FALLBACK
    ====================================== */

    if (portraitImage) {


      const portraitWrap =
        portraitImage.closest(
          ".portrait-wrap"
        );


      const showFallback =
        () => {


          portraitWrap
            ?.classList
            .add(
              "image-error"
            );

        };


      portraitImage.addEventListener(
        "error",
        showFallback
      );


      if (
        portraitImage.complete &&
        portraitImage.naturalWidth === 0
      ) {

        showFallback();

      }

    }


    /* ======================================
       COUNTER ANIMATION
    ====================================== */

    const animateCounter =
      counter => {


        if (
          counter.dataset.animated ===
          "true"
        ) {

          return;

        }


        counter.dataset.animated =
          "true";


        const target =
          Number(
            counter.dataset.count
          ) || 0;


        const suffix =
          counter.dataset.suffix ||
          "";


        const duration =
          900;


        let start =
          null;


        const frame =
          time => {


            if (!start) {

              start =
                time;

            }


            const progress =
              Math.min(
                (
                  time -
                  start
                ) /
                duration,
                1
              );


            const eased =
              1 -
              Math.pow(
                1 - progress,
                3
              );


            counter.textContent =
              `${
                Math.round(
                  target *
                  eased
                )
              }${suffix}`;


            if (
              progress < 1
            ) {

              requestAnimationFrame(
                frame
              );

            }

          };


        requestAnimationFrame(
          frame
        );

      };


    /* Observe counters */

    if (
      "IntersectionObserver"
      in window &&
      !reducedMotion
    ) {


      const counterObserver =
        new IntersectionObserver(
          entries => {


            entries.forEach(
              entry => {


                if (
                  !entry.isIntersecting
                ) {

                  return;

                }


                animateCounter(
                  entry.target
                );


                counterObserver
                  .unobserve(
                    entry.target
                  );

              }
            );

          },
          {
            threshold: 0.45
          }
        );


      counters.forEach(
        counter => {

          counterObserver.observe(
            counter
          );

        }
      );


    } else {


      counters.forEach(
        counter => {


          counter.textContent =
            `${
              counter.dataset.count ||
              "0"
            }${
              counter.dataset.suffix ||
              ""
            }`;

        }
      );

    }


    /* ======================================
       REVEAL ANIMATION
    ====================================== */

    if (
      "IntersectionObserver"
      in window &&
      !reducedMotion
    ) {


      body.classList.add(
        "reveal-ready"
      );


      const revealObserver =
        new IntersectionObserver(
          entries => {


            entries.forEach(
              entry => {


                if (
                  !entry.isIntersecting
                ) {

                  return;

                }


                entry.target
                  .classList.add(
                    "visible"
                  );


                revealObserver
                  .unobserve(
                    entry.target
                  );

              }
            );

          },
          {

            threshold: 0.08,

            rootMargin:
              "0px 0px -30px 0px"

          }
        );


      revealElements.forEach(
        (element, index) => {


          element.style
            .transitionDelay =
              `${
                (index % 3) *
                55
              }ms`;


          revealObserver.observe(
            element
          );

        }
      );


    } else {


      revealElements.forEach(
        element => {


          element.classList.add(
            "visible"
          );

        }
      );

    }


    /* ======================================
       WINDOW RESIZE
    ====================================== */

    window.addEventListener(
      "resize",
      () => {


        if (!isMobile()) {

          closeMenu();

        }


        updateNavigation();

      }
    );


    /* ======================================
       INITIAL
    ====================================== */

    updateScrollUI();


    updateNavigation();


    /*
      Ensure page remains at home
      after DOM has finished rendering.
    */

    requestAnimationFrame(
      () => {

        window.scrollTo(
          0,
          0
        );

      }
    );

  }
);