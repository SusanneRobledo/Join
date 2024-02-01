let ballColorCollection = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];
// If no Color: #D1D1D1

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

  if (activeUser) {
    isUserInContacts(userDiv);
  }

  for (i in contactList) {
    let contact = contactList[i];
    if (contact.id != activeUser.id) {
      createSorter(list, assignedLetter, contact);
      writeContact(list, i, contact);
      assignedLetter = contact.startingLetter;
    } else if (contact.id == activeUser.id) {
      writeContact(userDiv, i, contact);
    }
  }
}

/**
 * On top of the List gets the current user shown as contact. Here the surrounding things get written.
 * Or it will be hidden, if currently a guest is using Join.
 * @param {HTMLElement} userDiv The Element we want to work in
 */
function makeUserDiv(userDiv) {
  if (!activeUser) {
    userDiv.style.display = "none";
  } else {
    userDiv.innerHTML = /*html*/ `
        <figure class="letter_div">YOU</figure>
        <figure class="seperate_div"></figure> 
    `;
  }
}

/**
 * Creating the Alphabetical sorter between the contacts.
 * @param {HTMLElement} list The Element, we want to place the seperator in.
 * @param {String} assignedLetter one Letter- The onne the contacts Name is starting with, and we want to use as seperator
 * @param {Object} contact the Contact, we want to add to the list
 */
function createSorter(list, assignedLetter, contact) {
  if (assignedLetter != contact.startingLetter && contact.id != activeUser.id) {
    list.innerHTML += /*html*/ `
            <figure class="letter_div">${contact.startingLetter}</figure>
            <figure class="seperate_div"></figure>
        `;
  }
}

/**
 * Now the Contact gets written into the place, he belongs to.
 * @param {HTMLElement} place Either the main-list, or the uper place, reserved for the current User.
 * @param {Number} i Number of Contact in the array 'contactList', given by the for-loop .
 * @param {Object} contact the Contact, we want to add to the list.
 */
function writeContact(place, i, contact) {
  place.innerHTML += /*html*/ `
    <span id="contact_div${i}"class="Contact_div d-flex align-items-center" onclick="openContact(${i})">
        <div class="Initiald_svg_div">
            <svg width="50" height="50" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="20" fill="${contact.color}" stroke="white" stroke-width="2" />
                 <text style="font-size: small;" x="12" y="26" fill="white">${contact.initials}</text>
            </svg>
        </div>
        <div class="Name_Mail_div">
            <p>${contact.name}</p>
            <p class="Mail_text">${contact.e_mail}</p>
        </div>
    </span>
`;
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
  stage.innerHTML += /*html*/ `
        <span class="Stage_head d-flex align-items-center">
            <div id="initial_ball_big" class="big_ball d-flex" style="background-color: ${contact.color}">${contact.initials}</div>
            <div id="stage_head_right">
                <t id="contact_name">${contact.name}</t>
                <div id="contacts_stage_workBtn_div"  class=" d-flex">
                    <a href="#" onclick="startEditProcess(${i})" id="edit_contact_btn" class="Contact_stage_btn">
                        <img src="assets/img/contacts_editContact_icon.png" alt="">
                                Edit
                    </a>
                     <a href="#" onclick="startDeleteProcess(${i})" id="delete_contact_btn" class="Contact_stage_btn">
                        <img src="assets/img/contacts_deleteContacts_icon.png" alt="">
                                Delete
                    </a>
                </div>
            </div>
        </span>
        <span class="Contacts_stage_data">
            <p>Contact Information</p>
            <p><b>E-Mail</b></p>
            <p class="Mail_text">${contact.e_mail}</p>
            <p><b>Phone</b></p>
            <p>${contact.phone}</p>
        </span>
    `;
  let bigStage = document.getElementById("contacts_Display_big");
  if (loaded == "mobile") {
    showArrow(bigStage);
  }
  bigStage.style.display = "flex";
  menuFunctions(i);
}

/**Unmarks former marked contact, and marks the contact that was choosen. */
function markContact(i) {
  try {
    let formerChoosen = document.querySelector(".Contact_div_choosen");
    formerChoosen.classList.remove("Contact_div_choosen");
  } catch {}
  let choosen = document.getElementById("contact_div" + i);
  choosen.classList.add("Contact_div_choosen");
}

/**Opening a contact in Stage as overlay.*/
function showArrow(bigStage) {
  bigStage.innerHTML += /*html*/ `<img src="assets/img/arrow_left.png" alt="Back" class="Back_Arrow" onclick="closeContactStage()">`;
}

/**Adds the correct variable for the functions in the small Edit/Delete Menu */
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

/**Closes ostage Overlay and removes back-Arrow Element to avoid infinite stacking */
function closeContactStage() {
  let stage = document.getElementById("contacts_Display_big");
  stage.style.display = "none";

  if (loaded == "mobile") {
    var arrow = document.querySelector(".Back_Arrow");
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
  let processH1 = document.getElementById("cProcess_h1");
  let processP = document.getElementById("cProcess_p");
  let nameField = document.getElementById("name-input");
  let emailField = document.getElementById("email-input");
  let phoneField = document.getElementById("phone-input");
  let contactBal = document.getElementById("cProcess_ball");
  let cancelBtn = document.getElementById("contacts_form_cancel_btn");
  let submitBtn = document.getElementById("contacts_form_submit_btn");
  let form = document.getElementById("mainForm");

  if (contact) {
    processH1.innerHTML = `Edit contact`;
    processP.style.display = "none";
    nameField.value = contact.name;
    emailField.value = contact.e_mail;
    phoneField.value = contact.phone;
    contactBal.style.backgroundColor = contact.color;
    contactBal.innerHTML = contact.initials;
    cancelBtn.onclick = function (event) {
      event.preventDefault(), startDeleteProcess(i);
    };
    cancelBtn.innerHTML = `Delete`;
    submitBtn.innerHTML = /*html*/ `Save changes
         <img src="assets/img/check.png" alt="">`;

    form.onsubmit = function () {
      editContactProcess(i);
    };
  } else {
    processH1.innerHTML = `Add Contact`;
    processP.style.display = "block";
    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";
    contactBal.style.backgroundColor = "#D1D1D1";
    contactBal.innerHTML = /*html*/ `<img id="cProcess_img" src="assets/img/contacts_emptyC_icon.png" alt="">`;
    cancelBtn.onclick = function () {
      closeContactProcess("overProcess_div");
    };
    cancelBtn.innerHTML = /*html*/ `Cancel  <img src="assets/img/cancel_icon_black.png" alt="">`;
    submitBtn.innerHTML = /*html*/ `Add Contact
         <img src="assets/img/check.png" alt="">`;

    form.onsubmit = function () {
      startContactCreation();
    };
  }
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
}

/** Checks, if the contact is the user,
 * Showing an alert over a shader, before final deleting.
 */
function startDeleteProcess(i) {
  activateShader();

  if (contactList[i].id == activeUser.id) {
    showBlockAlert();
  } else {
    showConfirmAlert(i);
  }
}

function showBlockAlert() {
  let deleteAlert = document.getElementById("delete_question");

  deleteAlert.innerHTML = /*html*/ `
        <div class="align-items-center">
            <p>You can not delete yourself!</p>
            <div id="" class="delete_btn_div">
                <button class="btn btn-secondary" onclick="closeContactProcess('delete_question')">Cancel</button>
            </div>
        </div>
    `;
  deleteAlert.style.display = "block";
}

/**Fills the delete-confirm-alert with information and functions. */
function showConfirmAlert(i) {
  let deleteAlert = document.getElementById("delete_question");

  deleteAlert.innerHTML = /*html*/ `
        <div class="align-items-center">
            <p>Do you really want to delete <br><j id="show_deleting_name">${contactList[i].name}</j>?</p>
            <div id="" class="delete_btn_div">
                <button class="btn btn-secondary" onclick="closeContactProcess('delete_question')">Cancel</button>
                <button id='deleteBtn' onclick="deleteContact(${i}), closeContactProcess('delete_question'), closeContactStage()" class="btn btn-primary">Confirm</button>
            </div>
        </div>
    `;
  deleteAlert.style.display = "block";
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

/**Counts ID's in backend, and returns one for the new contact. */
async function getContactID() {
  let id = await getItemFromBackend("contactIDcounter");
  let newID = Number(id) + 1;
  await setItemInBackend("contactIDcounter", newID);
  return newID;
}

/**
 * Picks a random color for the new contact
 */
function getColor() {
  let random = Math.floor(Math.random() * 15);
  return ballColorCollection[random];
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
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
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
  for (i in contactList) {
    if (contactList[i].id === activeUser.id) {
      userFound = true;
      break;
    }
  }
  if (!userFound && activeUser) {
    createUserContact();
  }
}

/**
 * This function is just here, because its a project, used for showing different people.
 * If somebody deletes a Contact, wich also is a user, then we need to re-create this contact.
 */
function createUserContact() {
  let newContact = {
    id: activeUser.id,
    startingLetter: getStartingLetter(activeUser.name),
    name: activeUser.name,
    e_mail: activeUser.email,
    phone: " ",
    initials: getInitials(activeUser.name),
    color: getColor(),
  };
  contactList.push(newContact);
  saveContacts();
}
