function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function setupNavbarScroller() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  const checkScroll = () => {
    if (!navbar) return;
    const atTop = window.scrollY <= 16;
    const scrollingDown = lastScrollY < window.scrollY;
    navbar.classList.toggle('scrolled', !atTop);
    navbar.classList.toggle('navbar-hidden', scrollingDown && !atTop);
    lastScrollY = window.scrollY;
  };

  checkScroll();
  window.addEventListener('scroll', throttle(checkScroll, 200));
}

function setupNavMenu() {
  const openMenuButton = document.getElementById('openMenu');
  const navMenu = document.querySelector('.nav-menu');
  const navScrim = document.querySelector('.nav-scrim');
  const body = document.body;

  if (!openMenuButton || !navMenu || !navScrim) return;

  openMenuButton.addEventListener('click', function () {
    if (window.innerWidth < 991 && !navMenu.classList.contains('expanded')) {
      navMenu.style.display = 'block';
      body.style.overflow = 'hidden';
      setTimeout(() => navMenu.classList.add('expanded'), 10);
    }
  });

  navScrim.addEventListener('click', function () {
    navMenu.classList.remove('expanded');
    setTimeout(() => {
      navMenu.style.display = 'none';
      body.style.overflow = '';
    }, 300);
  });
}

function setupSubscribe() {
  const subscribeAside = document.querySelector('.subscribe-aside');
  const showSubscribeBtns = document.querySelectorAll('[data-trigger="subscribe-aside"]');
  const hideSubscribeBtn = document.getElementById('hideSubscribe');

  if (!subscribeAside || showSubscribeBtns.length === 0 || !hideSubscribeBtn) return;

  showSubscribeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subscribeAside.style.display = 'block';
      document.body.style.overflow = 'hidden';
      setTimeout(() => subscribeAside.classList.add('active'), 10);
    });
  });

  hideSubscribeBtn.addEventListener('click', () => {
    subscribeAside.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => subscribeAside.style.display = 'none', 300);
  });
}

function setupStreamingText() {
  // Fix the height of each .chat-wrapper based on its current content
  document.querySelectorAll('.chat-wrapper').forEach(wrapper => {
    let currentHeight = wrapper.offsetHeight; // Measure the current height
    wrapper.style.height = `${currentHeight}px`; // Set the fixed height
  });

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let element = entry.target;
        streamText(element);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.streaming-text').forEach(textBlock => {
    observer.observe(textBlock);
  });

  function streamText(element) {
    // Stream the text
    let fullText = element.innerText;
    element.innerText = '';
    let words = fullText.split(/\s+/);
    let wordIndex = 0;

    const typeWriter = setInterval(() => {
      if (wordIndex < words.length) {
        let tokenSize = getRandomTokenSize(1, 2);
        let token = words.slice(wordIndex, wordIndex + tokenSize).join(' ') + ' ';
        element.innerText += token;
        wordIndex += tokenSize;
      } else {
        clearInterval(typeWriter);
      }
    }, 100);
  }

  function getRandomTokenSize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

function setupDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const dropdownWrap = dropdown.querySelector('.dropdown-wrap');
    if (!dropdownWrap) return;

    if (window.innerWidth >= 992) {
      setupDropdownForLargeScreens(dropdown, dropdownWrap);
    } else {
      setupDropdownForSmallScreens(dropdown, dropdownWrap);
    }
  });

  function setupDropdownForLargeScreens(dropdown, dropdownWrap) {
    dropdown.addEventListener('mouseenter', () => {
      dropdownWrap.style.display = 'block';
      setTimeout(() => dropdownWrap.classList.add('is-open'), 10);
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdownWrap.classList.remove('is-open');
      setTimeout(() => dropdownWrap.style.display = 'none', 350);
    });
  }

  function setupDropdownForSmallScreens(dropdown, dropdownWrap) {
    dropdown.addEventListener('click', () => {
      const isOpen = dropdownWrap.classList.contains('is-open');
      dropdownWrap.style.display = isOpen ? 'none' : 'block';
      dropdownWrap.classList.toggle('is-open', !isOpen);
    });
  }
}

function setupCardLinks() {
  document.querySelectorAll('.card-link').forEach(card => {
    const mainLink = card.querySelector('.main-link');
    if (mainLink) {
      card.onclick = () => window.location.href = mainLink.href;
    }
  });
}

function setupColorModeToggle() {
  const toggle = document.querySelector('.color-mode-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const currentMode = document.body.getAttribute('color-mode');
    const newColorMode = currentMode === 'dark' ? 'light' : 'dark';
    window.applyColorMode(newColorMode, true);
  });
}

function setupAccordion() {
  const accordionItems = document.querySelectorAll(
    '.faq-rich-text p:nth-of-type(odd), .chat-faq p:nth-of-type(odd)');

  accordionItems.forEach(item => {
    item.addEventListener('click', () => {
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('is--expanded');
      });
      item.classList.toggle('is--expanded');
    });
  });
}

function setupAnimationObserver() {
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('text-animate')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }
        if (entry.target.classList.contains('image-animate') || entry.target.classList
          .contains('w-richtext-figure-type-image')) {
          entry.target.classList.add('revealed');
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    root: null,
    threshold: 0.1
  });

  const observeElements = () => {
    document.querySelectorAll('.image-animate, .w-richtext-figure-type-image, .text-animate')
      .forEach(element => observer.observe(element));
  };

  observeElements();

  const paginationButton = document.querySelector('.w-pagination-next');
  if (paginationButton) {
    paginationButton.addEventListener('click', () => {
      setTimeout(observeElements, 110);
    });
  }
}

function init() {
  setupNavbarScroller();
  setupNavMenu();
  setupSubscribe();
  setupStreamingText();
  setupDropdowns();
  setupCardLinks();
  setupColorModeToggle();
  setupAccordion();
  setupAnimationObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
