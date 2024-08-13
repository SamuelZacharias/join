/**
 * An array to store task objects.
 * @type {Array<Object>}
 */
const tasks = [];

/**
 * An array to store contact objects.
 * @type {Array<Object>}
 */
const contacts = [];

/**
 * An array to store selected contacts.
 * @type {Array<Object>}
 */
let selectedContacts = [];

/**
 * An array to store information for the task board.
 * @type {Array<Object>}
 */
let addTaskBoardInfos = [];

/**
 * A reference to the currently active button.
 * @type {HTMLElement|null}
 */
let activeButton = null;

/**
 * A counter to track the number of clicks for certain UI interactions.
 * @type {number}
 */
let clickCount = 0;

/**
 * A flag to check if a category has been chosen.
 * @type {boolean}
 */
let choosenCategory = false;

/**
 * An array of predefined categories.
 * @type {Array<string>}
 */
let category = ["User Story", "Technical task"];

/**
 * A reference to the column where a task will be added.
 * @type {string|null}
 */
let addTaskColumn = null;

/**
 * Loads tasks and contacts from local storage, updating the `tasks` and `contacts` arrays.
 */
function loadTasksFromLocalStorage() {
  const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const validTasks = savedTasks.filter(task => task !== null);
  tasks.length = 0;
  tasks.push(...validTasks);
  contacts.length = 0;
  contacts.push(...savedContacts);
}

/**
 * Filters tasks based on the search input, matching against task titles and descriptions.
 */
function filterTasks() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const searchMobileInput = document.getElementById('searchMobile').value.toLowerCase();
  const searchTerm = searchInput || searchMobileInput;
  
  const filteredTasks = tasks.filter(task => {
      return task.title.toLowerCase().includes(searchTerm) || task.description.toLowerCase().includes(searchTerm);
  });
  
  renderFilteredTasks(filteredTasks);
}

/**
 * Renders tasks that match the search criteria.
 *
 * @param {Array<Object>} filteredTasks - An array of tasks that match the search criteria.
 */
function renderFilteredTasks(filteredTasks) {
  renderTasks(filteredTasks);
}

/**
 * Closes the currently opened task view or edit form.
 */
function closeOpenedTask() {
  document.getElementById(`openedTaskContainer`).classList.add(`d-none`);
  document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer');
  document.getElementById(`editTaskContainer`).classList.add(`d-none`);
  document.getElementById('editTaskContainer').classList.remove('openedTaskContainer');
}

/**
 * Handles clicks outside the opened task or edit containers, closing them if necessary.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleClickOutsideEdit(event) {
  const container = document.getElementById('openedTaskContainer');
  if (container.contains(event.target)) {
    document.getElementById('openedTaskContainer').classList.add('d-none');
    container.classList.remove('openedTaskContainer');
  }
  const containerEdit = document.getElementById('editTaskContainer');
  if (containerEdit.contains(event.target)) {
    document.getElementById('editTaskContainer').classList.add('d-none');
    containerEdit.classList.remove('openedTaskContainer');
  }
}

/**
 * Opens the 'Add Task' form for a specific column on the board.
 *
 * @param {string} columnType - The type of column where the task will be added.
 */
function openBoardAddTask(columnType) {
  let addTaskContainer = document.getElementById('addTaskContainer');
  addTaskContainer.classList.remove('d-none');
  renderAddTaskBoardHtml(addTaskContainer);
  document.getElementById('boardAddTask').classList.add('slide-in');
  handleClick(5);
  addTaskColumn = columnType;
  setMinDate();
}

/**
 * Closes the 'Add Task' form with an animation.
 */
function closeAddTaskBoard() {
  const taskContainer = document.getElementById('addTaskContainer');
  if (!taskContainer) {
    return;
  }
  showSuccessMessageAddTask();
  taskContainer.classList.add('slideOut');
  setTimeout(() => {
    taskContainer.classList.add('d-none');
    taskContainer.classList.remove('slideOut');
  }, 1000);
}

/**
 * Closes the 'Add Task' form immediately when the close (X) button is clicked.
 */
function closeAddTaskBoardOnX() {
  const taskContainer = document.getElementById('addTaskContainer');
  taskContainer.classList.add('d-none');
  clearForm();
}

/**
 * Resets the dropdown icons for the category selector.
 */
function resetDropDownIconsCategory() {
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg');
}

/**
 * Opens the mobile drag menu for a task and handles clicks outside the menu to close it.
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function openDragMobile(i) {
  let dragMobileContainer = document.getElementById(`dragMobileContainer${i}`);
  
  // Show the container
  dragMobileContainer.classList.remove('d-none');

  // Function to hide the container if clicked outside
  function handleClickOutsideOpenDragMobile(event) {
      if (!dragMobileContainer.contains(event.target)) {
          dragMobileContainer.classList.add('d-none');
          document.removeEventListener('click', handleClickOutsideOpenDragMobile);
      }
  }
  document.addEventListener('click', handleClickOutsideOpenDragMobile);
}

/**
 * Moves a task to the "To Do" column and updates the task data.
 *
 * @async
 * @param {number} i - The index of the task in the tasks array.
 */
async function changeColumnToDo(i) {
  let taskcard = tasks[i];
  taskcard.column = "toDo";
  await updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Moves a task to the "In Progress" column and updates the task data.
 *
 * @async
 * @param {number} i - The index of the task in the tasks array.
 */
async function changeColumnInProgress(i) {
  let taskcard = tasks[i];
  taskcard.column = "inProgress";
  await updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Moves a task to the "Awaiting Feedback" column and updates the task data.
 *
 * @async
 * @param {number} i - The index of the task in the tasks array.
 */
async function changeColumnFeedback(i) {
  let taskcard = tasks[i];
  taskcard.column = "awaitFeedback";
  await updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

/**
 * Moves a task to the "Done" column and updates the task data.
 *
 * @async
 * @param {number} i - The index of the task in the tasks array.
 */
async function changeColumnDone(i) {
  let taskcard = tasks[i];
  taskcard.column = "done";
  await updateTaskInFirebase(taskcard);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}
