/**calls init functions for form, checkboxes, back navigation and policy checkbox */
function init() {
  initForm();
  initCheckboxes();
  initBackNavigator();
  initPolicyCheckbox(); //MUST be excecuted after initCheckboxes!
}

/**validates all fields are filled out and password entries match each other. */
async function validateSignUpForm(e) {
  const form = e.target;
  e.preventDefault();

  let formIsValid = validateSignUpFormElements(form);
  if (!formIsValid) form.classList.add("is-validated");
  else {
    let newUser = await addUser();
    await newUserToContact(newUser);
    saveContacts();
    showSignUpNotification("notification", "notification-ref");
  }
}

/** Validates all the input elements of the sign up form by looping through every element.
 * @param {HTMLElement} form Form element.
 */
function validateSignUpFormElements(form) {
  const formElements = form.querySelectorAll("input, textarea, select");
  let formIsValid = true;
  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    validateSignUpFormElement(formElement);
    if (formIsNotValid(formElement)) {
      formIsValid = false;
      updateErrorContainer(formElement);
    }
  }
  return formIsValid;
}

/** Condition for the invalid form Element */
function formIsNotValid(formElement) {
  return !formElement.validity.valid;
}

/** Updates the Container with the error message underneath the input field */
function updateErrorContainer(formElement) {
  let errorContainer = document.getElementById(`${formElement.id}-error`);
  errorContainer.textContent = formElement.validationMessage;
}

/** Validates a single element of sign up form.
 * @param {HTMLElement} formElement Input element to be validated.
 */
function validateSignUpFormElement(formElement) {
  if (formElement.id === "confirm-password-input")
    validatePasswordConfirmation(formElement);
  else if (formElement.id === "name-input") validateName(formElement);
  else if (formElement.id === "email-input") validateNewUser(formElement);
  formElement.checkValidity();
}

/** Validates name in sign up form to ensure both first and last name have been entered.
 * @param {HTMLElement} formElement Input element.
 */
function validateName(formElement) {
  if (formElement.value.trim().split(" ").length > 1)
    formElement.setCustomValidity("");
  else formElement.setCustomValidity("Please enter first and last name.");
}

/** Checks if the email is already registered by comparing the input to the mails in the array.
 * @param {HTMLElement} formElement Input element.
 */
function validateNewUser(formElement) {
  const emailInput = document.getElementById("email-input");
  const email = emailInput.value.trim().toLowerCase();
  const isEmailRegistered = userList.some(
    (user) => user.email.toLowerCase() === email
  );
  if (!isEmailRegistered) formElement.setCustomValidity("");
  else
    formElement.setCustomValidity(
      "A user with this email address already exists. Please log in or register with a different email address."
    );
}

/** gets values from add user form and adds a new user to array, then saves array to backend
 * @returns the new USer for further work.
 */
async function addUser() {
  let newUser = {
    name: document.getElementById("name-input").value,
    email: document.getElementById("email-input").value,
    password: document.getElementById("password-input").value, //ja, wir wissen, dass man das in der Praxis nicht so macht =)
    initials: getInitials(document.getElementById("name-input").value),
    id: await getContactID(),
  };
  userList.push(newUser);
  await setItemInBackend("userList", JSON.stringify(userList));
  return newUser;
}

/**
 * Saving the new registered User as Contact for himself.
 * @param {Object} newUser The just registered new User
 */
async function newUserToContact(newUser) {
  let newContact = {
    id: newUser.id,
    startingLetter: getStartingLetter(newUser.name),
    name: newUser.name,
    e_mail: newUser.email,
    phone: " ",
    initials: getInitials(newUser.name),
    color: getColor(),
  };
  contactList.push(newContact);
}

/**called upon successful sign up. triggers notification animation and positions notification right above the form button.
 * @param {string} elementId Notification element id.
 * @param {string} refElementId Reference element id to position the notification vertically.
 */
function showSignUpNotification(elementId, refElementId) {
  let top =
    document.getElementById(refElementId).getBoundingClientRect().top + "px";
  document.documentElement.style.setProperty("--notification-top-target", top);
  document.getElementById(elementId).classList.add("triggered");
  setTimeout(() => (window.location.href = "./login.html"), 800);
}

/**adds function to privacy policy checkbox and disables button */
function initPolicyCheckbox() {
  document
    .getElementById("accept-privacy-policy")
    .addEventListener("click", toggleSignUpBtn);
  document.getElementById("sign-up-btn").disabled = true;
}

/**when the privacy policy checkbox is checked by the user, enables the sign up button */
function toggleSignUpBtn(e) {
  document.getElementById("sign-up-btn").disabled =
    !e.target.classList.contains("checked");
  document
    .getElementById("accept-privacy-policy-hint")
    .classList.toggle("d-none");
}

window.onload = init;
