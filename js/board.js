const tasks = [];
const contacts = []
let selectedContacts = [];
let addTaskBoardInfos = [];
let activeButton = null
let clickCount = 0;
let choosenCategory = false;
let category = ["User Story", "Technical task"];
let addTaskColumn = null

function loadTasksFromLocalStorage() {
  const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const validTasks = savedTasks.filter(task => task !== null);
  tasks.length = 0;
  tasks.push(...validTasks);
  contacts.length = 0;
  contacts.push(...savedContacts);
}

function filterTasks() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  const filteredTasks = tasks.filter(task => {
    return task.title.includes(searchInput) || task.description.toLowerCase().includes(searchInput);
  });
  renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
  renderTasks(filteredTasks);
}

function closeOpenedTask() {
  document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
  document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer')
  document.getElementById(`editTaskContainer`).classList.add(`d-none`)
  document.getElementById('editTaskContainer').classList.remove('openedTaskContainer')
}

function handleClickOutsideEdit(event) {
  const container = document.getElementById('openedTaskContainer');
  if (container.contains(event.target)) {
    document.getElementById('openedTaskContainer').classList.add('d-none')
    container.classList.remove('openedTaskContainer')
  }
  const containerEdit = document.getElementById('editTaskContainer');
  if (containerEdit.contains(event.target)) {
    document.getElementById('editTaskContainer').classList.add('d-none')
    containerEdit.classList.remove('openedTaskContainer')
  }
}

function openBoardAddTask(columnType) {
  let addTaskContainer = document.getElementById('addTaskContainer');
  addTaskContainer.classList.remove('d-none');
  renderAddTaskBoardHtml(addTaskContainer);
  document.getElementById('boardAddTask').classList.add('slide-in');
  handleClick(5)
  addTaskColumn = columnType;
  setMinDate();
}

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

function closeAddTaskBoardOnX() {
  const taskContainer = document.getElementById('addTaskContainer');
  taskContainer.classList.add('d-none');
  clearForm()
}

document.addEventListener('click', function (event) {
  let addBoardTask = document.getElementById('boardAddTask');
  if (!addBoardTask) {
    return;
  }
  let categoryContainer = document.getElementById('categories');
  let dropdownCategory = document.getElementById('dropdownCategory');
  if (dropdownCategory.contains(event.target)) {
    clickCount = clickCount === 0 ? 1 : 0;
    if (clickCount === 1) {
      categoryContainer.classList.remove('d-none');
    } else {
      resetDropDownIconsCategory()
      categoryContainer.classList.add('d-none');
    }
  } else if (!categoryContainer.classList.contains('d-none') && !categoryContainer.contains(event.target)) {
    categoryContainer.classList.add('d-none');
    clickCount = 0;
    resetDropDownIconsCategory()
  }
});



function resetDropDownIconsCategory() {
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg');
}

document.addEventListener('click', function (event) {
  let addBoardTask = document.getElementById('boardAddTask');
  if (!addBoardTask) {
    return;
  }
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
    document.getElementById('dropDownContactsImg').classList.remove('dropUpImg');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const dropdownCategory = document.getElementById('dropdownCategory');
  if (dropdownCategory) {
    dropdownCategory.addEventListener('click', function () {
      if (choosenCategory) {
        dropdownCategory.classList.remove('invalid');
      }
    });
  }
});

setInterval(() => {
  getTasksFromDataBase()
  console.log('taskrerendered');
  
}, 15000);