const tasks = [];
const contacts = []
let selectedContacts = [];
let addTaskBoardInfos = [];

function loadTasksFromLocalStorage() {
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const validTasks = savedTasks.filter(task => task !== null);

    // Update tasks array with valid tasks
    tasks.length = 0;  
    tasks.push(...validTasks);

    // Update contacts array directly
    contacts.length = 0;
    contacts.push(...savedContacts);  // Spread savedContacts into the contacts array

    console.log('Loaded tasks:', tasks);
    console.log('Loaded contacts:', contacts);
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


function closeOpenedTask(){
    
    document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
    document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer')
    document.getElementById(`editTaskContainer`).classList.add(`d-none`)
    document.getElementById('editTaskContainer').classList.remove('openedTaskContainer')
}

function handleClickOutsideEdit(event) {
    const container = document.getElementById('openedTaskContainer');
        if(container.contains(event.target)){
        document.getElementById('openedTaskContainer').classList.add('d-none')
        
        container.classList.remove('openedTaskContainer')
        }

        const containerEdit = document.getElementById('editTaskContainer');
        if(containerEdit.contains(event.target)){
        document.getElementById('editTaskContainer').classList.add('d-none')
        
        containerEdit.classList.remove('openedTaskContainer')
        }

}

let addTaskColumn = null

function openBoardAddTask(columnType) {
  let addTaskContainer = document.getElementById('addTaskContainer');
  addTaskContainer.classList.remove('d-none');
  renderAddTaskBoardHtml(addTaskContainer);
  document.getElementById('boardAddTask').classList.add('slide-in');
  handleClick(2);
  
  // Set the addTaskColumn based on the columnType parameter
  addTaskColumn = columnType;
  console.log(addTaskColumn);
  
  setMinDate();
}


function closeAddTaskBoard() {
  const taskContainer = document.getElementById('addTaskContainer');
  
  if (!taskContainer) {
      console.error("Element with id 'addTaskContainer' not found");
      return;
  }

  // Show success message immediately
  showSuccessMessageAddTask();
  
  // Add the slideOut class immediately
  taskContainer.classList.add('slideOut');
  console.log('slideOut class added');
  
  // Add the d-none class after 0.3 seconds (300 milliseconds)
  setTimeout(() => {
      taskContainer.classList.add('d-none');
      taskContainer.classList.remove('slideOut'); // Reset the animation class
      console.log('d-none class added and slideOut class removed');
  }, 1000); // Adjust timeout if necessary
}




function closeAddTaskBoardOnX(){
  const taskContainer = document.getElementById('addTaskContainer');
  taskContainer.classList.add('d-none');
}


let activeButton = null
let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];



document.addEventListener('click', function(event) {
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


function resetDropDownIconsCategory(){
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg');
}


document.addEventListener('click', function(event) {
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


document.addEventListener('DOMContentLoaded', function() {
  const dropdownCategory = document.getElementById('dropdownCategory');
  if (dropdownCategory) {
    dropdownCategory.addEventListener('click', function() {
      if (choosenCategory) {
        dropdownCategory.classList.remove('invalid');
      }
    });
  }
});



  
  
 

