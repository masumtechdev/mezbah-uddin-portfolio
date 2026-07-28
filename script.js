"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body =
    document.body;

  const header =
    document.getElementById("siteHeader");

  const menuButton =
    document.getElementById("menuButton");

  const navigation =
    document.getElementById("mainNavigation");

  const navigationBox =
    document.getElementById("navigationLinks");

  const navigationIndicator =
    document.getElementById("navigationIndicator");

  const scrollProgress =
    document.getElementById("scrollProgress");

  const currentYear =
    document.getElementById("currentYear");

  const portraitStage =
    document.getElementById("portraitStage");

  const portraitFrame =
    document.getElementById("portraitFrame");

  const portraitImage =
    document.getElementById("portraitImage");

  const navigationLinks = [
    ...document.querySelectorAll(
      ".navigation-links a"
    )
  ];

  const internalLinks = [
    ...document.querySelectorAll(
      'a[href^="#"]'
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

  const companyImages = [
    ...document.querySelectorAll(
      ".company-logo img, .marquee-logo img"
    )
  ];

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;

  let lastFocusedElement =
    null;

  let scrollFrameRequested =
    false;


  const cleanAddress = () => {
    if (location.hash) {
      history.replaceState(
        null,
        "",
        location.pathname + location.search
      );
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
  };


  cleanAddress();


  window.addEventListener(
    "load",
    cleanAddress,
    {
      once: true
    }
  );


  window.addEventListener(
    "pageshow",
    event => {
      if (event.persisted) {
        cleanAddress();
      }
    }
  );


  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear();
  }


  const isMobileNavigation = () =>
    window.innerWidth <= 960;


  const openMenu = () => {
    if (
      !menuButton ||
      !navigation ||
      !isMobileNavigation()
    ) {
      return;
    }

    lastFocusedElement =
      document.activeElement;

    menuButton.classList.add("active");
    navigation.classList.add("open");
    body.classList.add("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      "true"
    );

    menuButton.setAttribute(
      "aria-label",
      "Close navigation"
    );

    navigation.setAttribute(
      "aria-hidden",
      "false"
    );

    window.setTimeout(() => {
      const firstLink =
        navigation.querySelector(
          ".navigation-links a"
        );

      firstLink?.focus({
        preventScroll: true
      });
    }, 420);
  };


  const closeMenu = (
    returnFocus = false
  ) => {
    if (
      !menuButton ||
      !navigation
    ) {
      return;
    }

    menuButton.classList.remove("active");
    navigation.classList.remove("open");
    body.classList.remove("menu-open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation"
    );

    navigation.setAttribute(
      "aria-hidden",
      isMobileNavigation()
        ? "true"
        : "false"
    );

    if (
      returnFocus &&
      lastFocusedElement instanceof HTMLElement
    ) {
      lastFocusedElement.focus({
        preventScroll: true
      });
    }
  };


  menuButton?.addEventListener(
    "click",
    () => {
      navigation?.classList.contains("open")
        ? closeMenu(true)
        : openMenu();
    }
  );


  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        navigation?.classList.contains("open")
      ) {
        closeMenu(true);
      }

      if (
        event.key === "Tab" &&
        navigation?.classList.contains("open") &&
        isMobileNavigation()
      ) {
        const focusableElements = [
          ...navigation.querySelectorAll(
            'a[href], button:not([disabled])'
          ),
          menuButton
        ].filter(Boolean);

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  );


  const moveIndicator = target => {
    if (
      !navigationIndicator ||
      !navigationBox ||
      !target ||
      isMobileNavigation()
    ) {
      if (navigationIndicator) {
        navigationIndicator.style.opacity =
          "0";
      }

      return;
    }

    const containerRect =
      navigationBox
        .getBoundingClientRect();

    const targetRect =
      target
        .getBoundingClientRect();

    const leftPosition =
      targetRect.left -
      containerRect.left -
      5;

    navigationIndicator.style.width =
      `${targetRect.width}px`;

    navigationIndicator.style.transform =
      `translateX(${leftPosition}px)`;

    navigationIndicator.style.opacity =
      "1";
  };


  const updateScrollInterface = () => {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const availableHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      availableHeight > 0
        ? scrollTop / availableHeight * 100
        : 0;

    if (scrollProgress) {
      scrollProgress.style.width =
        `${progress}%`;
    }

    header?.classList.toggle(
      "scrolled",
      scrollTop > 28
    );
  };


  const updateActiveNavigation = () => {
    const marker =
      window.scrollY + 190;

    let currentSection =
      "home";

    sections.forEach(section => {
      const sectionTop =
        section.offsetTop;

      const sectionBottom =
        sectionTop +
        section.offsetHeight;

      if (
        marker >= sectionTop &&
        marker < sectionBottom
      ) {
        currentSection =
          section.id;
      }
    });

    let activeLink =
      null;

    navigationLinks.forEach(link => {
      const active =
        link.getAttribute("href") ===
        `#${currentSection}`;

      link.classList.toggle(
        "active",
        active
      );

      if (active) {
        activeLink =
          link;

        link.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });

    moveIndicator(
      activeLink
    );
  };


  const handleScroll = () => {
    if (scrollFrameRequested) {
      return;
    }

    scrollFrameRequested =
      true;

    requestAnimationFrame(() => {
      updateScrollInterface();
      updateActiveNavigation();

      scrollFrameRequested =
        false;
    });
  };


  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );


  const scrollToSection = target => {
    const headerOffset =
      header
        ? header.offsetHeight
        : 0;

    const destination =
      target
        .getBoundingClientRect()
        .top +
      window.scrollY -
      headerOffset +
      5;

    window.scrollTo({
      top: destination,
      behavior:
        reduceMotion
          ? "auto"
          : "smooth"
    });
  };


  internalLinks.forEach(link => {
    link.addEventListener(
      "click",
      event => {
        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            targetId
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        const menuWasOpen =
          navigation?.classList.contains(
            "open"
          );

        if (menuWasOpen) {
          closeMenu(false);

          window.setTimeout(() => {
            scrollToSection(
              target
            );
          }, reduceMotion ? 0 : 260);
        } else {
          scrollToSection(
            target
          );
        }

        history.replaceState(
          null,
          "",
          location.pathname +
          location.search
        );
      }
    );
  });


  if (
    portraitFrame &&
    portraitImage
  ) {
    const showPortraitFallback = () => {
      portraitFrame.classList.add(
        "image-error"
      );
    };

    portraitImage.addEventListener(
      "error",
      showPortraitFallback
    );

    if (
      portraitImage.complete &&
      portraitImage.naturalWidth === 0
    ) {
      showPortraitFallback();
    }
  }


  companyImages.forEach(image => {
    const imageBox =
      image.closest(
        ".company-logo, .marquee-logo"
      );

    const showLogoFallback = () => {
      imageBox?.classList.add(
        "image-missing"
      );
    };

    image.addEventListener(
      "error",
      showLogoFallback
    );

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      showLogoFallback();
    }
  });


  if (
    portraitStage &&
    finePointer &&
    !reduceMotion
  ) {
    portraitStage.addEventListener(
      "pointermove",
      event => {
        const stageRect =
          portraitStage
            .getBoundingClientRect();

        const horizontal =
          (event.clientX -
            stageRect.left) /
          stageRect.width;

        const vertical =
          (event.clientY -
            stageRect.top) /
          stageRect.height;

        portraitStage.style.setProperty(
          "--rotate-x",
          `${(0.5 - vertical) * 3.5}deg`
        );

        portraitStage.style.setProperty(
          "--rotate-y",
          `${(horizontal - 0.5) * 3.5}deg`
        );
      }
    );

    portraitStage.addEventListener(
      "pointerleave",
      () => {
        portraitStage.style.setProperty(
          "--rotate-x",
          "0deg"
        );

        portraitStage.style.setProperty(
          "--rotate-y",
          "0deg"
        );
      }
    );
  }


  const animateCounter = counter => {
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
      counter.dataset.suffix || "";

    const duration =
      900;

    let startTime =
      null;

    const updateCounter = time => {
      if (!startTime) {
        startTime =
          time;
      }

      const progress =
        Math.min(
          (time - startTime) /
          duration,
          1
        );

      const easedProgress =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      counter.textContent =
        `${Math.round(
          target * easedProgress
        )}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(
          updateCounter
        );
      }
    };

    requestAnimationFrame(
      updateCounter
    );
  };


  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const counterObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            animateCounter(
              entry.target
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.55
        }
      );

    counters.forEach(counter => {
      counterObserver.observe(
        counter
      );
    });
  } else {
    counters.forEach(counter => {
      counter.textContent =
        `${counter.dataset.count || "0"}${counter.dataset.suffix || ""}`;
    });
  }


  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    body.classList.add(
      "reveal-ready"
    );

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.1,
          rootMargin:
            "0px 0px -35px 0px"
        }
      );

    revealElements.forEach(
      (element, index) => {
        element.style.transitionDelay =
          `${index % 3 * 55}ms`;

        revealObserver.observe(
          element
        );
      }
    );

    requestAnimationFrame(() => {
      revealElements.forEach(element => {
        const elementRect =
          element
            .getBoundingClientRect();

        if (
          elementRect.top <
            window.innerHeight &&
          elementRect.bottom > 0
        ) {
          element.classList.add(
            "visible"
          );
        }
      });
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add(
        "visible"
      );
    });
  }


  const updateNavigationMode = () => {
    if (!navigation) {
      return;
    }

    if (isMobileNavigation()) {
      navigation.setAttribute(
        "aria-hidden",
        navigation.classList.contains("open")
          ? "false"
          : "true"
      );
    } else {
      closeMenu(false);

      navigation.setAttribute(
        "aria-hidden",
        "false"
      );
    }

    updateActiveNavigation();
  };


  window.addEventListener(
    "resize",
    updateNavigationMode
  );


  updateScrollInterface();
  updateActiveNavigation();
  updateNavigationMode();


  window.addEventListener(
    "load",
    updateActiveNavigation,
    {
      once: true
    }
  );
});