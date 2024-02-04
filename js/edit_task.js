let formattedDate;

/**
 * Gets selectet Task, and writes the Task, returned by generateEditTaskHTML() into a container.
 * Afterwards a few functions to make the editing work as it should.
 * @param {Number} taskID ID of Task, we want to edit
 */
function editTask(taskID) {
  selectedTask = getTaskByID(taskID);
  let editCard = document.getElementById("popUpContainer");
  formatDateforDatePicker(selectedTask);
  editCard.innerHTML = generateEditTaskHTML(taskID);
  markPrioForEdit(selectedTask);
  setSelectedContactIdsArray(selectedTask["assignedTo"]);
  renderSubtasksList(taskID);
}

/**
 *
 * @param {Array} selectedContacts The Contacts
 */
function setSelectedContactIdsArray(selectedContacts) {
  selectedContactIds = [];
  for (let i = 0; i < selectedContacts.length; i++) {
    const contact = selectedContacts[i];
    selectedContactIds.push(contact.id);
  }
}

/**
 * Generates Contact-Initial Balls as SVG Elements
 * @param {Number} taskID -ID of used Task
 * @returns SVG Elements for Edit-Task Side
 */
function showAssignedContacts(taskID) {
  let task = getTaskByID(taskID);
  let result = "";
  for (contact of task.assignedTo) {
    result += renderContactBubbleHtml(contact);
  }
  return result;
}

/**
 * Checks priority field in Edit-Task
 * @param {Object} selectedTask - selected Task in Array
 */
function markPrioForEdit(selectedTask) {
  let div = document.getElementById("prio-inputs");
  let prioFields = div.querySelectorAll("input");
  for (i in prioFields) {
    if (prioFields[i].value == selectedTask.priority) {
      prioFields[i].checked = true;
      break;
    }
  }
}

/**
 * Formats the date from the array to the required date pickter format so it can be displayed in input field.
 * original format in Array: dd.mm.yyyy
 * changes to Format: yyyy-mm-dd for date picker.
 * @param {Object} selectedTask selected task from Array
 */
function formatDateforDatePicker(selectedTask) {
  let inputDate = selectedTask.dueDate;
  let [day, month, year] = inputDate.split(".");
  formattedDate = `${year}-${month}-${day}`;
}

/**
 * gets the Task and creates all the HTML needed for the Edit-WIndow.
 * @param {Number} taskID ID Number of Task
 * @returns The HTML Code for the Edit-Window. Filled with Data of the Task, we want to edit.
 */
function generateEditTaskHTML(taskID) {
  let task = getTaskByID(taskID);
  return /*html*/ `
    <div id="editPopUp" class="popUp">
      <div class="editCard">
      <div id="backdrop" class="backdrop d-none"></div>
      <div>
        <form id="addtask-form">
          <div class="edit-card-header">
              
            <img
                onclick="closeCard('popUpContainer')"
                id="btnCloseCard"
                class="btn-close-card"
                src="./assets/img/close-btn.svg"
            />
          </div>
          <div class="form-controls-all">
            <div class="form-controls-section">
              <div class="form-control">
                <label class="edit-title" for="title-input">Title</label>
                <div class="input">
                  <input
                    required
                    type="text"
                    placeholder="Enter a title"
                    id="title-input"
                    value="${task.title}"
                  />
                </div>
                <div class="error-container">
                  <div class="error-message" id="title-input-error"></div>
                </div>
              </div>
              <div class="form-control">
                <label for="description-input">Description</label>
                <div class="input">
                  <textarea
                    required
                    placeholder="Enter a description"
                    id="description-input"
                    >${task.description}</textarea>
                </div>
                <div class="error-container">
                  <div class="error-message" id="description-input-error"></div>
                </div>
              </div>
              <div id="assigned-to-form-control" class="form-control">
                <label for="assigned-to-input">Assigned to</label>
                <div class="input select-input">
                  <input
                    readonly
                    required
                    id="assigned-to-input"
                    value="Select contacts to assign"
                    class="custom-validation"
                  />
                  <img
                    id="dropdown-arrow"
                    src="./assets/img/arrow_dropdown_down.png"
                  />
                </div>
                <div class="error-container">
                  <div class="error-message" id="assigned-to-input-error"></div>
                </div>
                <div
                  id="contacts-list"
                  class="contacts-list-container edit-task-selection-container select-options-container d-none"
                >
                  <ul
                    id="assigned-to-options"
                    class="select-options assigned-to-options"
                  ></ul>
                 </div>
                <div id="selected-contacts" class="selected-contacts">
                  ${showAssignedContacts(taskID)}
                </div>
              </div>
            </div>
            <div class="vertical-separator d-none"></div>
            <div class="form-controls-section">
              <div class="form-control">
                <span class="label">Prio</span>
                <div
                  id="prio-inputs"
                  class="input-prio-container input-radio custom-validation custom-element"
                >
                  <div class="radio-button prio-urgent">
                    <label for="urgent" class="label-radio-btn"
                      >Urgent<input
                        id="urgent"
                        type="radio"
                        name="prio-input"
                        value="urgent"
                      />
                      <svg
                        width="21"
                        height="16"
                        viewBox="0 0 21 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                          fill="#FF3D00"
                        />
                        <path
                          d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                          fill="#FF3D00"
                        />
                      </svg>
                    </label>
                  </div>
                  <div class="radio-button prio-medium">
                    <label for="medium" class="label-radio-btn"
                      >Medium<input
                        id="medium"
                        type="radio"
                        name="prio-input"
                        value="medium"
                        checked
                      />
                      <svg
                        width="21"
                        height="8"
                        viewBox="0 0 21 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                          fill="#FFA800"
                        />
                        <path
                          d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                          fill="#FFA800"
                        />
                      </svg>
                    </label>
                  </div>
                  <div class="radio-button prio-low">
                    <label for="low" class="label-radio-btn"
                      >Low<input
                        id="low"
                        type="radio"
                        name="prio-input"
                        value="low"
                        
                      />
                      <svg
                        width="21"
                        height="16"
                        viewBox="0 0 21 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z"
                          fill="#7AE229"
                        />
                        <path
                          d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z"
                          fill="#7AE229"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
                <div class="error-container">
                  <div class="error-message" id="prio-inputs-error"></div>
                </div>
              </div>
              <div class="form-control">
                <label for="due-date-input">Due date</label>
                  <input
                    id="due-date-input"
                    class="input"
                    required
                    type="date"
                    value="${formattedDate}"
                  />
                <div class="error-container">
                  <div class="error-message" id="due-date-input-error"></div>
                </div>
              </div>
              <div id="category-form-control" class="form-control">
                <label for="category-input">Category</label>
                <div class="input select-input">
                  <input
                    readonly
                    required
                    id="category-input"
                    value="${task.category}"
                    class="custom-validation"
                  />
                  <img
                    id="dropdown-arrow"
                    src="./assets/img/arrow_dropdown_down.png"
                  />
                </div>
                <div class="error-container">
                  <div class="error-message" id="category-input-error"></div>
                </div>
                <div
                  id="category-list-container"
                  class="category-list-container edit-task-selection-container select-options-container d-none"
                >
                  <ul id="category-options" class="select-options">
                    <li value="technical task">Technical Task</li>
                    <li value="user story">User Story</li>
                  </ul>
                </div>
              </div>
              <div class="form-control">
                <label for="subtasks-input">Subtasks</label>
                <div id="subtasks-container" class="input">
                  <input
                    type="text"
                    placeholder="Add new subtask"
                    id="subtasks-input"
                  />
                  <img
                    src="./assets/img/subtask-plus.png"
                    class="edit-input-icon cursor-pointer"
                    id="add-subtask"
                  />
                  <img
                    src="./assets/img/subtask-cancel.png"
                    class="edit-input-icon d-none cursor-pointer"
                    id="cancel-subtask"
                  />
                  <img src="./assets/img/subtask-separator.png" class="d-none" />
                  <img
                    src="./assets/img/subtask-save.png"
                    class="edit-input-icon d-none cursor-pointer"
                    id="save-subtask"
                  />
                </div>
                <div class="error-container">
                  <div class="error-message" id="subtasks-input-error"></div>
                </div>
                <ul id="subtaskList" class="subtasks-list"></ul>
              </div>
            </div>
          </div>
          <div class="create-btn-container">
            
            <button
              class="btn btn-primary btn-create-task btn-text-icon"
              onclick='deactivateSearchInput()'
              type="submit"
            >
              <span>Ok</span
              ><img src="./assets/img/check.png" alt="Ok" />
            </button>
          </div>
        </form>
    
      <div id="notification" class="notification">
        <span>Task added to board</span>
        <img src="./assets/img/board-icn-small.png" />
      </div>
      </div>
      <div class="background" onclick="closeCard('popUpContainer')"></div>
    </div>
    `;
}
