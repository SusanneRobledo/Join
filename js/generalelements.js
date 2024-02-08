/**adds functions for toggling the (un)checked checkbox icons and hover effect */
function initCheckboxes() {
  const checkboxes = document.getElementsByClassName("checkbox");
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    checkbox.addEventListener("click", toggleCheckbox);
    checkbox.addEventListener("mouseover", toggleCheckboxHover);
    checkbox.addEventListener("mouseout", toggleCheckboxHover);
  }
}

/**adds hover effect to back icon */
function initBackNavigator() {
  const backNavigator = document.getElementById("back-navigation-img");
  if (!backNavigator) return;
  backNavigator.addEventListener("mouseover", toggleBackIconOnHover);
  backNavigator.addEventListener("mouseout", toggleBackIconOnHover);
}

/**changes back icon on hover */
function toggleBackIconOnHover(ev) {
  if (ev.type === "mouseover") this.src = "./assets/img/arrow-left-hover.png";
  else this.src = "./assets/img/arrow-left-line.png";
}

/**changes checkbox icon on hover */
function toggleCheckboxHover(ev) {
  if (ev.type === "mouseover") {
    if (this.classList.contains("checked"))
      this.src = "./assets/img/checkbox-checked-hover.png";
    else this.src = "./assets/img/checkbox-unchecked-hover.png";
  } else {
    if (this.classList.contains("checked"))
      this.src = "./assets/img/checkbox-checked.svg";
    else this.src = "./assets/img/checkbox-unchecked.svg";
  }
}

/**Toggle checkbox: changes src attribute of checkbox img based on the checked class attribute and toggles the checked class attribute. */
function toggleCheckbox() {
  const checkboxEl = this;
  if (checkboxEl.classList.contains("checked"))
    checkboxEl.src = "./assets/img/checkbox-unchecked.svg";
  else checkboxEl.src = "./assets/img/checkbox-checked.svg";
  checkboxEl.classList.toggle("checked");
}

/**
 * Creates the balls, in wich the contact initials are shwon.
 * @param {Object} contact Contact out of the ContactList
 * @returns
 */
function renderContactBubbleHtml(contact) {
  return /*html*/ `<svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="contact-bubble-${contact.id}"
  >
    <circle
      cx="21"
      cy="21"
      r="20"
      fill="${contact.color}"
      stroke="white"
      stroke-width="2"
    />
    <text
      x="21"
      y="21"
      alignment-baseline="central"
      text-anchor="middle"
      fill="white"
    >
    ${contact.initials}
    </text>
  </svg>`;
}

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
