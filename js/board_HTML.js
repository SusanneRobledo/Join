//////////////////////////////////////////////////////////////////////////////////
/* HTML for Small Card

/**
 * Generates the HTML for rendering a small task card for the current filtered Task
 * @param {Number} totalSubtasks number of total subtasks belonging to the task
 * @param {Number} subtasksDone number of all subtasks marked as "done"/with status "done"
 * @param {Object} task current task
 * @param {Number} i index of the current filtered task
 * @returns the HTML Code for the Task
 */
// i = i in filteredTasks! Attention!
function generateSmallCardHTML(totalSubtasks, subtasksDone, task, i) {
  let menuItems = generateMenuItems(task);
  return /*html*/ `
    <div id="${task.id}" draggable="true" ondragstart="startDragging(${task.id})" ontouchmove="mobileDrag(${task.id})" class="cardSmall" onclick="openCard(${task.id}, ${i})">
      <div id="category-${task.id}" class="category">
        <div class="categoryLabel" style="background: ${labelColor};" id="categoryLabel">${task.category}</div>
        <img id="mobile-move-${task.id}" class="btn-move" onclick="openMobileMoveMenu(${task.id}, event)" src="./assets/img/icon_move.svg" />
      </div>
      <span id="mobile-move-menu-${task.id}" class="d-flex flex-direction-col mobile_task_menu float_in_menu">
        ${menuItems}
      </span>
      <div>
        <h1 class="title" id="title-${i}">${task.title}</h1>
        <p class="description" id="description-${i}">${task.description}</p>
      </div>
      <div class="progress-section" id="progress-section-${task.id}">
        <div id="progress">
          <div id="progress-bar-${task.id}" class="progress-bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div>${subtasksDone}/${totalSubtasks} Subtasks</div>
      </div>
      <div class="card-footer">
        <div class="w-100 d-flex justify-content-space-btw align-items-center">
          <div class="profileBadges" id="profileBadges-${task.id}"></div>
          <div class="prioIcon" id="prioIcon-${task.id}"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML badge containing the initials of the contact and a colored circle.
 * Initials and color are retrieved from the assignedTo key in the TaskList array.
 * @param {object} contact parameter containing the assigned contact from the TaskList array of the assigned Task.
 * @returns the badge svg with Initials and color
 */
function generateBadgeHTML(contact) {
  return /*html*/ `
    <svg
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
    </svg>
    `;
}

/**
 * Generates the HTML for the small Card to display a priority icon image based on the provided prio parameter.
 * The parameter is inserted into the img URL to exchange the correct image dynamically acording to the prio value.
 * @param {string} prio value ("low", "medium" or "urgent") of the priority belonging to the current task.
 * @returns HTML code snippet for the icon image
 */
function generatePrioHTML(prio) {
  return /*html*/ `
    <img src="./assets/img/prio-${prio}.svg">
  `;
}

//////////////////////////////////////////////////////////////////////////////////
/* HTML for Board Columns

/**
 * Generates HTML code for a placeholder message when there are no tasks of a specific status.
 * @param {string} status - The status for which there are no tasks (e.g., "todo", "inprogress", "feedback", "done").
 * @returns {string} The generated HTML code for the placeholder message.
 */
function generatePlaceholderHTML(status) {
  return `<div class="placeholder">No Tasks ${status}</div>`;
}

//////////////////////////////////////////////////////////////////////////////////
/* HTML for Large Card

/**
 * Generates HTML code for large card (PopUp) view.
 *
 * @param {object} task - The task object containing detailed information about the task.
 * @param {number} i - The index of the task.
 * @returns {string} The generated HTML code for the PopUp.
 */
function generateLargeCardHTML() {
  return /*html*/ `
          <div id="popUp-${task.id}" class="popUp">
              <div id="largeCard" class="largeCard">
                <div class="large-card-header">
                  <div id="categoryLabel" style="background: ${labelColor};" class="categoryLabel">${task.category}</div>
                  <img
                    onclick="updateSubtasksStatus(${task.id}); closeCard('popUpContainer');"
                    id="btnCloseCard"
                    class="btn-close-card"
                    src="./assets/img/close-btn.svg"
                  />
                </div>
      
                <div class="large-card-content">
                  <h1 class="title-large-card">${task.title}</h1>
                  <p class="description">${task.description}</p>
                  <table>
                    <tr>
                      <td class="col-width">Due date:</td>
                      <td id="dueDate">${task.dueDate}</td>
                    </tr>
                    <tr>
                      <td class="col-width">Priority:</td>
                      <td class="prio-btn" id="largeCardPrio"></td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <span>Assigned To:</span>
                        <div class="subsection" id="assignedSection">
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <span>Subtasks</span>
                        <div class="subsection" id="subtaskList">
                          <div class="subtask">No subtasks</div>
                        </div>
                      </td>
                    </tr>
                  </table>
      
                  <div class="large-card-footer">
                    <div class="footer-btn" onclick="deleteTask(${task.id})">
                      <span class="delete-icon"></span>
                      <span>Delete</span>
                    </div>
                    <div class="btn-seperator"></div>
                    <div onclick="updateSubtasksStatus(${task.id}), editTask(${task.id}), initAddTaskPage()" class="footer-btn">
                      <span class="edit-icon"></span>
                      <span>Edit</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="background" onclick="updateSubtasksStatus(${task.id}); closeCard('popUpContainer');"></div>
          </div>
        `;
}

/**
 * Generates HTML code to display the priority icon and label on the larger card view.
 * @param {object} task - The current task within the taskList by ID.
 * @returns {string} The generated HTML code for the priority section of the larger card.
 */
function generateLargeCardPrioHTML(task) {
  return /*html*/ `
    <div class="prio-btn">
      <span>${task.priority}</span>
      <img src="./assets/img/prio-${task.priority}.svg">
    </div>
    `;
}

/**
 * Generates HTML code for Item of the assigned user for the Assigned User list on the larger card.
 * @param {object} contact - The contact information within the taskList array of the current task and user.
 * @returns {string} The generated HTML code for the assigned user item.
 */
function generateAssignedUserListItemHTML(contact) {
  let html = "";
  html = `<div class="assigned-user">`;
  html += generateBadgeHTML(contact);
  html += `<span>${contact.name}<span></div>`;
  return html;
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
