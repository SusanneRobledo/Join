/**Searches through all Tasks if one may be the one, were looking for. */
function searchTask() {
  let term = document.getElementById("findTask").value;
  term = term.toLowerCase();
  let foundTasks = [];

  for (i in taskList) {
    let taskTitle = taskList[i].title.toLowerCase();
    let taskDesc = taskList[i].description.toLowerCase();
    if (taskTitle.includes(term) || taskDesc.includes(term))
      foundTasks.push(taskList[i].id);
  }
  hideNotSearchedTasks(foundTasks);
}

/**
 * Hides tasks, the user doesn't look for by checking, if the id of a task is inside of the foundTasks - Array.
 * @param {Array} foundTasks collection of ID´s from those Tasks, wich involve things, the user is looking for.
 */
function hideNotSearchedTasks(foundTasks) {
  for (task of taskList) {
    if (foundTasks.indexOf(task.id) + 1)
      //+1 because if the index is 0, it will be handled as 'false'!
      document.getElementById(task.id).style.display = "flex";
    else document.getElementById(task.id).style.display = "none";
  }
}
