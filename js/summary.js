/**
 * Initializes the Summary Page by orchestrating and calling various actions.
 */
async function initSummary() {
  greetUser();
  await getDataFromBackend();
  showTotalTasks();
  showTasks();
  showUpcomingDeadline();
}

/**
 * Greets the user based on their status (guest or active) and screen type (mobile or desktop).
 * Guest user status is defined by the query parameter of the URL leading from the guest login button to the summary page.
 * This function adjusts the greeting message and user name display accordingly.
 */
function greetUser() {
  const isGuestUser = location.search.includes("guestuser=true")
  setActiveUser(isGuestUser)
  if (screenType === "mobile" && isGuestUser) {
    loadHelloPageMobile();
    greetGuestUser(isGuestUser, "greetingMobile", "userNameMobile");
  } else if (screenType === "mobile" && activeUser) {
    loadHelloPageMobile();
    document.getElementById("userNameMobile").innerHTML = activeUser.name;
  } else if (screenType === "desktop" && isGuestUser) {
    showGreeting("greetingDesktop");
    greetGuestUser(isGuestUser, "greetingDesktop", "userNameDesktop");
  } else if (screenType === "desktop" && activeUser) {
    showGreeting("greetingDesktop");
    document.getElementById("userNameDesktop").innerHTML = activeUser.name;
  }
}

/**
 * If Login came as Guest, activeUser will be set on "false"
 * @param {boolean} isGuestUser If Guets login is used, this will be true, else it will be false.
 */
function setActiveUser(isGuestUser) {
  if (isGuestUser) {
    sessionStorage.setItem("activeUser", JSON.stringify(false));
    activeUser = false;
  }
}

/**
 * Adapts the greeting message if its a guest user. Hides the div with the user name.
 * @param {boolean} isGuestUser - A boolean flag indicating whether the current user is a guest.
 * @param {string} greetingID - The ID of the HTML element containing the greeting message.
 * @param {string} nameID - The ID of the HTML element containing the user's name display.
 */
function greetGuestUser(isGuestUser, greetingID, nameID) {
  if (isGuestUser) {
    localStorage.setItem("isGuestUser", "true");
    modifyGreetingForGuestUser(greetingID);
    hideUserName(nameID);
  } else {
    const storedIsGuestUser = localStorage.getItem("isGuestUser");
    if (storedIsGuestUser === "true") {
      modifyGreetingForGuestUser(greetingID);
      hideUserName(nameID);
    }
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
  setTimeout(function () {
    helloPage.classList.add("fadeOut");
  }, 1100);

  helloPage.addEventListener("transitionend", function () {
    helloPage.style.display = "none";
  });
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

  if (currenthour >= 4 && currenthour < 12) {
    greeting.innerHTML = "Good morning,";
  } else if (currenthour >= 12 && currenthour < 18) {
    greeting.innerHTML = "Good afternoon,";
  } else if (currenthour >= 18 && currenthour < 22) {
    greeting.innerHTML = "Good evening,";
  } else {
    greeting.innerHTML = "Good night,";
  }
}
