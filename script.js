window.addEventListener("DOMContentLoaded", (event) => {
  let navButton = $(".m_nav_button");
  let menuWrap = $(".m_nav_menu");
  let menuBackground = $(".nav-dropdown-bg");
  let menuPanels = $(".menu_panel");
  let content = $(".menu_content");
  let lines = $(".nav_button_line");
  let backButton = $(".go-back");
  let opensMore = $(".opens-more");
  let previouslyFocused;
  let activeSubPanel;
  let mm = gsap.matchMedia();

mm.add("(max-width: 991px)", () => {

  let showSubMenu = gsap.timeline({
    paused: true,
    onComplete: () => {
      activeSubPanel.find("a").first().focus();
    },
    onReverseComplete: () => {
      previouslyFocused.focus();
    }
  });
  showSubMenu.to(menuPanels, { x: "-100%", ease: "power1.inOut", duration: 0.4 });

  let showMainMenu = gsap.timeline({
    paused: true,
    defaults: { duration: 0.3 },
    onReverseComplete: () => {
      showSubMenu.progress(0);
      showSubMenu.pause();
      navButton.attr("aria-label", "Open Main Menu");
    },
    onComplete: () => {
      menuWrap.find("button").first().focus();
      navButton.attr("aria-label", "Close Main Menu");
    }
  });
  showMainMenu.set(menuWrap, { display: "flex" });
  showMainMenu.set(menuBackground, { display: "block" });
  showMainMenu.from(menuWrap, { x: "100%" });
  showMainMenu.from(menuBackground, { opacity: 0 }, "<");
  showMainMenu.to(lines.eq(0), { y: 3, rotate: 45 }, "<");
  showMainMenu.to(lines.eq(1), { y: -4, rotate: -45 }, "<");

  navButton.on("click", function () {
    if (showMainMenu.progress() === 0) {
      showMainMenu.play();
    } else {
      showMainMenu.reverse();
      navButton.attr("aria-label", "Open Main Menu");
    }
  });

  menuBackground.on("click", function () {
    showMainMenu.reverse();
  });
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") showMainMenu.reverse();
  });

  opensMore.on("click", function () {
    previouslyFocused = $(this);
    let linkIndex = $(this).index();
    showSubMenu.play();
    content.hide();
    activeSubPanel = content.eq(linkIndex).show();
  });

  backButton.on("click", function () {
    showSubMenu.reverse();
  });
  backButton.on("keydown", function (e) {
		if (e.key === "Tab" && e.shiftKey) {
			e.preventDefault();
			activeSubPanel.find("a, button").last().focus();
		}
  });

  $("[trap-focus]").each(function () {
    let focusBack = $(this).attr("focus-back");
    let lastItem = $(this).find("a, button").last();
    lastItem.on("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        if (focusBack === "true") {
          backButton.focus();
        } else {
          navButton.focus();
        }
      }
    });
  });
});
  return () => { // optional
    // custom cleanup code here (runs when it STOPS matching)
  };
});
