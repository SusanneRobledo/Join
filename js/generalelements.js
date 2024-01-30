/**adds functions for toggling the (un)checked checkbox icons and hover effect */
function initCheckboxes() {
    const checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        checkbox.addEventListener('click', toggleCheckbox);
        checkbox.addEventListener('mouseover', toggleCheckboxHover);
        checkbox.addEventListener('mouseout', toggleCheckboxHover);
    }
}

/**adds hover effect to back icon */
function initBackNavigator() {
    const backNavigator = document.getElementById('back-navigation-img');
    if (!backNavigator) { return; }
    backNavigator.addEventListener('mouseover', toggleBackIconOnHover);
    backNavigator.addEventListener('mouseout', toggleBackIconOnHover);
}

/**changes back icon on hover */
function toggleBackIconOnHover(ev) {
    if (ev.type === 'mouseover') {
        this.src = './assets/img/arrow-left-hover.png';
    } else {
        this.src = './assets/img/arrow-left-line.png';
    }
}

/**changes checkbox icon on hover */
function toggleCheckboxHover(ev) {
    if (ev.type === 'mouseover') {
        if (this.classList.contains('checked')) {
            this.src = './assets/img/checkbox-checked-hover.png';
        } else {
            this.src = './assets/img/checkbox-unchecked-hover.png';
        }
    } else {
        if (this.classList.contains('checked')) {
            this.src = './assets/img/checkbox-checked.svg';
        } else {
            this.src = './assets/img/checkbox-unchecked.svg';
        }
    }
}

/**Toggle checkbox: changes src attribute of checkbox img based on the checked class attribute and toggles the checked class attribute. */
function toggleCheckbox() {
    const checkboxEl = this;
    if (checkboxEl.classList.contains('checked')) {
        checkboxEl.src = './assets/img/checkbox-unchecked.svg';
    } else {
        checkboxEl.src = './assets/img/checkbox-checked.svg';
    }
    checkboxEl.classList.toggle('checked');
}