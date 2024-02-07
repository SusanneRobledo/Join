/** If User logs in as Guest, registeredUser will be set in session storage and flagged as "false". Needed for Contacts.js */
function setRegisteredUser() {
  if (!registeredUser) {
    sessionStorage.setItem("registeredUser", JSON.stringify(false));
  }
}

/** Greets the user based on their status (guest or registered) and screen type (mobile or desktop).*/
function greetUser() {
  let mobileGreetingShown = setMobileGreetingStatus();
  handleMobileGreetings(mobileGreetingShown);
  handleDesktopGreetings();
}

/** Coordinates the two mobile versions of the user greetings (guest or registered user).
 * Adjusts the greeting message and user name display accordingly.
 * @param {Boolean} mobileGreetingShown
 */
function handleMobileGreetings(mobileGreetingShown) {
  if (guestUserOnMobileDevice(mobileGreetingShown)) {
    loadHelloPageMobile();
    greetGuestUser("greetingMobile", "userNameMobile");
  } else if (registeredUserOnMobileDevice(mobileGreetingShown)) {
    loadHelloPageMobile();
    document.getElementById("userNameMobile").innerHTML = registeredUser.name;
  }
}

/** Coordinates the two desktop versions of the user greetings (guest or registered user). */
function handleDesktopGreetings() {
  if (guestUserOnDesktopDevice()) {
    showGreeting("greetingDesktop");
    greetGuestUser("greetingDesktop", "userNameDesktop");
  } else if (registeredUserOnDesktopDevice()) {
    showGreeting("greetingDesktop");
    document.getElementById("userNameDesktop").innerHTML = registeredUser.name;
  }
}

/**
 * If a guest User logs in on a mobile device the greeting message is shown when calling the Summary Page for the first time.
 * The message doesnt show again after coming back to the Summary Page from another Page.
 * @param {Boolean} mobileGreetingShown
 * @returns the conditions to show the guest user greeting on a mobile device
 */
function guestUserOnMobileDevice(mobileGreetingShown) {
  return screenType === "mobile" && !registeredUser && !mobileGreetingShown;
}

/**
 * If a registered User logs in on a mobile device the greeting message is shown when calling the Summary Page for the first time.
 * The message doesnt show again after coming back to the Summary Page from another Page.
 * @param {Boolean} mobileGreetingShown
 * @returns the conditions to show the registered user greeting on a mobile device
 */
function registeredUserOnMobileDevice(mobileGreetingShown) {
  return screenType === "mobile" && registeredUser && !mobileGreetingShown;
}

/**
 * If a guest user logs ins on a desktop device, shows the greeting.
 * @returns the conditions to show the guest user greeting for desktop devices
 */
function guestUserOnDesktopDevice() {
  return screenType === "desktop" && !registeredUser;
}

/**
 * If a registered User logs in on a desktop device, shows the greeting.
 * @param {Boolean} mobileGreetingShown
 * @returns the conditions to show the registered user greeting for desktop devices
 */
function registeredUserOnDesktopDevice() {
  return screenType === "desktop" && registeredUser;
}

/**
 * Adapts the greeting message if its a guest user. Hides the div with the user name.
 * @param {boolean} isGuestUser - A boolean flag indicating whether the current user is a guest.
 * @param {string} greetingID - The ID of the HTML element containing the greeting message.
 * @param {string} nameID - The ID of the HTML element containing the user's name display.
 */
function greetGuestUser(greetingID, nameID) {
  if (!registeredUser) {
    modifyGreetingForGuestUser(greetingID);
    hideUserName(nameID);
  }
}

/**
 * Hides the user name element.
 * @param {string} ID - The ID of the HTML element containing the user's name display.
 */
function hideUserName(ID) {
  document.getElementById(ID).style.display = "none";
}

/**
 * Modifies the user greeting message by replacing commas with exclamation marks.
 * @param {string} ID - The ID of the HTML element containing the greeting message.
 */
function modifyGreetingForGuestUser(ID) {
  let greeting = document.getElementById(ID);
  greeting.innerHTML = greeting.innerHTML.replace(/,/g, "!");
}

/**
 * Loads and displays the hello page when Page is loaded and viewed on mobile devices.
 * It creates a page element, inserts it into the document, and adds the user greeting.
 * It also applies a fade-out effect.
 */
function loadHelloPageMobile() {
  if (screenType === "mobile") {
    let helloPage = document.createElement("div");
    helloPage.innerHTML = generateHelloPageHTML();

    // Insert the helloPage before the mobileTemplate
    let main = document.querySelector("main");
    main.parentNode.insertBefore(helloPage, main);
    showGreeting("greetingMobile");
    fadeOutHelloPage(helloPage);
  }
}

/**
 * Generates the HTML content for the mobile hello page.
 * @returns {string} - The HTML content for the hello page.
 */
function generateHelloPageHTML() {
  return `
      <div id="helloPageMobile" class="">
      <span id="greetingMobile"></span>
      <h1 class="blue-text" id="userNameMobile">Sofia Müller</h1>
      </div>
      `;
}

/**
 * Applies a fade-out effect to the hello page and hides it after the animation completes.
 * @param {HTMLElement} helloPage - The HTML element to which the fade-out effect is applied.
 */
function fadeOutHelloPage(helloPage) {
  setTimeout(() => helloPage.classList.add("fadeOut"), 1000);
  helloPage.addEventListener(
    "transitionend",
    () => (helloPage.style.display = "none")
  );
}

/**
 * Gets the current hour as an integer.
 * @returns {number} The current hour, represented as an integer (0-23).
 */
function currentHour() {
  let day = new Date();
  return day.getHours();
}

/**
 * Displays a greeting message based on the current time of day.
 * @param {string} ID - The ID of the HTML element for the greeting message.
 */
function showGreeting(ID) {
  let currenthour = currentHour();
  let greeting = document.getElementById(ID);

  if (currenthour >= 4 && currenthour < 12)
    greeting.innerHTML = "Good morning,";
  else if (currenthour >= 12 && currenthour < 18)
    greeting.innerHTML = "Good afternoon,";
  else if (currenthour >= 18 && currenthour < 22)
    greeting.innerHTML = "Good evening,";
  else greeting.innerHTML = "Good night,";
}
