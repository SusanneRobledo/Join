/**
 * Initializes the Summary Page by orchestrating and calling various actions.
 */
async function initSummary() {
  //setRegisteredUser();
  greetUser();
  await getDataFromBackend();
  showTotalTasks();
  showTasks();
  showUpcomingDeadline();
}

/**
 * If User logs in as Guest, registeredUser will be set in session storage and flagged as "false". Needed for Contacts.js!
 */
function setRegisteredUser() {
  if (!registeredUser) {
    sessionStorage.setItem("registeredUser", JSON.stringify(false));
  }
}

/**
 * Greets the user based on their status (guest or registered) and screen type (mobile or desktop).
 */
function greetUser() {
  let mobileGreetingShown = setMobileGreetingStatus();
  handleMobileGreetings(mobileGreetingShown);
  handleDesktopGreetings();
}

/**
 * Coordinates the two mobile versions of the user greetings (guest or registered user).
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

/**
 * Coordinates the two desktop versions of the user greetings (guest or registered user).
 */
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

///////////////////////////////////////////////////////////////////////
// Render Numbers from Board into Summary Page

/**
 * Displays the total number of tasks on the Board Page.
 * This function retrieves the total task count from the taskList Array and updates the HTML content.
 */
function showTotalTasks() {
  let tasksCount = document.getElementById("tasksCount");
  tasksCount.innerHTML = "";
  let totalTasks = taskList.length;
  tasksCount.innerHTML = totalTasks;
}

/**
 * Displays the count of tasks in the 4 different categories and statuses.
 * This function calls the 'showTaskAmount' function to show the count for each category and status.
 */
function showTasks() {
  showTaskAmount("progressCount", "status", "inprogress");
  showTaskAmount("feedbackCount", "status", "feedback");
  showTaskAmount("todoCount", "status", "todo");
  showTaskAmount("doneCount", "status", "done");
  showTaskAmount("urgentCount", "priority", "urgent");
}

/**
 * Counts the number of tasks of a certain status by counting the length of the array of that specific Task status.
 * @param {string} ID - The ID of the HTML element where the task count is displayed.
 * @param {string} property - The property (e.g., "status" or "priority") by which tasks will be categorized.
 * @param {string} propertyValue - The specific value (e.g., "inprogress," "feedback," "todo," "done," or "urgent") to match tasks against.
 */
function showTaskAmount(ID, property, propertyValue) {
  let task = document.getElementById(ID);
  task.innerHTML = filterTasksByProperty(property, propertyValue).length;
}

/**
 * Filters tasks in the taskList array based on a specific property and property value.
 * @param {string} property - The property (e.g., "status" or "priority") by which tasks will be categorized.
 * @param {string} propertyValue - The specific value (e.g., "inprogress," "feedback," "todo," "done," or "urgent") to match tasks against.
 * @returns {Array} - An array of tasks that match the specified property and property value criteria.
 */
function filterTasksByProperty(property, propertyValue) {
  let filteredProperty = taskList.filter((x) => x[property] === propertyValue);
  return filteredProperty;
}

///////////////////////////////////////////////////////////////////////
// Functions to display the formatted Upcoming Deadline on the Summary Page

/**
 * Displays the nearest upcoming deadline in an HTML element with the ID "deadline."
 * This function retrieves the upcoming deadline from the filteredDeadlines function and formats it for display.
 */
function showUpcomingDeadline() {
  let deadline = document.getElementById("deadline");
  let deadlinesArray = filteredDeadlines();

  if (deadlinesArray.length === 0) {
    deadline.innerHTML = `<div style="font-weight: 400; margin-bottom: 10px;">Sit back & relax:</div><div>No</div>`; // If no tasks are in Board, hence no deadlines to display.
  } else {
    deadline.innerHTML = formatUpcomingDeadline();
  }
}

/**
 * Retrieves all due dates from the taskList array and returns them in an array.
 * @returns {Array} An array containing all due dates from the taskList.
 */
function filteredDeadlines() {
  let deadlines = [];

  for (let x of taskList) {
    if (x.dueDate) {
      deadlines.push(x.dueDate);
    }
  }
  return deadlines;
}

/**
 * Retrieves the due dates from the deadlines array from the function filtered Deadlines.
 * Converts the format so they can be sorted and sorts them from earliest to more distant date.
 * The earliest deadline is on first position (0) in the array.
 * @returns {string} The upcoming deadline (earliest deadline on pos 0) in string format (e.g., "24/08/2023").
 */
function getUpcomingDeadline() {
  let deadlinesArray = filteredDeadlines();

  let sortedDeadlines = deadlinesArray.sort((a, b) => {
    let nearestDate = new Date(a.split("/").reverse().join("/"));
    let distantDate = new Date(b.split("/").reverse().join("/"));
    return distantDate - nearestDate;
  });

  let upcomingDeadline = sortedDeadlines[0];
  return upcomingDeadline;
}

/**
 * Formats the upcoming deadline retrieved from getUpcomingDeadline into a more readable format.
 * The month in numbers is exchange by the written version of the month.
 * @returns {string} The formatted upcoming deadline in the "Month Day, Year" format (e.g., "August 24, 2023").
 */
function formatUpcomingDeadline() {
  let upcomingDeadline = getUpcomingDeadline();
  months = getMonth();
  let datePartsAsArray = upcomingDeadline.split(".");
  let year = datePartsAsArray[2];
  let monthIndex = parseInt(datePartsAsArray[1]) - 1;
  let day = datePartsAsArray[0];

  let formattedDeadline = `${months[monthIndex]} ${day}, ${year}`;
  return formattedDeadline;
}

/**
 * Array of month names.
 * @returns {Array} An array containing the names of the months.
 */
function getMonth() {
  return [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
}

///////////////////////////////////////////////////////////////////////

/**
 * Changes the source URL of an image element with the specified ID.
 * @param {string} Id - The ID of the image element to be updated.
 * @param {string} url - The new URL to set as the source of the image.
 */
function changeIcon(Id, url) {
  document.getElementById(Id).src = `./assets/img/${url}`;
}

// Greeting the User

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
