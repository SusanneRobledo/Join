/**
 * On top of the List gets the current user shown as contact. Here the surrounding things get written.
 * Or it will be hidden, if currently a guest is using Join.
 * @param {HTMLElement} userDiv The Element we want to work in
 */
function makeUserDiv(userDiv) {
  if (!registeredUser) userDiv.style.display = "none";
  else {
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
  if (newAlphabeticalContact(assignedLetter, contact)) {
    list.innerHTML += /*html*/ `
              <figure class="letter_div">${contact.startingLetter}</figure>
              <figure class="seperate_div"></figure>
          `;
  }
}

function newAlphabeticalContact(assignedLetter, contact) {
  return (
    assignedLetter != contact.startingLetter && contact.id != registeredUser.id
  );
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

function renderContactDisplayHTML(i, contact) {
  return /*html*/ `
    <span class="Stage_head d-flex align-items-center">
        <div id="initial_ball_big" class="big_ball d-flex" style="background-color: ${contact.color}">${contact.initials}</div>
        <div id="stage_head_right">
            <div id="contact_name">${contact.name}</div>
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
  deleteAlert.style.display = "flex";
}

/**Fills the delete-confirm-alert with information and functions. */
function showConfirmAlert(i) {
  let deleteAlert = document.getElementById("delete_question");

  deleteAlert.innerHTML = /*html*/ `
          <div class="align-items-center">
              <p>Do you really want to delete</p><div class="delete_name_wrapper"><div id="show_deleting_name">${contactList[i].name}</div><div>?</div></div>
              <div class="delete_btn_div">
                  <button class="btn btn-secondary" onclick="closeContactProcess('delete_question')">Cancel</button>
                  <button id='deleteBtn' onclick="deleteContact(${i}), closeContactProcess('delete_question'), closeContactStage()" class="btn btn-primary">Confirm</button>
              </div>
          </div>
      `;
  deleteAlert.style.display = "flex";
}
