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
