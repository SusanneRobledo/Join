/** checks if App has already been started and if page was refreshed. If App hasnt been started or page was reloaded, logo for start animation is set to either desktop or mobile and animation is triggered */
function handleStartAnimation() {
  const appStarted = getSessionData();
  const pageReloaded = isPageReloaded();
  if (!appStarted || pageReloaded) {
    getAnimationHtml();
    displayLogoForDesktop();
    animateSplashScreen();
  }
}

/** changes the animation logo if accessed on desktop screen */
function displayLogoForDesktop() {
  const loginLogoEl = document.getElementById("login-logo");
  if (getScreenType() === "desktop")
    loginLogoEl.src = "./assets/img/join_logo_black.png";
}

/** gets appStarted value from session storage to determin if this is the session launch */
function getSessionData() {
  const appStarted = JSON.parse(sessionStorage.getItem("appStarted"));
  if (!appStarted) sessionStorage.setItem("appStarted", "true");
  return appStarted;
}

/** Checks if the Page was called by a reload or not (e.g. through page button navigation) */
function isPageReloaded() {
  const navigationEntries = performance.getEntriesByType("navigation");
  if (navigationEntries.length > 0)
    return navigationEntries[0].type === "reload";
  return false;
}

/** adds html required for start animation */
function getAnimationHtml() {
  document.body.innerHTML += `<div id="splash-login-bg"></div>
    <img
      src="./assets/img/join_logo_white.png"
      alt="Join logo"
      class="img-large splash-active"
      id="login-logo"
    />`;
}

/**Splash screen animation: This function coordinates the splash screen animation by calling three sub-functions with increasing timeouts.
 * Change of delay requires change of login.css rules (transition property) as well */
function animateSplashScreen() {
  const SPLASH_DURATION = 1000;
  setTimeout(startSplashAnimation, SPLASH_DURATION);
  setTimeout(changeLogo, SPLASH_DURATION + 250);
  setTimeout(removeSplash, SPLASH_DURATION + 1000);
}

/**Splash screen animation: This functions starts the splash screen animation by adding the 'splash-moving' class to the logo and background container. */
function startSplashAnimation() {
  const loginLogoStaticEl = document.getElementById("login-logo-static");
  const splashLoginBgEl = document.getElementById("splash-login-bg");
  const loginLogoEl = document.getElementById("login-logo");
  loginLogoEl.classList.add("splash-moving");
  splashLoginBgEl.classList.add("splash-moving");
  loginLogoStaticEl.classList.add("splash-active");
}

/**Splash screen animation: This function changes the logo from the white to the black one during the splash screen animation. */
function changeLogo() {
  const loginLogoEl = document.getElementById("login-logo");
  loginLogoEl.src = "./assets/img/join_logo_black.png";
}

/**Splash screen animation: This function adds and removes classes to achieve the end result of the animation. */
function removeSplash() {
  const splashLoginBgEl = document.getElementById("splash-login-bg");
  const loginLogoEl = document.getElementById("login-logo");
  const loginLogoStaticEl = document.getElementById("login-logo-static");
  splashLoginBgEl.classList.add("d-none");
  splashLoginBgEl.classList.remove("splash-moving");
  loginLogoEl.classList.remove("splash-moving");
  loginLogoEl.classList.remove("splash-active");
  loginLogoEl.classList.add("d-none");
  loginLogoStaticEl.classList.remove("splash-active");
}
