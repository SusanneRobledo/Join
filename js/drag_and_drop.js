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
