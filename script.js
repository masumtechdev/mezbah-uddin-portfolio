"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

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

  const allMenuLinks = [
    ...document.querySelectorAll(
      ".main-navigation a"
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


  const openMenu = () => {
    if (!menuButton || !navigation) {
      return;
    }

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
  };


  const closeMenu = () => {
    if (!menuButton || !navigation) {
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
  };


  menuButton?.addEventListener(
    "click",
    () => {
      navigation?.classList.contains("open")
        ? closeMenu()
        : openMenu();
    }
  );


  allMenuLinks.forEach(link => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });


  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    }
  );


  const moveIndicator = target => {
    if (
      !navigationIndicator ||
      !navigationBox ||
      !target ||
      window.innerWidth <= 960
    ) {
      if (navigationIndicator) {
        navigationIndicator.style.opacity =
          "0";
      }

      return;
    }


    const containerRect =
      navigationBox.getBoundingClientRect();

    const targetRect =
      target.getBoundingClientRect();

    const left =
      targetRect.left -
      containerRect.left -
      5;


    navigationIndicator.style.width =
      `${targetRect.width}px`;

    navigationIndicator.style.transform =
      `translateX(${left}px)`;

    navigationIndicator.style.opacity =
      "1";
  };


  const updateScrollInterface = () => {
    const top =
      window.scrollY ||
      document.documentElement.scrollTop;

    const available =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      available > 0
        ? top / available * 100
        : 0;


    if (scrollProgress) {
      scrollProgress.style.width =
        `${progress}%`;
    }


    header?.classList.toggle(
      "scrolled",
      top > 28
    );
  };


  const updateActiveNavigation = () => {
    const marker =
      window.scrollY + 190;

    let current =
      "home";


    sections.forEach(section => {
      const top =
        section.offsetTop;

      const bottom =
        top + section.offsetHeight;


      if (
        marker >= top &&
        marker < bottom
      ) {
        current =
          section.id;
      }
    });


    let activeLink =
      null;


    navigationLinks.forEach(link => {
      const active =
        link.getAttribute("href") ===
        `#${current}`;


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


  let scrollFrame =
    false;


  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) {
        return;
      }


      scrollFrame =
        true;


      requestAnimationFrame(() => {
        updateScrollInterface();
        updateActiveNavigation();

        scrollFrame =
          false;
      });
    },
    {
      passive: true
    }
  );


  const scrollToSection = target => {
    const offset =
      header
        ? header.offsetHeight
        : 0;

    const top =
      target
        .getBoundingClientRect()
        .top +
      window.scrollY -
      offset +
      5;


    window.scrollTo({
      top,
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

        scrollToSection(
          target
        );


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
    const showFallback = () => {
      portraitFrame.classList.add(
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


  companyImages.forEach(image => {
    const box =
      image.closest(
        ".company-logo, .marquee-logo"
      );


    const showFallback = () => {
      box?.classList.add(
        "image-missing"
      );
    };


    image.addEventListener(
      "error",
      showFallback
    );


    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      showFallback();
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
        const rect =
          portraitStage
            .getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;


        portraitStage.style.setProperty(
          "--rotate-x",
          `${(0.5 - y) * 3.5}deg`
        );

        portraitStage.style.setProperty(
          "--rotate-y",
          `${(x - 0.5) * 3.5}deg`
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

    let start =
      null;


    const tick = time => {
      if (!start) {
        start =
          time;
      }


      const progress =
        Math.min(
          (time - start) / duration,
          1
        );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );


      counter.textContent =
        `${Math.round(target * eased)}${suffix}`;


      if (progress < 1) {
        requestAnimationFrame(
          tick
        );
      }
    };


    requestAnimationFrame(
      tick
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
        const rect =
          element
            .getBoundingClientRect();


        if (
          rect.top < window.innerHeight &&
          rect.bottom > 0
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


  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 960) {
        closeMenu();
      }


      updateActiveNavigation();
    }
  );


  updateScrollInterface();
  updateActiveNavigation();


  window.addEventListener(
    "load",
    updateActiveNavigation,
    {
      once: true
    }
  );
});