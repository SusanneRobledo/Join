/** prevents live validation of form and adds appropriate validation function to submit event of the form. adds icon change function to password inputs */
function initForm() {
  const forms = document.forms;
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    form.noValidate = true;
    let validationFunction = setValidationFunction(form);
    form.addEventListener("submit", validationFunction);
    const passwordInputs = form.querySelectorAll(
      `[type="password"]:has(+ img)`
    );
    for (let i = 0; i < passwordInputs.length; i++) {
      const passwordInput = passwordInputs[i];
      passwordInput.addEventListener("focus", togglePasswordIcon);
      passwordInput.addEventListener("blur", togglePasswordIcon);
    }
  }
}

/** Sets validation function for form.
 * @param {HTMLElement} form Form element for which validation function needs to be set.
 */
function setValidationFunction(form) {
  switch (form.id) {
    case "login-form":
      return validateLoginForm;
    case "signup-form":
      return validateSignUpForm;
    case "resetpassword-form":
      return validateResetPasswordForm;
    case "addtask-form":
      return validateAddTaskForm;
    case "overlay-add-contact-form":
      return validateOverlayAddcontactForm;
    default:
      return validateStandardForm;
  }
}

/** loops through user inputs and checks standard validation. If not successful, error messages are displayed. */
function validateStandardForm(e) {
  const form = e.target;
  let formIsValid = true;
  const formElements = form.querySelectorAll("input, textarea, select");
  for (let i = 0; i < formElements.length; i++) {
    const formElement = formElements[i];
    formElement.checkValidity();
    if (!formElement.validity.valid) {
      formIsValid = false;
    }
    document.getElementById(`${formElement.id}-error`).textContent =
      formElement.validationMessage;
  }
  e.preventDefault();
  if (!formIsValid) {
    form.classList.add("is-validated");
  } else {
    showNotification("notification", form.action);
  }
}

/** validates that entered password is correct for the selected user email
 * @param {HTMLElement} formElement Active form element.
 * @param {string} email Email of user whose password needs to be validated.
 */
function validatePassword(formElement, email) {
  if (formElement.value !== getUserByEmail(email).password) {
    formElement.setCustomValidity("Wrong password. Ups! Try again.");
  } else {
    formElement.setCustomValidity("");
  }
}

/** validates that entered passwords in both password inputs match.
 * @param {HTMLElement} formElement Form element to be validated.
 */
function validatePasswordConfirmation(formElement) {
  const password1 = document.getElementById("password-input").value;
  const password2 = document.getElementById("confirm-password-input").value;
  if (password1 !== password2) {
    formElement.setCustomValidity("Your passwords don't match. Try again.");
  } else {
    formElement.setCustomValidity("");
  }
}

/** toggles password icons. Upon focus, it changes from lock to crossed eye. Click on eye symbol toggles between crossed out and not crossed out */
function togglePasswordIcon(e) {
  const inputEl = this;
  const iconEl = inputEl.nextElementSibling;
  if (e.type === "focus" && inputEl.value === "") {
    iconEl.addEventListener("click", togglePasswordVisibility);
    iconEl.classList.toggle("cursor-pointer");
    if (inputEl.type === "password") {
      iconEl.src = "./assets/img/visibility_off.png";
    } else {
      iconEl.src = "./assets/img/visibility.png";
    }
  } else if (e.type === "blur" && this.value === "") {
    iconEl.src = "./assets/img/lock.png";
    iconEl.removeEventListener("click", togglePasswordVisibility);
    iconEl.classList.toggle("cursor-pointer");
  }
}

/** in addition to togglePasswordIcon function, this changes the input type between text and password to show/hide the entered password */
function togglePasswordVisibility() {
  const iconEl = this;
  const inputEl = iconEl.previousElementSibling;
  if (inputEl.type === "password") {
    inputEl.type = "text";
    iconEl.src = "./assets/img/visibility.png";
  } else {
    inputEl.type = "password";
    iconEl.src = "./assets/img/visibility_off.png";
  }
}
