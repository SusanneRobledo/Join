let currentDraggedElement;
let labelColor;
let filteredTasks;
let task;

/**
 * Initializes functions of the Board.
 */
async function initBoardPage() {
  await getDataFromBackend();
  renderAllContainersHTML();
}

/**
 * Predefined Array that contains the 4 possible status values of the tasks.
 * The function iterates through the status and retrieves the current status.
 * Then the updateHTML function ist called with two arguments: the current status
 * value is used both as a status filter and as an ID for the container where the updated HTML content should be placed.
 */
function renderAllContainersHTML() {
  const statusArr = ["todo", "inprogress", "feedback", "done"];
  for (let i = 0; i < statusArr.length; i++) {
    const status = statusArr[i];
    updateHTML(status, status);
  }
}

/**
 * Updates the HTML content of the columns on the Board page based on a given status and ID.
 * Filters the task Array based on the status of the task.
 * If there are no Task of a certain status, the placeholder is rendered into this column.
 * Otherwise it renders the Task HTML into the column and displayes it as a card.
 * @param {string} status current status of the filtered Task
 * @param {string} id id of the board column the task is rendered into (= same value as status)
 */
function updateHTML(status, id) {
  filteredTasks = taskList.filter((t) => t["status"] == status);
  const taskContainer = document.getElementById(id);
  taskContainer.innerHTML = "";
  if (filteredTasks.length === 0) {
    const placeholderText = renderPlaceholderText(status);
    taskContainer.innerHTML = generatePlaceholderHTML(placeholderText);
  } else {
    for (let i = 0; i < filteredTasks.length; i++) {
      task = filteredTasks[i];
      let totalSubtasks = getSubtasksCount(i);
      let subtasksDone = getSubtasksDone(i);
      labelColor = assignLabelColor(task.category);
      taskContainer.innerHTML += generateSmallCardHTML(
        totalSubtasks,
        subtasksDone,
        task,
        i
      );
    }
  }
  renderSmallCard();
}

/**
 * Orchestrates the rendering of various components of the Task-Card.
 * It calls seperate functions to update the ProgressBar, the Assigned User Badges and the Prio Icons.
 */
function renderSmallCard() {
  showMobileMoveTaskButton();
  renderProgressSection();
  renderAssignedBadges();
  renderPrio();
}

/**
 * displays or hides the Button to move a Task on a mobile Device according to the Screen Type.
 * Checks wether the Screentype is "desktop", if so: hides button, if not, displays it.
 */
function showMobileMoveTaskButton() {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const mobileMoveButton = document.getElementById(
      `mobile-move-${filteredTask.id}`
    );
    if (is_touch_enabled() == false) {
      mobileMoveButton.style.display = "none";
    } else {
      mobileMoveButton.style.display = "block";
    }
  }
}

/** detects touch interaction and returns true if it is touch device */
function is_touch_enabled() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/** Renders the Menu Items: checks the Task Status and renders the stati that dont correspond with the task status into the Menu */
function generateMenuItems(task) {
  const statusArr = ["todo", "inprogress", "feedback", "done"];
  let menuItems = "";
  for (let i = 0; i < statusArr.length; i++) {
    const category = statusArr[i];
    if (task.status !== category) {
      let moveToFunction = getMoveFunctionByStatus(task, category);
      menuItems += `<a class="MenuButton" href="#${category}-headline" onclick="${moveToFunction}">${
        category.charAt(0).toUpperCase() + category.slice(1)
      }</a>`;
    }
  }
  return menuItems;
}

/** Gets the right parameters to call the moveToMobile function by matching it with the category (the Menu item)
 * and returns the function to call, so the task can be transferred into the selected category.
 */
function getMoveFunctionByStatus(task, category) {
  switch (category) {
    case "todo":
      return `moveToMobile(${task.id}, 'todo', event)`;
    case "inprogress":
      return `moveToMobile(${task.id}, 'inprogress', event)`;
    case "feedback":
      return `moveToMobile(${task.id}, 'feedback', event)`;
    case "done":
      return `moveToMobile(${task.id}, 'done', event)`;
  }
}

/** Sets the distance of the Menu to the top of the SmallCard and calls the FlyIn Funktion to make the Menu visible.
 * the event propagation stops the onclick event to open LargeCard.
 */
function openMobileMoveMenu(taskId, event) {
  event.stopPropagation();
  let mobileMoveBtn = document.getElementById(`mobile-move-${taskId}`);
  let menuContainer = document.getElementById(`mobile-move-menu-${taskId}`);
  menuContainer.style.top = `${mobileMoveBtn.offsetTop + 40}px`;
  flyInMenu(`mobile-move-menu-${taskId}`);
}

/** Gets the Index belonging to the Task and saves the new status to move it into another category column.
 * Updates the TaskList Array in the Backend and Renders the HTML to display the Task in the right Columns.
 * the event propagation stops the onclick event to open LargeCard.
 */
async function moveToMobile(task, category, event) {
  event.stopPropagation();
  const taskIndex = getTaskIndexByID(task);
  taskList[taskIndex]["status"] = category;
  await setItemInBackend("taskList", JSON.stringify(taskList));
  renderAllContainersHTML();
}

/**
 * Renders the Section that displays the progress on the Subtasks on the Small Card of a specific filtered Task.
 * First, it checks if there are subtasks belonging to the filtered Task and hides the section, if it is empty (no subtasks).
 * Then it calls the updateProgressBar Function.
 */
function renderProgressSection() {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const progress = document.getElementById(
      `progress-section-${filteredTask.id}`
    );
    const assignedSubtasks = filteredTask["subtasks"];
    if (assignedSubtasks.length === 0) {
      progress.style.display = "none";
    } else {
      updateProgressBar(i);
    }
  }
}

/**
 * Counts the numer of subtasks belonging to the task in the filteredTasks Array.
 * @param {Number} i index of the task in the filteredTasks array
 * @returns number of total subtask of current task
 */
function getSubtasksCount(i) {
  const filteredSubtask = filteredTasks[i]["subtasks"];
  return filteredSubtask.length;
}

/**
 * Counts the number of subtasks that are marked as "done" for a specific task in the filteredTasks Array.
 * Then returns the number of done Subtasks.
 * @param {Number} i the index of the task in the filteredTasks array for which the function counts the "done" subtasks.
 * @returns number of done subtasks
 */
function getSubtasksDone(i) {
  const filteredSubtasks = filteredTasks[i]["subtasks"];
  const subtasksStatus = [];
  let subtasksDone = 0;
  for (let i = 0; i < filteredSubtasks.length; i++) {
    const filteredSubtask = filteredSubtasks[i];
    subtasksStatus.push(filteredSubtask.status);
  }
  for (let j = 0; j < subtasksStatus.length; j++) {
    if (subtasksStatus[j] === "done") {
      subtasksDone++;
    }
  }
  return subtasksDone;
}

/**
 * Updates the width of the progress bar based on how many subtasks are marked as "done" for the specific task.
 * @param {Number} i
 */
function updateProgressBar(i) {
  const task = filteredTasks[i];
  const totalSubtasks = getSubtasksCount(i);
  const subtasksDone = getSubtasksDone(i);
  let percent = subtasksDone / totalSubtasks;
  percent = Math.round(percent * 100);

  document.getElementById(
    `progress-bar-${task.id}`
  ).style = `width: ${percent}%;`;
}

/**
 * Renders the badge elements that indicate which contacts or users are assigned to the specific task.
 * retrieves the list of assigned contacts for the current task from the assignedTo property.
 * Iterates through the assignedContacts array for the current task and generates
 * the HTML Code for each assigned contact.
 */
function renderAssignedBadges() {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const badge = document.getElementById(`profileBadges-${filteredTask.id}`);
    const assignedContacts = filteredTask["assignedTo"];
    badge.innerHTML = "";
    for (let j = 0; j < assignedContacts.length; j++) {
      const assignedContact = assignedContacts[j];
      badge.innerHTML += generateBadgeHTML(assignedContact);
    }
  }
}

/**
 * Determines and returns the color code based on the selected category of the task.
 * values are "user story" or "technical task". If for some reason there is no category, the default color is orange.
 * @param {string} category category of the current task, retrieved from TaskList array with key "category".
 * @returns color
 */
function assignLabelColor(category) {
  if (category === "User Story") {
    return "#0038ff"; // Blue color
  } else if (category === "Technical Task") {
    return "#1FD7C1"; // Turquoise color
  }
  // Default color Orange, if category doesn't match
  return "#FF7A00";
}

/**
 * Renders the Prio Icons on the SmallCard. Retrieving the prio data for the filtered Task from the TaskList array, key priority.
 */
function renderPrio() {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const prio = document.getElementById(`prioIcon-${filteredTask.id}`);
    const assignedPrio = filteredTask["priority"];
    prio.innerHTML = "";
    prio.innerHTML += generatePrioHTML(assignedPrio);
  }
}

/**
 * Generates the text for the placeholder message. Adapts the text of the given status.
 * @param {string} status - The status for which the placeholder text is being generated (e.g., "todo", "inprogress", "feedback", "done").
 * @returns {string} The descriptive text for the corresponding placeholder message.
 */
function renderPlaceholderText(status) {
  switch (status) {
    case "todo":
      return "To Do";
    case "inprogress":
      return "In Progress";
    case "feedback":
      return "Await Feedback";
    case "done":
      return "Done";
  }
}

//////////////////////////////////////////////////////////////////////
// DRAG & DROP FUNCTIONS
/** Sets the Task ID to the currently dragged Element and saves it in a variable */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Prevents the default behavior of the drag-and-drop event, allowing the element to be a drop target.
 * @param {Event} event - The drag-and-drop event object.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Moves the Task into another Column by setting the new Status and updates the backend data.
 * @param {string} status - The new status to which the task will be moved (e.g., "todo", "inprogress", "feedback", "done").
 */
async function moveTo(status) {
  const taskIndex = taskList.findIndex(
    (task) => task.id === currentDraggedElement
  );
  taskList[taskIndex]["status"] = status;
  await setItemInBackend("taskList", JSON.stringify(taskList));
  renderAllContainersHTML();
}

/**
 * Adds a CSS class to highlight the drop area for the Drag & Drop.
 * @param {string} ID - The ID of the column to which the highlight class will be added.
 */
function addHighlight(ID) {
  document.getElementById(ID).classList.add("drag-area-highlight");
}

/**
 * Removes the Highlight from the droparea
 *  @param {string} ID - The ID of the column to which the highlight class will be added.
 */
function removeHighlight(ID) {
  document.getElementById(ID).classList.remove("drag-area-highlight");
}

/* End of Drag & Drop functions
////////////////////////////////////////////////////////////////////////////////

/**
 * Deleting a task out of TaskList
 * @param {Number} taskID - ID ot the to delete Task
 */
async function deleteTask(taskID) {
  let taskIndex = getTaskIndexByID(taskID);
  taskList.splice(taskIndex, 1);
  await setItemInBackend("taskList", JSON.stringify(taskList));
  closeCard("popUpContainer");
  renderAllContainersHTML();
}

/**
 * Renders the priority icon on the larger card view based on the task's priority.
 * @param {object} task - The task within the taskList, retrieved by a specific id.
 */
function renderPrioLargeCard() {
  for (let i = 0; i < taskList.length; i++) {
    const prioLargeCard = document.getElementById("largeCardPrio");
    const assignedPrio = taskList[i]["priority"];
    prioLargeCard.innerHTML = "";
    prioLargeCard.innerHTML += generateLargeCardPrioHTML(task, assignedPrio);
  }
}

/**
 * Renders the list of assigned users or contacts on the larger card view.
 * @param {object} task - The current task within the taskList by ID.
 */
function renderAssignedUserList() {
  const list = document.getElementById("assignedSection");
  let html = "";

  const users = task["assignedTo"];

  for (let i = 0; i < users.length; i++) {
    const assignedUser = users[i];
    html += generateAssignedUserListItemHTML(assignedUser);
  }
  list.innerHTML = html;
}

/**
 * Writes the subtask into the open PopUp Card
 * @param {Object} task The Task we want to show
 */
function renderSubtasksList() {
  const list = document.getElementById("subtaskList");
  list.innerHTML = "";

  const subtasks = task["subtasks"];
  if (subtasks.length === 0) {
    list.innerHTML = `<div class="subtask">No subtasks</div>`;
  } else {
    for (let i = 0; i < subtasks.length; i++) {
      const subtask = subtasks[i];
      let srcImg = getImgBySubtaskStatus(subtask);
      list.innerHTML += generateSubtasksListHTML(srcImg, subtask.text);
    }
  }
}

/**
 * Checks Status of a subtask and returns the status (Checked or unchecked) for Image source
 * @param {Object} subtask the Subtask inside of the Task we want to show
 * @returns Status of Subtask (Checked or unchecked) for IMG
 */
function getImgBySubtaskStatus(subtask) {
  let srcImg;
  let subtaskStatus = subtask["status"];
  if (subtaskStatus === "todo") {
    srcImg = "unchecked";
  } else {
    srcImg = "checked";
  }
  return srcImg;
}

/**
 * Changes the Subtask Status depending on the Checked Boxes on the BigCard
 * @param {Number} taskID ID Of the Task we opened
 */
async function updateSubtasksStatus(taskID) {
  let checkboxes = document.getElementsByClassName("checkbox");
  const task = getTaskByID(taskID);
  subtasks = task["subtasks"];
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].classList.contains("checked")) {
      subtasks[i].status = "done";
    } else {
      subtasks[i].status = "todo";
    }
  }
  await setItemInBackend("taskList", JSON.stringify(taskList));
}

/**
 * Generates HTML code to display the subtask item within the subtasks list on the larger card.
 * Exchanges the Img by inserting the URL snippet "unchecked" or "checked" to get the correct img belonging to the subtask status.
 * @param {string} srcImg - contains the value "checked" or "unchecked" for the img src.
 * @param {string} subtask - The text content of the subtask.
 * @returns {string} The generated HTML code for the subtask item.
 */
function generateSubtasksListHTML(srcImg, subtask) {
  html = `<div class="subtask">`;
  html += `<img src="./assets/img/checkbox-${srcImg}.svg" class="icon-checkbox checkbox ${srcImg}"/>`;
  html += `<span>${subtask}<span></div>`;
  return html;
}

///////////////////////////////////////////////////////////////////
// SEARCH FUNCIONS

/**Searches through all Tasks if one may be the one, were looking for. */
function searchTask() {
  let term = document.getElementById("findTask").value;
  term = term.toLowerCase();
  let foundTasks = [];

  for (i in taskList) {
    let taskTitle = taskList[i].title.toLowerCase();
    let taskDesc = taskList[i].description.toLowerCase();
    if (taskTitle.includes(term) || taskDesc.includes(term)) {
      foundTasks.push(taskList[i].id);
    }
  }
  hideNotSearchedTasks(foundTasks);
}

/**
 * Hides tasks, the user doesn't look for by checking, if the id of a task is inside of the foundTasks - Array.
 * @param {Array} foundTasks collection of ID´s from those Tasks, wich involve things, the user is looking for.
 */
function hideNotSearchedTasks(foundTasks) {
  for (task of taskList) {
    if (foundTasks.indexOf(task.id) + 1) {
      //+1 because if the index is 0, it will be handled as 'false'!
      document.getElementById(task.id).style.display = "flex";
    } else {
      document.getElementById(task.id).style.display = "none";
    }
  }
}
