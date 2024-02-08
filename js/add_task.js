let subtaskEl;
let backdrop;
let formControl;
let subtasks = [];
let selectedContactIds = [];
let selectedTask = null;
let taskDestinationStatus;

/** Gets 2 container for further use. */
function getAddContactElements() {
  subtaskEl = document.getElementById("subtasks-container");
  backdrop = document.getElementById("backdrop");
}

/** The order for the functions, so the Add-Task page works correctly. */
async function initAddTaskPage() {
  getAddContactElements();
  initSubtaskInput();
  initForm();
  if (location.href.includes("add_task.html")) {
    initClearBtn();
    document
      .getElementById("submit-task-form-btn")
      .addEventListener("click", () => {
        document.getElementById("addtask-form").requestSubmit();
      });
    initAddContactOverlayForm();
    document
      .getElementById("add-contact-btn")
      .addEventListener("click", () =>
        document.getElementById("add-contact-overlay").showModal()
      );
  }
  await getContacts();
  renderAssignedToContactList(contactList);
  initSelectInputs();
  renderSubtasksInForm();
  setMinDateForPicker();
  getTaskDestination();
}

/**Adds close function to close buttons of Add contact overlay form */
function initAddContactOverlayForm() {
  const dialogEl = document.getElementById("add-contact-overlay");
  const closeBtns = dialogEl.querySelectorAll(".close-icn");
  for (let i = 0; i < closeBtns.length; i++) {
    const closeBtn = closeBtns[i];
    closeBtn.addEventListener("click", () => {
      dialogEl.close();
    });
  }
}

/**Gettinig the contactList out of backend */
async function getContacts() {
  contactList = await getItemFromBackend("contactList");
}

/**adds reset function to clear btn, resetting the entire add task form */
function initClearBtn() {
  document.getElementById("clear-btn").addEventListener("click", (ev) => {
    ev.preventDefault();
    document.getElementById("addtask-form").reset();
    document.getElementById("selected-contacts").innerHTML = "";
    document.getElementById("subtaskList").innerHTML = "";
    selectedContactIds = [];
    renderAssignedToContactList(contactList);
    initAssignedToSelectItems(document.getElementById("assigned-to-options"));
  });
}

/**adds selectCategory function to eacj category option
 * @param {HTMLUListElement} list Unordered list that contains the category options
 */
function initCategorySelectItems(list) {
  const categoryOptions = list.querySelectorAll("li");
  for (let i = 0; i < categoryOptions.length; i++) {
    const option = categoryOptions[i];
    option.addEventListener("click", selectCategory);
  }
}

/**adds toggleContactSelection function to each contact list item in assigned to dropdown
 * @param {HTMLUListElement} list ul Element that contains the contacts as li elements
 */
function initAssignedToSelectItems(list) {
  const contacts = list.querySelectorAll("li");
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contact.addEventListener("click", toggleContactSelection);
  }
}

/**toggles the subtask icons for either default (+) or editing (cancel and save) */
function toggleSubtaskIcons() {
  if (subtaskEl.firstElementChild.value === "") {
    const elements = subtaskEl.getElementsByTagName("img");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.toggle("d-none");
    }
  }
}

/**sets focus to provided element
 * @param {HTMLElement} element Element which the focus is set to.
 */
function setFocusToElement(element) {
  element.focus();
}

/**deletes input text of subtask input and toggles buttons */
function cancelSubtask() {
  document.getElementById("subtasks-input").value = "";
  toggleSubtaskIcons();
}

/**adds subtask to array, resets subtask input to default and renders subtask list */
function addSubtask(ev) {
  const input = document.getElementById("subtasks-input");
  if (ev.type === "keypress" && ev.key === "Enter") ev.preventDefault();
  if (canSubtaskBeAdded(ev, input)) {
    subtasks.push({ text: input.value, status: "todo" });
    input.value = "";
    input.focus();
    if (ev.type === "click") toggleSubtaskIcons();
    renderSubtasksInForm();
  }
}

/** Subtask can be added if the field contains a value and user clicks or presses key */
function canSubtaskBeAdded(ev, input) {
  return (
    input.value &&
    (ev.type === "click" || (ev.type === "keypress" && ev.key === "Enter"))
  );
}

/**loops through subtasksList array and calls render function for each subtask */
function renderSubtasksInForm() {
  const subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i].text;
    subtasksList.innerHTML += renderNewListItemHtml(subtask, i);
  }
}

/**deletes selected subtask from array and renders subtasks
 * @param {number} index Index of subtask to be deleted.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasksInForm();
}

/**sets subtask inline into edit mode
 * @param {number} index Index of subtask to be edited.
 */
function editSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  subtaskListEl.classList.add("subtask-edit");
  subtaskListEl.querySelector("input").readOnly = false;
}

/**saves edit to subtask array and render innerHtml of subtask
 * @param {number} index Index of subtask to be updated.
 */
function updateSubtask(index) {
  const subtasksList = document.getElementById("subtaskList");
  const subtaskListEl = subtasksList.children[index];
  const subtaskText = subtaskListEl.querySelector("input").value;
  subtaskListEl.classList.remove("subtask-edit");
  subtasks[index].text = subtaskText;
  subtaskListEl.innerHTML = renderListItemHtml(subtaskText, index);
}

/** changes html (background-color and checkbox) of assigned to option reflecting user's (de)selection of option */
function toggleContactSelection(event) {
  const listItem = event.currentTarget;
  listItem.classList.toggle("selected");
  const selectedContactsEl = document.getElementById("selected-contacts");
  if (listItem.classList.contains("selected"))
    handleSelectedContact(selectedContactsEl, listItem);
  else handleDeselectedContacts(selectedContactsEl, listItem);
}

/** When the list item is selected, this function adds the item's value to the selected contact IDs, changes the checkbox image to a checked state, and renders a contact bubble for the selected item */
function handleSelectedContact(selectedContactsEl, listItem) {
  selectedContactIds.push(listItem.value);
  listItem.querySelector("img").src = "./assets/img/checkbox-checked-white.png";
  selectedContactsEl.innerHTML += renderContactBubbleHtml(
    getContactById(listItem.value)
  );
}

/** When the list item is deselected, this function changes the checkbox image to an unchecked state, removes the associated contact bubble, and removes the item's value from the selected contact IDs */
function handleDeselectedContacts(selectedContactsEl, listItem) {
  listItem.querySelector("img").src = "./assets/img/checkbox-unchecked.svg";
  selectedContactsEl
    .getElementsByClassName("contact-bubble-" + listItem.value)[0]
    .remove();
  selectedContactIds.splice(selectedContactIds.indexOf(listItem.value), 1);
}

/** gets contact from contactlist by its Id
 * @param {number} id Id of contact in backend.
 */
function getContactById(id) {
  return contactList.find((contact) => contact.id === id);
}

/** validates form and displays error messages if not successful. If successful, contact is added and form is closed */
async function validateOverlayAddcontactForm(e) {
  const form = document.getElementById("overlay-add-contact-form");
  let formIsValid = validateForm(form);

  if (formIsValid) {
    await addContactWithinTaskForm();
    form.parentElement.close();
    triggerDropdownArrowClick();
  } else markFormAsInvalid(form);

  e.preventDefault();
}

function validateForm(form) {
  const formElements = form.querySelectorAll("input, textarea, select");

  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    formElement.checkValidity();
    if (formIsNotValid(formElement)) {
      updateErrorContainer(formElement);
      return false;
    }
  }
  return true;
}

function markFormAsInvalid(form) {
  form.classList.add("is-validated");
}

/** Triggers a click event on the dropdown arrow */
function triggerDropdownArrowClick() {
  document.getElementById("dropdown-arrow").dispatchEvent(new Event("click"));
}

/**validates due date input to ensure it's neither empty nor the selected date is in the past
 * @param {HTMLElement} formElement Input element for due date to be validated.
 */
function validateDueDateInput(formElement) {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let inputDate = new Date(formElement.value);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate < today)
    formElement.setCustomValidity("Date must not be in the past.");
  else if (formElement.validity.valueMissing)
    formElement.setCustomValidity("This field is required.");
  else formElement.setCustomValidity("");
}

/**creates contact, saves it in backend, adds it to the selected assigned to options, adds contact bubble and resets add contact form */
async function addContactWithinTaskForm() {
  const newContact = await createContact();
  sortContacts();
  await setItemInBackend("contactList", JSON.stringify(contactList));
  const assignedtoContactList = document.getElementById("assigned-to-options");
  selectedContactIds.push(newContact.id);
  renderAssignedToContactList(contactList);
  initAssignedToSelectItems(assignedtoContactList);
  document.getElementById("selected-contacts").innerHTML +=
    renderContactBubbleHtml(newContact);
  document.getElementById("overlay-add-contact-form").reset();
}

/** validates add task form and calls custom validations if required */
async function validateAddTaskForm(e) {
  e.preventDefault();
  const form = e.target;
  const formElements = form.querySelectorAll(
    'input:not([type="radio"]):not(.no-validation), textarea, div.custom-validation'
  );
  let formIsValid = validateAddTaskFormElements(formElements);
  if (!formIsValid) form.classList.add("is-validated");
  else await saveTask();
}

/** Loops through all add task form elements and validates them.
 * @param {Array} formElements Form elements for add task form.
 */
function validateAddTaskFormElements(formElements) {
  let formIsValid = true;
  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    if (formElement.classList.contains("custom-validation")) {
      handleCustomValidationForAddTask(formElement);
    }
    if (formElement.id === "prio-inputs") {
      if (!validatePrioInput(formElement)) {
        formIsValid = false;
      }
    } else {
      updateErrorContainer(formElement);
      if (formIsNotValid(formElement)) {
        formIsValid = false;
      }
    }
    if (
      formElement.id === "assigned-to-input" ||
      formElement.id === "category-input"
    ) {
      formElement.readOnly = true;
    }
  }
  return formIsValid;
}

/** calls input-specific validation functions.
 * @param {HTMLElement} formElement Form element to be validated.
 */
function handleCustomValidationForAddTask(formElement) {
  switch (formElement.id) {
    case "assigned-to-input":
      formElement.readOnly = false;
      break;
    case "category-input":
      formElement.readOnly = false;
      validateCategoryInput(formElement);
      break;
    case "due-date-input":
      validateDueDateInput(formElement);
      break;
  }
}

/** validates that category is selected
 * @param {HTMLElement} formElement Category input element.
 */
function validateCategoryInput(formElement) {
  if (formElement.value === "Select task category")
    formElement.setCustomValidity("This field is required.");
  else formElement.setCustomValidity("");
}

/** validates that priority is selected
 * @param {HTMLElement} formElement Prio elements container element.
 */
function validatePrioInput(formElement) {
  const inputs = formElement.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input.checked) {
      document.getElementById(`${formElement.id}-error`).textContent = "";
      return true;
    }
  }
  document.getElementById(`${formElement.id}-error`).textContent =
    "This field is required";
  return false;
}

/** loops through contacts and checks selectedContactIds array to check if the contact is selected. Sets arguments for call of render function for list items.
 * @param {Array} contacts Array of contacts to be rendered.
 */
function renderAssignedToContactList(contacts) {
  const list = document.getElementById("assigned-to-options");
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    let selectedAttrValue = "";
    let checkboxSrc = "./assets/img/checkbox-unchecked.svg";
    const contact = contacts[i];
    if (selectedContactIds.indexOf(contact.id) !== -1) {
      selectedAttrValue = " selected";
      checkboxSrc = "./assets/img/checkbox-checked-white.png";
    }
    html += renderAssignedToContactListItemHtml(
      contact,
      selectedAttrValue,
      checkboxSrc
    );
  }
  list.innerHTML = html;
}

/** filters assigned to contact list based on user input. checks for each name if it starts with user input */
function filterAssignedToContacts() {
  const searchTerm = document
    .getElementById("assigned-to-input")
    .value.toLowerCase();
  const assignedToList = document.getElementById("assigned-to-options");
  const listItems = assignedToList.querySelectorAll("li");
  renderFilteredAssignedToContacts(searchTerm, listItems);
}

/** Shows all contact options when user deletes text from search box.
 * @param {NodeList} listItems li elements to be shown.
 */
function resetFilteredAssignedtoContacts(listItems) {
  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    listItem.style.display = "flex";
  }
}

/** Hides or shows list items based on user input.
 * @param {string} searchTerm String entered by user to filter contact list.
 * @param {NodeList} listItems li elements representing contacts.
 */
function renderFilteredAssignedToContacts(searchTerm, listItems) {
  if (searchTerm === "") resetFilteredAssignedtoContacts(listItems);
  else {
    const results = filterContactListByName(searchTerm);
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      if (results.find((contact) => contact.id === listItem.value))
        listItem.style.display = "flex";
      else listItem.style.display = "none";
    }
  }
}

/** Disable selection of previous dates in datepicker */
// Get the current date in the "YYYY-MM-DD" format
const currentDate = new Date().toISOString().split("T")[0];

// Set the min attribute of the input field to the current date
function setMinDateForPicker() {
  document.getElementById("due-date-input").min = currentDate;
}
