/**calls init functions for form, checkboxes and back navigation icon */
function init() {
    initForm();
    initCheckboxes();
    initBackNavigator();
}

/**validates that both password fields are filled out and have the same value */
function validateResetPasswordForm(e) {
    e.preventDefault();
    const form = e.target;
    let formIsValid = true;
    const formElements = form.querySelectorAll('input, textarea, select');
    for (let i = 0; i < formElements.length; i++) {
        const formElement = formElements[i];
        if (formElement.id === 'confirm-password-input') {
            validatePasswordConfirmation(formElement);
        }
        formElement.checkValidity();
        if (!formElement.validity.valid) {
            formIsValid = false;
        }
        document.getElementById(`${formElement.id}-error`).textContent = formElement.validationMessage;
    }
    if (!formIsValid) {
        form.classList.add('is-validated');
    } else { showNotification('notification', "/Join/login.html"); }
}

window.onload = init;