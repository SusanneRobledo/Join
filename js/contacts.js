let processH1;
let processP;
let nameField;
let emailField;
let phoneField;
let contactBal;
let cancelBtn;
let submitBtn;

/**
 * Creates the visible contact list out of the backend Data.
 */
async function showContacts() {
  contactList = await getItemFromBackend("contactList");

  let list = document.getElementById("ListDiv");
  list.innerHTML = "";
  let userDiv = document.getElementById("userDiv");
  makeUserDiv(userDiv);
  let assignedLetter = "";

  if (registeredUser) isUserInContacts(userDiv);

  for (let i in contactList) {
    let contact = contactList[i];
    if (contact.id != registeredUser.id) {
      createSorter(list, assignedLetter, contact);
      writeContact(list, i, contact);
      assignedLetter = contact.startingLetter;
    } else if (contact.id == registeredUser.id) {
      writeContact(userDiv, i, contact);
    }
  }
}

/**sets shader */
function activateShader() {
  let shader = document.getElementById("shader_div");
  shader.style.display = "flex";
}

/**disables shader */
function deactivateShader(wichShader) {
  if (wichShader) {
    let shader = document.getElementById(wichShader);
    shader.style.display = "none";
  } else {
    let shader = document.getElementById("shader_div");
    shader.style.display = "none";
  }
}

/**
 * Opens Div to add new Contact
 */
function startAddContact() {
  prepareContactProcessDiv(false, false);
  clearInputFields();
  activateShader();
  showWorkDiv();
}

/**Opening the process div, to edit or add a contact */
function showWorkDiv() {
  let workDiv = document.getElementById("overProcess_div");
  workDiv.style.display = "flex";
}

/**
 * Shows the choosen Contact at the side of the screen (Mobile: New Screen)
 * @param {Number} i - Index in the contactList - JSON-Array
 */
function openContact(i) {
  if (loaded == "desktop") {
    markContact(i);
  }
  let contact = contactList[i];
  let stage = document.getElementById("contacts_stage");
  stage.innerHTML = "";
  stage.innerHTML += renderContactDisplayHTML(i, contact);
  let bigStage = document.getElementById("contacts_Display_big");
  if (loaded == "mobile") {
    showArrow(bigStage);
  }
  bigStage.style.display = "flex";
  menuFunctions(i);
}

/** Unmarks former marked contact, and marks the contact that was choosen. */
function markContact(i) {
  let formerChoosen = document.querySelector(".Contact_div_choosen");
  if (formerChoosen != null)
    formerChoosen.classList.remove("Contact_div_choosen");
  let choosen = document.getElementById("contact_div" + i);
  if (choosen != null) choosen.classList.add("Contact_div_choosen");
}

/** Opening a contact in Stage as overlay.*/
function showArrow(bigStage) {
  bigStage.innerHTML += /*html*/ `<img src="assets/img/arrow_left.png" alt="Back" class="Back_Arrow" onclick="closeContactStage()">`;
}

/** Adds the correct variable for the functions in the small Edit/Delete Menu */
function menuFunctions(i) {
  let editButton = document.getElementById("mob_cont_menu_Edit");
  editButton.onclick = function () {
    startEditProcess(i), closeMobCombMenu();
  };

  let deleteButton = document.getElementById("mob_cont_menu_Delete");
  deleteButton.onclick = function () {
    startDeleteProcess(i), closeMobCombMenu();
  };
}

/** Closes ostage Overlay and removes back-Arrow Element to avoid infinite stacking */
function closeContactStage() {
  let stage = document.getElementById("contacts_Display_big");
  stage.style.display = "none";

  if (loaded == "mobile") {
    let arrow = document.querySelector(".Back_Arrow");
    arrow.parentNode.removeChild(arrow);
  }
}

/**
 * Opens window to edit a contact
 * @param {Number} i - Index in contactList-JSON Array
 */
function startEditProcess(i) {
  let contact = contactList[i];
  prepareContactProcessDiv(contact, i);
  activateShader();
  showWorkDiv();
  openContact(i);
}

/**
 * Writing Contact Data into fields, getting ready to edit the contact, 
 * or deleting them, preparing for adding a new contact

 * @param {object} contact - an Element out of contactList. If a new contact has to be added, it will be false.
 * @param {Number} i - Index of contact within contactList. If a new contact has to be added, it will be false.
 */
function prepareContactProcessDiv(contact, i) {
  processH1 = document.getElementById("cProcess_h1");
  processP = document.getElementById("cProcess_p");
  nameField = document.getElementById("name-input");
  emailField = document.getElementById("email-input");
  phoneField = document.getElementById("phone-input");
  contactBal = document.getElementById("cProcess_ball");
  cancelBtn = document.getElementById("contacts_form_cancel_btn");
  submitBtn = document.getElementById("contacts_form_submit_btn");
  form = document.getElementById("mainForm");
  if (contact) {
    renderEditContactPopUp(contact, i);
    form.onsubmit = () => editContactProcess(i);
  } else {
    renderAddContactPopUp();
    form.onsubmit = () => startContactCreation();
  }
}

/**
 * Renders the Edit Contact HTML for the Pop Up Window
 * @returns edit contact html elements
 */
function renderEditContactPopUp(contact, i) {
  processH1.innerHTML = "Edit contact";
  processP.style.display = "none";
  nameField.value = contact.name;
  emailField.value = contact.e_mail;
  phoneField.value = contact.phone;
  contactBal.style.backgroundColor = contact.color;
  contactBal.innerHTML = contact.initials;
  (cancelBtn.onclick = (e) => {
    e.preventDefault(), startDeleteProcess(i);
  }),
    (cancelBtn.innerHTML = "Delete");
  submitBtn.innerHTML = "Save changes<img src='assets/img/check.png' alt=''>";
}

function renderAddContactPopUp() {
  processH1.innerHTML = "Add Contact";
  processP.style.display = "block";
  nameField.value = "";
  emailField.value = "";
  phoneField.value = "";
  contactBal.style.backgroundColor = "#D1D1D1";
  contactBal.innerHTML =
    '<img id="cProcess_img" src="assets/img/contacts_emptyC_icon.png" alt="">';
  cancelBtn.onclick = () => closeContactProcess("overProcess_div");
  cancelBtn.innerHTML =
    'Cancel  <img src="assets/img/cancel_icon_black.png" alt="">';
  submitBtn.innerHTML = 'Add Contact<img src="assets/img/check.png" alt="">';
}

/**
 * Editing the contact, saving the list, clearing files and close the PopUp
 * @param {Number} i - Index of contact within contactList.
 */
function editContactProcess(i) {
  editContact(i);
  saveContacts();
  clearInputFields();
  closeContactProcess("overProcess_div");
}

/**Here the old contact gets overwritten */
function editContact(i) {
  let contact = contactList[i];

  contact.startingLetter = getStartingLetter(
    document.getElementById("name-input").value
  );
  contact.name = document.getElementById("name-input").value;
  contact.e_mail = document.getElementById("email-input").value;
  contact.phone = document.getElementById("phone-input").value;
  contact.initials = getInitials(document.getElementById("name-input").value);
  openContact(i);
}

/** Checks, if the contact is the user,
 * Showing an alert over a shader, before final deleting.
 */
function startDeleteProcess(i) {
  activateShader();
  if (contactList[i].id == registeredUser.id) showBlockAlert();
  else showConfirmAlert(i);
}

/**
 * Deletes choosen Contact
 * @param {Number} i - Index in contactList-JSON Array
 */
function deleteContact(i) {
  contactList.splice(i, 1);
  deactivateShader();
  saveContacts();
  cleanupMess();
}

/** After deleting a contact, unused html text gets removed. */
function cleanupMess() {
  let deleteAlert = document.getElementById("delete_question");
  deleteAlert.innerHTML = "";
  deleteAlert.style.display = "none";

  let stage = document.getElementById("contacts_stage");
  stage.innerHTML = "";
}

/**
 * Just closes divs, but doesnt delete Data
 * @param {String} wichDiv - ID of the div, that has to be closed.
 */
function closeContactProcess(wichDiv, wichshader) {
  deactivateShader(wichshader);
  let workDiv = document.getElementById(wichDiv);
  workDiv.style.display = "none";
}

/**
 * Deletes input and then calls a function to close the open windows.
 * @param {String} wichDiv -  ID of the div, that has to be closed.
 */
function clearInputFields() {
  let nameInput = document.getElementById("name-input");
  let emailInput = document.getElementById("email-input");
  let phoneInput = document.getElementById("phone-input");

  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
}

/**Organizing Contact creation on contacts Side */
async function startContactCreation() {
  await createContact();
  saveContacts();
  clearInputFields();
  closeContactProcess("overProcess_div");
}

/**
 * Creates new contact for contactList
 * @returns the new Contact for further work.
 */
async function createContact() {
  let newContact = {
    id: await getContactID(),
    startingLetter: getStartingLetter(
      document.getElementById("name-input").value
    ),
    name: document.getElementById("name-input").value,
    e_mail: document.getElementById("email-input").value,
    phone: document.getElementById("phone-input").value,
    initials: getInitials(document.getElementById("name-input").value),
    color: getColor(),
  };
  contactList.push(newContact);
  return newContact;
}

/**
 * Sotzs, saves and shows contactList. Gets called after change in contactsList
 */
async function saveContacts() {
  sortContacts();
  await setItemInBackend("contactList", contactList);
  showContacts();
}

/**
 * Sorts the contact List in alphabetical order
 */
function sortContacts() {
  contactList.sort(function (a, b) {
    return a["name"].localeCompare(b["name"]);
  });
}

/**
 * Checks, if the Phone NUmber is an actual number, or wont allow it as part of the Phone Number.
 * @param {object} evt -Typed Key at the "Phone Number" field.
 * @returns true, if the typed Key was a Numbers Key, or false, if not.
 */
function isNumberKey(evt) {
  let charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

/**In addition to flying in the small menu, also creates a div arround the mobile window to colose the menu. */
function openMobCombiMenu() {
  flyInMenu("mobile_contacts_menu");
  let blockDiv = document.getElementById("BlockDiv");
  blockDiv.style.display = "block";
}

/**Closing menu and deactivating a shader behind it. */
function closeMobCombMenu() {
  flyInMenu("mobile_contacts_menu");
  deactivateShader("BlockDiv");
}

/**
 * This check only exists, because other users may delete a Contact, ich is actually a user.
 * It checks, if the User is inside the contactList as well, so it can be shown. Otherwise it will start the Creation of the User-Contact.
 */
function isUserInContacts() {
  let userFound = false;
  for (let i in contactList) {
    if (contactList[i].id === registeredUser.id) {
      userFound = true;
      break;
    }
  }
  if (!userFound && registeredUser) createUserContact();
}

/**
 * This function is just here, because its a project, used for showing different people.
 * If somebody deletes a Contact, wich also is a user, then we need to re-create this contact.
 */
function createUserContact() {
  let newContact = {
    id: registeredUser.id,
    startingLetter: getStartingLetter(registeredUser.name),
    name: registeredUser.name,
    e_mail: registeredUser.email,
    phone: " ",
    initials: getInitials(registeredUser.name),
    color: getColor(),
  };
  contactList.push(newContact);
  saveContacts();
}
