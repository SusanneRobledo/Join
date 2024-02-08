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
  getAssignedBadges();
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
 */
function getAssignedBadges() {
  for (let i = 0; i < filteredTasks.length; i++) {
    const filteredTask = filteredTasks[i];
    const badge = document.getElementById(`profileBadges-${filteredTask.id}`);
    const assignedContacts = filteredTask["assignedTo"];
    badge.innerHTML = "";
    renderAssignedBadges(assignedContacts, badge);
  }
}

/** Iterates through the assignedContacts array for the current task and generates
 * the HTML Code for each assigned contact. */
function renderAssignedBadges(assignedContacts, badge) {
  for (let j = 0; j < assignedContacts.length; j++) {
    const assignedContact = assignedContacts[j];
    if (j < 3) showFirstThreeAssignedContacts(badge, assignedContact);
    else if (j === 3) showPlaceholderForMoreContacts(badge, assignedContacts);
  }
}

/** If there are 3 or less contacts assigned, shows the badges for these contacts. */
function showFirstThreeAssignedContacts(badge, assignedContact) {
  badge.innerHTML += generateBadgeHTML(assignedContact);
}

/** If there are 3 or more contacts assigned to the task, it shows a grey placeholder with the number if how many more contacts are assigned to it. */
function showPlaceholderForMoreContacts(badge, assignedContacts) {
  badge.innerHTML += generateBadgeHTML({
    color: "lightgrey",
    initials: `+${assignedContacts.length - 3}`,
  });
}

/**
 * Determines and returns the color code based on the selected category of the task.
 * values are "user story" or "technical task". If for some reason there is no category, the default color is orange.
 * @param {string} category category of the current task, retrieved from TaskList array with key "category".
 * @returns color
 */
function assignLabelColor(category) {
  if (category === "User Story") return "#0038ff"; // Blue color
  else if (category === "Technical Task") return "#1FD7C1"; // Turquoise color
  else if (category === "Marketing") return "#9327FF"; // Violet
  else if (category === "Testing") return "#FFBB2C"; // Yellow
  else if (category === "Design") return "#FC71FF"; // Pink
  else if (category === "Bug Fix") return "#462F8A"; // Deep Purple
  else if (category === "Research") return "#FF7A01"; // Orange
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
  if (subtasks.length === 0)
    list.innerHTML = `<div class="subtask">No subtasks</div>`;
  else {
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
  if (subtaskStatus === "todo") srcImg = "unchecked";
  else srcImg = "checked";
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
    if (checkboxes[i].classList.contains("checked"))
      subtasks[i].status = "done";
    else subtasks[i].status = "todo";
  }
  await setItemInBackend("taskList", JSON.stringify(taskList));
}
