const headerEl = document.getElementById("header");

/**calls animation and init functions and gets data from backend */
function init() {
  handleStartAnimation();
  setMobileGreetingStatus();
  initForm();
  initCheckboxes();
  initBackNavigator();
  initGuestLoginBtn();
  getStoredUserData();
}

/**adds function to guest login btn to save status to session storage */
function initGuestLoginBtn() {
  document
    .getElementById("guest-login-btn")
    .addEventListener("click", () =>
      sessionStorage.setItem("loggedIn", "true")
    );
}

/**sets login form fields if remember me checkox was checked last time */
function getStoredUserData() {
  if (loginData) {
    document.getElementById("email-input").value = loginData.email;
    document.getElementById("password-input").value = loginData.password;
    document.getElementById("remember-me").click();
  }
}

/**checks if user exists. if yes, it checks the entered password against the stored password */
function validateLoginForm(e) {
  e.preventDefault();
  const form = e.target;
  let formIsValid = true;
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const user = getUserByEmail(emailInput.value);
  if (!user) {
    passwordInput.setCustomValidity("Email and/or password are incorrect.");
    formIsValid = false;
  } else {
    validatePassword(passwordInput, emailInput.value);
    passwordInput.checkValidity();
    if (!passwordInput.validity.valid) {
      formIsValid = false;
    }
  }
  document.getElementById(`${passwordInput.id}-error`).textContent =
    passwordInput.validationMessage;
  if (!formIsValid) {
    form.classList.add("is-validated");
  } else {
    proceedLogin(user);
  }
}

/**called upon successful login validation.
 * If remember me checkbox is checked, current user data is written into local storage, otherwise to session storage.
 * In both cases, registeredUser is set in session storage.
 * @param {object} user Data of user that is logging in. */
function proceedLogin(user) {
  if (document.getElementById("remember-me").classList.contains("checked")) {
    localStorage.setItem("loggedIn", JSON.stringify(true));
    localStorage.setItem("loginData", JSON.stringify(user));
  } else {
    sessionStorage.setItem("loggedIn", JSON.stringify(true));
    localStorage.setItem("loginData", "");
    localStorage.setItem("loggedIn", "false");
  }
  sessionStorage.setItem("registeredUser", JSON.stringify(user));
  window.location.href = "./summary.html";
}

/**validates if entered email address exists in users list.
 * @param {HTMLElement} formElement Input element to validate.
 */
function validateLoginEmailInput(formElement) {
  if (getUserByEmail(formElement.value)) {
    formElement.setCustomValidity("");
  } else {
    formElement.setCustomValidity(
      "This combination of user and password does not exist."
    );
  }
}

window.onload = init;
