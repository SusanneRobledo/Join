/**renders one subtask list item
 * @param {object} subtask The subtask object to render.
 * @param {number} index Index of subtask to render in subtask array.
 */
function renderNewListItemHtml(subtask, index) {
    let html;
    html = '<li class="subtask">';
    html += renderListItemHtml(subtask, index);
    html += "</li>";
    return html;
  }
  
  /**renders innerHtml of one subtask list item
   * @param {object} subtask The subtask object to render.
   * @param {number} index Index of subtask to render in subtask array.
   */
  function renderListItemHtml(subtask, index) {
    return /*html*/ `
      <img src="./assets/img/bullet.png" class='bullet-icon'><input type="text" ondblclick="editSubtask(${index})" class="no-validation" readonly value="${subtask}"/>
      <div class="subtask-read-icons subtask-icons d-none align-items-center"><img src="./assets/img/pencil.png" class='edit-subtask-icon input-icon cursor-pointer' onclick="editSubtask(${index})"/><img
        src="./assets/img/subtask-separator.png"
      /><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/></div>
      <div class="subtask-edit-icons subtask-icons"><img src="./assets/img/trash-bin.png" class="input-icon cursor-pointer" onclick="deleteSubtask(${index})"/><img
        src="./assets/img/subtask-separator.png"
      /><img src="./assets/img/subtask-save.png" class="input-icon cursor-pointer" onclick="updateSubtask(${index})"/></div>`;
  }

  /**renders assigned to contact list item depending on whether that contact is currently selected
 * @param {object} contact Contact record to be rendered.
 * @param {string} selectedAttrValue Value to be added to classList of rendered element. Indicates if contact is currently selected.
 * @param {string} checkboxSrc Value for checkbox image src attribute to show appropriate checked or unchecked checkbox img.
 */
function renderAssignedToContactListItemHtml(
    contact,
    selectedAttrValue,
    checkboxSrc
  ) {
    let html = "";
    html = /*html*/ `<li class="assign-to-li${selectedAttrValue}" value="${contact.id}">`;
    html += renderContactBubbleHtml(contact);
    html += /*html*/ `<span class="assign-to-li-name">${contact.name}</span>
          <img src=${checkboxSrc} /></li>`;
    return html;
  }