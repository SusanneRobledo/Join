let docWidth;
let screenType;
let loaded;
let responseFromBackend;
let userInitials = "SM";
let currentPage = "summary.html";
const STORAGE_TOKEN = "G1OERBUF0NPIB8DLZPT41ZZ5I569IQR3G99JW22P";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let contactList;
let taskList = [];
let userList = [];
let loggedIn;
let loginData;
let activeUser;
let hideSiderMenu;
let maxUserId;
let maxTaskId;
let maxContactId;

initForAllPages();
/**Starting function, to validate User and fill the most-used Variables with data. */
async function initForAllPages() {
  verifyUserStatus();
  await getDataFromBackend();
}

/**
 * Checks localstorage if the user is logged in.
 * Else will check Sessionstorage, and sets loggedIn to 'true' or 'false'.
 * If not logged in, acess to former sites will be denied.
 */
function verifyUserStatus() {
  let status = JSON.parse(localStorage.getItem("loggedIn"));
  if (status) {
    loginData = JSON.parse(localStorage.getItem("loginData"));
  } else {
    status = JSON.parse(sessionStorage.getItem("loggedIn"));
  }
  activeUser = JSON.parse(sessionStorage.getItem("activeUser"));
  loggedIn = status;
  if (
    !window.location.href.endsWith("login.html") &&
    !window.location.href.endsWith("forgotpassword.html") &&
    !window.location.href.endsWith("resetpassword.html") &&
    !window.location.href.endsWith("signup.html") &&
    !window.location.href.endsWith("privacy_policy.html") &&
    !window.location.href.endsWith("legal_notes.html") &&
    !loggedIn
  ) {
    window.location.href = "./login.html";
  }
}

/** Fills 3 important global variables with much used Data */
async function getDataFromBackend() {
  taskList = await getItemFromBackend("taskList");
  userList = await getItemFromBackend("userList");
  contactList = await getItemFromBackend("contactList");
}

/**
 * Searches for the task within the taskList, by a specific id.
 * @param {Number} findID - The Id, we are looking for
 * @returns - the task (Object) we wanted.
 */
function getTaskByID(findID) {
  let task = taskList.find((t) => t.id === findID);
  return task;
}

/**
 * Gets task through other function, then gets Index
 * @param {Number} taskID - ID of searched Task
 * @returns - Indexof searched Task inside of taskList
 */
function getTaskIndexByID(taskID) {
  let task = getTaskByID(taskID);
  let taskIndex = taskList.indexOf(task);
  return taskIndex;
}

/**
 *  Inits getting the Templates
 * @param {boolean} bool - is only true, when Menu Links shall not be loaded into Sider.
 */
function initTemplates(bool) {
  bool ? (hideSiderMenu = true) : (hideSiderMenu = false);
  getTemplates();
}

/**
 * Checks Screen Width and sets the global variable loaded to 'mobile' or 'desktop'.
 * @returns  form of actual Screen.
 */
function getScreenType() {
  let docWidth = window.innerWidth;
  if (docWidth < 820) {
    screenType = "mobile";
  } else if (docWidth >= 820) {
    screenType = "desktop";
  }
  return screenType;
}

/**
 * Loads in the needed Templates for Desktop or Mobile Version
 */
async function getTemplates() {
  getScreenType();
  if (screenType == "mobile") {
    await getMatchingTemplate("mobile-template", "desktop-template");
    loaded = "mobile";
  } else if (screenType == "desktop") {
    await getMatchingTemplate("desktop-template", "mobile-template");
    loaded = "desktop";
  }
}

/**
 * Checks, if Screentyoe still matches the actual loaded Template Versions.
 */
window.onresize = function () {
  if (getScreenType() != loaded) {
    getTemplates();
  }
};

/**
 * Loads in templates for needed Version, (Mobile or Desktop) unloads the other templates, if needed.
 * Then triggers a function to mark the actual Side on the template.
 * @param {string} toLoadID - The ID of the html-template, that has to be loaded.
 * @param {string} toUnloadID - The ID of that html-template, that has to be unloaded.
 */
async function getMatchingTemplate(toLoadID, toUnloadID) {
  try {
    let includeElement = document.getElementById(toLoadID);
    const element = includeElement;
    file = element.getAttribute("include-templates"); // "assets/templates/desktop_template.html" or mobile_template.html
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
    unloadTemplate(toUnloadID);
    showInitialsHeader(userInitials);
    markCorrectMenuPoint();
    if (hideSiderMenu) {
      if (screenType == "mobile" && loggedIn != true) {
        hideMenusMobile();
      } else {
        hideMenusDesktop();
      }
    }
  } catch {
    return;
  }
}

/**
 * Undloads the not needed Template.
 * @param {*} toUnloadID ID of to unload Template
 */
function unloadTemplate(toUnloadID) {
  let toUnload = document.getElementById(toUnloadID);
  toUnload.innerHTML = "";
}

/**
 * Initials of current User are going to be written into the Header Circle.
 * If there are no, then its a "G" for "Guest User".
 */
function showInitialsHeader() {
  let svgText = document.getElementById("svg_text");
  if (activeUser) {
    svgText.textContent = activeUser.initials;
  } else {
    svgText.textContent = "G";
  }
}

/**
 * Marks Point on the Sider/Footer that is currently open.
 */
function markCorrectMenuPoint() {
  let activeSide = getDocumentName();
  try {
    let toChoose = document.getElementById(activeSide + "ID");
    if (toChoose) {
      toChoose.classList.add("Choosen_field");
    } else {
      let helpIcon = document.getElementById("header_help_icon_d");
      helpIcon.classList.add("d-none");
    }
  } catch {
    return;
  }
}

/**On some pages, the menu Points shall not be visible. Desktop parts get invisible here */
function hideMenusDesktop() {
  let siderMenu = document.getElementById("sider_menu_points");
  siderMenu.style.display = "none";
  let siderBlocker = document.getElementById("sider_blocker");
  siderBlocker.classList.remove("d-none");

  if (loggedIn != true) {
    let initialSVG = document.getElementById("header_svg");
    initialSVG.style.display = "none";
  }
}

/**On some pages, the menu Points shall not be visible. Mobile parts get invisible here */
function hideMenusMobile() {
  let mobFooterLinks = document.getElementById("mobile_footer_links");
  mobFooterLinks.style.display = "none";
  let initialSVG = document.getElementById("header_svg");
  initialSVG.style.display = "none";
  let mobileFooter = document.getElementById("mobile_footer_links");
  mobileFooter.style.display = "none";
}

/**
 * Brings in Menu for header
 */
function flyInMenu(wichMenu) {
  let menu = document.getElementById(wichMenu);
  let styleRight = menu.style.right;
  styleRight == "3vw"
    ? (menu.style.right = "-100%")
    : (menu.style.right = "3vw");
  if (wichMenu == "header_menu_id") {
    hideArrow();
  }
}

/**If theres an Arrow, it get hidden with a little delay */
function hideArrow() {
  setTimeout(() => {
    try {
      let arrow = document.querySelector(".Back_Arrow");
      arrow.classList.toggle("d-none");
    } catch {
      console.log(Error);
    }
  }, 200);
}

/**
 * Returns name of actual page, for marking the right Spot on header/footer in "markCorrectMenuPoint()"
 */
function getDocumentName() {
  var path = window.location.pathname;
  var path = path.split("./").pop(); //CHANGED
  let page = path.split(".html");
  return page[0];
}

/**
 * Getting Initials of Contacts for the InitialBalls.
 * Sometimes no input field is near, so we use the input on call
 * @param {String} input Name of an already registered User, in case there is no input field.
 * @returns Initials of the name in the input field, used for Contacts and new Users
 */
function getInitials(input) {
  let name = input;
  let nameArray = name.split(" ");
  return getStartingLetter(nameArray[0]) + getStartingLetter(nameArray[1]);
}

/**
 * Gets first letter of a string for Initials and startingletter of contacts, as well as for User initials
 * @param {String} toGet - The string, from wich we need the first letter
 * @returns first letter of a word in Uppercase
 */
function getStartingLetter(toGet) {
  let nameArray = toGet.split("");
  return nameArray[0].toUpperCase();
}

/**
 * Saves current Page in local Storage, so its possible to return later.
 */
function saveDocName() {
  let originSide = getDocumentName();
  localStorage.setItem("originSide", JSON.stringify(originSide));
}

/**
 * Saves current page and leads to help-side.
 */
function getHelp() {
  saveDocName();
  window.location.href = ".//help.html";
}

/** Saves current page and leads to legal notes. */
function toLegal() {
  saveDocName();
  window.open("./legal_notes.html", "_blank");
}

/** Saves current page and leads to privacy police.*/
function toPrivacy() {
  saveDocName();
  window.open("./privacy_policy.html", "_blank");
}

/**
 * After Opening the Help or Privacy Sides, this function leads back to the last visited place.
 */
function backToOrigin() {
  let originSideFromLocalStorage = localStorage.getItem("originSide");

  if (originSideFromLocalStorage) {
    let test = JSON.parse(originSideFromLocalStorage);
    originSide = test;
    localStorage.removeItem(originSide);
    window.location.href = "./" + originSide + ".html";
  }
}

/**
 * Saves variables in Backend
 * @param {string} key - Name of the variable
 * @param {any} value - value of the variable
 * @returns
 */
async function setItemInBackend(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Gets back variables from backend.
 * @param {string} key - name of the variable, that was saved in backend.
 * @returns
 */
async function getItemFromBackend(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  let response = await fetch(url).then((res) => res.json());
  let result = response.data.value;
  return JSON.parse(result);
}

/**
 *
 * @param {*} elementId
 * @param {*} targetHref
 */
function showNotification(elementId, targetHref) {
  document.documentElement.style.setProperty(
    "--notification-top-target",
    "80vh"
  );
  document.getElementById(elementId).classList.add("triggered");
  setTimeout(() => {
    window.location.href = targetHref;
  }, 800);
}

/**
 * Searches in userList for the User after the E-Mail.
 * @param {string} email the E-Mail wich was typed in.
 * @returns The found user
 */
function getUserByEmail(email) {
  return userList.find((user) => user.email === email);
}

/**
 * When new Task gets created, we get an ID from Backend, to never have the same ID twice!
 * @returns New ID for a new Task
 */
async function getTaskID() {
  let id = await getItemFromBackend("TaskId");
  let newID = Number(id) + 1;
  await setItemInBackend("TaskId", newID);
  return newID;
}

/**Setting the  loggedIn variable to false and saving in localstorage and sessionstorage.*/
function logOut() {
  localStorage.setItem("loggedIn", "false");
  sessionStorage.setItem("loggedIn", "false");
  sessionStorage.setItem("activeUser", "false");
  window.sessionStorage.setItem("loggedIn", "false");
  window.location.href = "./login.html";
}

/**
 * Creates the balls, in wich the contact initials are shwon.
 * @param {Object} contact Contact out of the ContactList
 * @returns
 */
function renderContactBubbleHtml(contact) {
  return /*html*/ `<svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="contact-bubble-${contact.id}"
  >
    <circle
      cx="21"
      cy="21"
      r="20"
      fill="${contact.color}"
      stroke="white"
      stroke-width="2"
    />
    <text
      x="21"
      y="21"
      alignment-baseline="central"
      text-anchor="middle"
      fill="white"
    >
    ${contact.initials}
    </text>
  </svg>`;
}
