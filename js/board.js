const tasks = [];
const contacts = []
let selectedContacts = [];
const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';


async function getTasksFromDataBase() {
    try {
        const response = await fetch(BASE_URL + '.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseAsJson = await response.json();
        console.log('Tasks fetched from database:', responseAsJson);

        const tasksArray = Object.keys(responseAsJson)
            .filter(key => responseAsJson[key] !== null)
            .map(key => ({ id: key, ...responseAsJson[key] }));

        // Clear and update the tasks array
        tasks.length = 0;
        tasks.push(...tasksArray);

        console.log('Tasks array:', tasks);

        // Update local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Load tasks from local storage to ensure consistency
        renderTasks()
    } catch (error) {
        console.warn('There was a problem with the fetch operation:', error);
    }
}


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




async function updateTaskInFirebase(task) {
    try {
        const response = await fetch(`${BASE_URL}${task.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const updatedTask = await response.json();
        console.log('Task updated in Firebase:', updatedTask);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

document.addEventListener('click', handleClickOutside);



function closeOpenedTask(){
    document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
    document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer')
    document.getElementById(`editTaskContainer`).classList.add(`d-none`)
    document.getElementById('editTaskContainer').classList.remove('openedTaskContainer')
}

function handleClickOutside(event) {
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

function openBoardAddTask(){
   let addTaskContainer = document.getElementById('addTaskContainer')
   addTaskContainer.classList.remove('d-none')
   renderAddTaskBoardHtml(addTaskContainer)
   document.getElementById('boardAddTask').classList.add('slide-in')
   handleClick(2)
   addTaskColumn = 'toDo'
   console.log(addTaskColumn);
   setMinDate()
   
}

function openBoardAddTaskInProgress(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    document.getElementById('boardAddTask').classList.add('slide-in')
    handleClick(2)
    addTaskColumn = 'inProgress'
    console.log(addTaskColumn);
    setMinDate()
}

function openBoardAddTaskawaitFeedback(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    document.getElementById('boardAddTask').classList.add('slide-in')
    handleClick(2)
    addTaskColumn = 'awaitFeedback'
    console.log(addTaskColumn);
    setMinDate()
}


function closeAddTaskBoard(){
    document.getElementById('addTaskContainer').classList.add('d-none')
}

let activeButton = null
let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];

function renderAddTaskBoardHtml(addTaskContainer){
    addTaskContainer.innerHTML = `
        <section class="addTask" id="boardAddTask" >
            <div class="boardAddTaskTitle">
                <h1>Add Task</h1>
                <img src="/assets/img/png/close.png" onclick="closeAddTaskBoard()">
            </div>
            <form id="taskFormAddTask" >
              <div class="formLeft">
                <div class="eachInput">
                  <span>Title<b style="color: red">*</b></span>
                  <p class="inputContainerAddTask"><input id="titleInputAddTask" required type="text" /></p>
                </div>
                <div class="eachInput">
                  <span>Description</span>
                  <p><textarea name="" id=""></textarea></p>
                </div>
                <div class="eachInput">
                  <span>Assigned to</span>
                  <div class="categoryDropDown" id="dropdownContacts" onclick="toggleContacts()">
                    <span class="spanCategory" >Select Contacts to assign</span>
                    <img class="dropDownImg" id="dropDownContactsImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
                  </div>
                  <div id="contacts" class=" contacts d-none"></div>
                  <div id="assignedContacts" class="assignedContacts"></div>
                </div>
              </div>
              <div class="separator"></div>
              <div class="formLeft">
                <div class="eachInput">
                  <span>Due date <b style="color: red">*</b></span>
                  <p class="inputContainerAddTask"><input required type="date" id="dateInputAddTask"/></p>
                </div>
                <div class="eachInput">
                  <span>Prio</span>
                  <div class="d-flex prioArea">
                    <button type="button" id="button1" onclick="handleClick(1)" class="buttonCenter prioButton">
                      Urgent <img id="prioImg1" src="assets/img/svg/urgent.svg" alt="" />
                    </button>
                    <button type="button" id="button2" onclick="handleClick(2)" class="buttonCenter prioButton">
                      Medium <img id="prioImg2" src="assets/img/png/mediumColor.png" alt="" />
                    </button>
                    <button type="button" id="button3" onclick="handleClick(3)" class="buttonCenter prioButton">
                      Low <img id="prioImg3" src="assets/img/svg/low.svg" alt="" />
                    </button>
                  </div>
                </div>
                <span style="margin-bottom: -6px; margin-top: -8px;">Category <b style="color: red">*</b></span>
                <div class="categoryDropDown" id="dropdownCategory" onclick="showCategory()">
                  <span class="spanCategory" >Select task category</span>
                  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
                </div>
                <div id="categories"></div>
                <div class="eachInput">
                  <span>Subtasks</span>
                  <div id="subtaskContainerAddTask">
                    <p>
                      <input type="text" name="" placeholder="Add new subtask" readonly onclick="writeSubtaskAddTask()" />
                      <img src="assets/img/png/Subtasks icons11.png"  onclick="writeSubtaskAddTask()"alt="" />
                    </p>
                  </div>
                  <ul id="newSubtasksAddTask" style="display: flex;"></ul>
                </div>
              </div>
            </form>
            <section class="buttonsSection d-flex">
              <span><b style="color: red">*</b> This field is Required</span>
              <div class="buttonArea">
                <button id="clearButton" onclick="clearForm()" class="buttonCenter clear">
                  Clear
                  <img src="assets/img/png/iconoir_cancel.png" alt="" />
                </button>
                <button type="submit" onclick="handleCreateButtonClick()" id="createButton" class="buttonCenter createButton">
                  Create Task <img src="assets/img/png/check.png" alt="" />
                </button>
              </div>
            </section>
          </section>
    `;
}

function handleClick(buttonNumber) {
    if (activeButton !== null) {
      const previousButton = document.getElementById('button' + activeButton);
      const previousImage = document.getElementById('prioImg' + activeButton);
      
      previousButton.classList.add('hover-shadow');
      previousButton.style.backgroundColor = '';
      previousButton.style.color = '';
      previousButton.style.fontWeight = '';
  
      switch (activeButton) {
        case 1:
          previousImage.src = 'assets/img/svg/urgent.svg';
          break;
        case 2:
          previousImage.src = 'assets/img/png/mediumColor.png';
          break;
        case 3:
          previousImage.src = 'assets/img/svg/low.svg';
          break;
      }
    }
  
    activeButton = buttonNumber;
    const activeButtonElement = document.getElementById('button' + activeButton);
    const activeImage = document.getElementById('prioImg' + activeButton);
  
    activeButtonElement.classList.remove('hover-shadow');
    activeButtonElement.style.color = 'white';
    activeButtonElement.style.fontWeight = '600';
  
    switch (buttonNumber) {
      case 1:
        activeButtonElement.style.backgroundColor = '#FF3D00';
        activeImage.src = 'assets/img/png/urgentWhite.png';
        break;
      case 2:
        activeButtonElement.style.backgroundColor = '#FFA800';
        activeImage.src = 'assets/img/svg/medium.svg';
        break;
      case 3:
        activeButtonElement.style.backgroundColor = '#7AE229';
        activeImage.src = 'assets/img/png/lowWhite.png';
        break;
    }
  }

  function showCategory() {
    let categories = document.getElementById('categories');
    categories.innerHTML = `
        <div class="openedDropDown">
          <span class="spanHover" onclick="chooseUserStory()">${category[0]}</span>
          <span class="spanHover" onclick="chooseTechnical()"> ${category[1]}</span>
        </div>
      `; 
    document.getElementById('categories').classList.remove('d-none');
    document.getElementById('dropDownImg').classList.remove('dropDownImg');
    document.getElementById('dropDownImg').classList.add('dropUpImg');
    choosenCategory = false;
  }
  
  function chooseUserStory() {
    let chooseCategory = document.getElementById('dropdownCategory');
    chooseCategory.innerHTML = `
    <span onclick="showCategory()" class="spanCategory">${category[0]}</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
    document.getElementById('categories').classList.add('d-none');
    choosenCategory = true;
    clickCount = 0;
    document.getElementById('dropDownImg').classList.add('dropDownImg');
  
    
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
  
  function chooseTechnical() {
    let chooseCategory = document.getElementById('dropdownCategory');
    chooseCategory.innerHTML = `
    <span onclick="showCategory()" class="spanCategory">${category[1]}</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
    document.getElementById('categories').classList.add('d-none');
    choosenCategory = true;
    clickCount = 0;
    document.getElementById('dropDownImg').classList.add('dropDownImg');
  
    
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
  
  function hideCategory() {
    document.getElementById('dropDownImg').classList.add('dropDownImg');
    document.getElementById('dropDownImg').classList.remove('dropUpImg')
    document.getElementById('categories').classList.add('d-none');
    clickCount = 0;
  }

  document.addEventListener("DOMContentLoaded", function() {
    let clickCount = 0;
    const dropdown = document.getElementById("dropdownCategory");
    if (dropdown) {
      dropdown.addEventListener("click", function() {
        clickCount++;
        if (clickCount % 2 === 1) {
          showCategory();
        } else {
          hideCategory();
        }
      });
    } 
  });

  function handleClickOutside(event) {
    const container = document.getElementById('dropdownCategory');
    if (!container.contains(event.target)) {
      hideCategory();
    }
  }
  




function showContacts() {
  let contactsContainer = document.getElementById('contacts');
  contactsContainer.innerHTML = '';

  for (let x = 0; x < contacts.length; x++) {
    let contact = contacts[x];
    let fullName = contact.name;
    let color = contact.color;

    let isSelected = selectedContacts.some(c => c.name === contact.name);
    let selectedClass = isSelected ? 'selected' : '';

    contactsContainer.innerHTML += `
      <div class="contactsOpen ${selectedClass}" data-index="${x}">
        <div class="contactInitials" style="background-color: ${color}; ">
          ${contact.initials}
        </div>
        <div class="contactName">
          <span style="width:100%;">${fullName}</span>
          <img src="assets/img/png/Rectangle 5.png" alt="">
        </div>
      </div>
    `;
  }

  let contactElements = contactsContainer.getElementsByClassName('contactsOpen');
  for (let contactElement of contactElements) {
    contactElement.addEventListener('click', function() {
      let index = this.getAttribute('data-index');
      let contact = contacts[index];

      let selectedIndex = selectedContacts.findIndex(c => c.name === contact.name);
      if (selectedIndex === -1) {
        selectedContacts.push(contact);
      } else {
        selectedContacts.splice(selectedIndex, 1);
      }

      this.classList.toggle('selected');
      showAssignedContacts();
    });
  }
}

function toggleContacts() {
  document.getElementById('dropDownContactsImg').classList = ('dropUpImg')
  let contactsContainer = document.getElementById('contacts');
  if (contactsContainer.classList.contains('d-none')) {
    contactsContainer.classList.remove('d-none');

    showContacts();
  } else {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList = ('dropDownImg')
  }
}

function showAssignedContacts() {
  let assignedContactsContainer = document.getElementById('assignedContacts');
  assignedContactsContainer.innerHTML = '';
  let maxContactsToShow = 5;

  for (let a = 0; a < Math.min(selectedContacts.length, maxContactsToShow); a++) {
    let contact = selectedContacts[a];
    let fullName = contact.name;  // Assuming `name` field is a single string.
    let color = contact.color;    // Use the color from the contact object.

    assignedContactsContainer.innerHTML += `
      <div class="contactInitials" style="background-color: ${color}; color:white;">
        ${contact.initials}
      </div>
    `;
  }

  if (selectedContacts.length > maxContactsToShow) {
    let moreCount = selectedContacts.length - maxContactsToShow;
    let moreContactsColor = "#999999"; 

    assignedContactsContainer.innerHTML += `
      <div class="contactInitials more-contacts" style="background-color: ${moreContactsColor};">
        +${moreCount} 
      </div>
    `;
  }
}


document.addEventListener('click', function(event) {
    let contactsContainer = document.getElementById('contacts');
    let dropdownContacts = document.getElementById('dropdownContacts');
    if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
      contactsContainer.classList.add('d-none');
      document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
    document.getElementById('dropDownContactsImg').classList.remove('dropUpImg')
    }
  });

  let addTaskBoardInfos = [];

function writeSubtaskAddTask() {
  let subtaskArea = document.getElementById('subtaskContainerAddTask');
  subtaskArea.innerHTML = `
      <div class="addSubtask">
          <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
          <div class="d-flex">
              <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
              <img src="assets/img/png/subtaskDone.png" onclick="addSubtaaskBoard();" alt="" />
          </div>
      </div>
  `;

  // Get the newly created input field
  let inputField = document.getElementById('subtaskInput');

  // Add event listener for focusout event
  inputField.addEventListener('focusout', function() {
      if (!this.value.trim()) {
          resetSubtask();
      }
  });

  // Add event listener for keydown event to detect Enter key
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default action if necessary
          addSubtaaskBoard(); // Call the addSubtask function
      }
  });

  // Ensure the input gets focus
  inputField.focus();
}

function addSubtaaskBoard(){
  let subtaskInput = document.getElementById('subtaskInput');
  let subtaskInfo = subtaskInput.value;

  if (subtaskInfo.length < 3) {
    subtaskInput.value = ''; 
    subtaskInput.placeholder = 'Min 3 characters needed'; 
    subtaskInput.style.borderColor = 'red'; 
    subtaskInput.classList.add('error-placeholder'); 
    return; 
  } else {
    subtaskInput.placeholder = 'Enter subtask'; 
    subtaskInput.style.borderColor = ''; 
    subtaskInput.classList.remove('error-placeholder'); 
  }

  addTaskBoardInfos.push(subtaskInfo);
  showSubtasksAddTask();
  resetSubtask();
}

function resetSubtask() {
  document.getElementById('subtaskContainerAddTask').innerHTML = `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" readonly onclick="writeSubtaskAddTask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}

function showSubtasksAddTask() {
  let newSubtask = document.getElementById('newSubtasksAddTask');
  newSubtask.innerHTML = '';
  for (let s = 0; s < addTaskBoardInfos.length; s++) {
    newSubtask.innerHTML += `
      <li onmouseenter="showActions(this)" onmouseleave="hideActionsAddTask(this)">
        <div class="subtask-item">
          <div class="subtask-content">
            <span class="custom-bullet">•</span>
              <div style="width:100%" onclick="editSubtaskAddTask(${s})">${addTaskBoardInfos[s]}</div>
          </div>
          <div class="subtaskIconsAddTask d-none">
            <img src="assets/img/png/editSubtask.png" onclick="editSubtaskAddTask(${s})" alt="" />
            <div class="vertical-line"></div>
            <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${s})" alt="" />
          </div>
        </div>
      </li>
    `;
  }
}

function editSubtaskAddTask(index) {
  let newSubtask = document.getElementById('newSubtasksAddTask');
  
  for (let s = 0; s < addTaskBoardInfos.length; s++) {
    if (s === index) {
      newSubtask.innerHTML = `
        <div class="addSubtask" >
          <input type="text" id="editSubtaskInputAddTask" value="${addTaskBoardInfos[s]}" minlength="3" required />
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="saveSubtaskAddTask(${s})" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${s})" alt="" />
          </div>
        </div>
      `;
    } else {
      newSubtask.innerHTML = `
        <div class="addSubtask">
          <div style="width:100%" onclick="editSubtaskAddTask(${s})"  >
            ${addTaskBoardInfos[s]}
          </div>
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="showSubtasksAddTask()" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtaskAddTask(${s})" alt="" />
          </div>
        </div>
      `;
    }
  }
  let inputField = document.getElementById('editSubtaskInputAddTask');
    if (inputField) {
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action if necessary
                saveSubtaskAddTask(index); // Call the saveSubtask function
            }
        });
        inputField.focus(); 
};
}

function saveSubtaskAddTask(index) {
  let editInput = document.getElementById('editSubtaskInputAddTask');
  let editedSubtask = editInput.value;

  if (editedSubtask.length < 3) {
    editInput.value = ''; 
    editInput.placeholder = 'Min 3 characters needed'; 
    editInput.style.borderColor = 'red'; 
    editInput.classList.add('error-placeholder'); 
    return; 
  } else {
    editInput.placeholder = ''; 
    editInput.style.borderColor = ''; 
    editInput.classList.remove('error-placeholder'); 
  }

  addTaskBoardInfos[index] = editedSubtask;
  showSubtasksAddTask()
}

function deleteSubtaskAddTask(index) {
  addTaskBoardInfos.splice(index, 1);
  showSubtasksAddTask()
}

function showActions(element) {
  let actions = element.querySelector('.subtaskIconsAddTask');
  if (actions) {
    actions.classList.remove('d-none');
  }
}

function hideActionsAddTask(element) {
  let actions = element.querySelector('.subtaskIconsAddTask');
  if (actions) {
    actions.classList.add('d-none');
  }
}

function setMinDate() {
  const dateInput = document.getElementById('dateInputAddTask');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;

  dateInput.min = todayDate;
}



function clearForm() {
  const form = document.getElementById('taskFormAddTask');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasksAddTask').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  addTaskBoardInfos = [];
  handleClick(2); 
  document.querySelectorAll('.inputContainerAddTask').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
  
}

function submitForm(event) {
  if (!validateFormAddTaskBoard()) {
    event.preventDefault();
  } else {
    document.getElementById('taskFormAddTask').submit();
  }
}

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



  function validateFormAddTaskBoard() {
    const form = document.getElementById('taskFormAddTask');
    const inputs = form.querySelectorAll('input, textarea, select');
    let valid = true;
  
    // First, remove invalid classes immediately
    document.querySelectorAll('.inputContainerAddTask').forEach(p => {
      p.classList.remove('invalid');
    });
    document.getElementById('dropdownCategory').classList.remove('invalid');
  
    // Validate inputs and add invalid class if necessary
    inputs.forEach(input => {
      const parentP = input.closest('.inputContainerAddTask');
      if (input.required && !input.value.trim()) {
        valid = false;
        if (parentP) {
          parentP.classList.add('invalid');
        }
      }
  
      if (input.type === 'date') {
        const selectedDate = new Date(input.value);
        const today = new Date();
  
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          valid = false;
          if (parentP) {
            parentP.classList.add('invalid');
          }
        }
      }
    });
  
    if (!choosenCategory) {
      valid = false;
      document.getElementById('dropdownCategory').classList.add('invalid');
    }
  
    // Add timeout to remove 'invalid' class after 0.5 seconds
    setTimeout(() => {
      document.querySelectorAll('.invalid').forEach(element => {
        element.classList.remove('invalid');
      });
    }, 800); // 500 milliseconds = 0.5 seconds
  
    return valid;
  }
  
  async function handleCreateButtonClick() {
    console.log('createwasclicked');
  
    if (validateFormAddTaskBoard()) {
      const taskData = collectDataAddTask();
      if (taskData) {
        console.log('Task data collected:', taskData);
        try {
          await sendTaskDataToFirebaseAddTask(taskData); 
          console.log('Task data sent to Firebase successfully');
        } catch (error) {
          console.error('Failed to send task data to Firebase:', error); 
        }
      } else {
        console.error('Task data collection failed');
      }
    } else {
      console.error('Form validation failed');
    }
  }

const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

function collectDataAddTask() {
  const form = document.getElementById('taskFormAddTask');
  if (!form) {
    return;
  }

  const title = form.querySelector('input[type="text"]').value;
  const description = form.querySelector('textarea').value;
  const dueDate = form.querySelector('input[type="date"]').value;
  const categoryElement = document.getElementById('dropdownCategory').querySelector('span').innerText;

  const assignedContacts = selectedContacts || [];
  const subtasks = (addTaskBoardInfos || []).map(subtask => ({ title: subtask, completed: false }));

  let priority = '';
  switch (activeButton) {
    case 1:
      priority = 'Urgent';
      break;
    case 2:
      priority = 'Medium';
      break;
    case 3:
      priority = 'Low';
      break;
    default:
      console.error("Invalid activeButton value");
      return;
  }

  return {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    category: categoryElement,
    assignedContacts: assignedContacts,
    subtasks: subtasks,
    column: addTaskColumn || 'toDo',
  };
}

async function initializeTasksNode() {
  try {
    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error during initialize tasks node! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    if (existingTasks === null) {
      // Initialize the 'tasks' node if it doesn't exist
      const initResponse = await fetch(BASE_TASKS_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!initResponse.ok) {
        throw new Error(`HTTP error during initialize tasks node PUT! Status: ${initResponse.status}`);
      }
    }
    console.log('Tasks node initialized if not existing');
  } catch (error) {
    console.error('Error initializing tasks node:', error);
  }
}


async function sendTaskDataToFirebaseAddTask() {
  try {
    await initializeTasksNode();
    console.log('Tasks node initialized');

    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error during fetch tasks! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];
    console.log('Existing tasks fetched:', tasksArray);

    tasksArray.sort((a, b) => a.id - b.id);

    const promises = tasksArray.map((task, index) => {
      if (task.id !== index) {
        task.id = index;
        return fetch(`${BASE_TASKS_URL}/${index}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
      }
    });

    await Promise.all(promises);
    console.log('Task IDs updated if necessary');

    const nextIndex = tasksArray.length;
    const taskData = collectDataAddTask();
    if (!taskData) {
      throw new Error("No task data to send");
    }
    console.log('Task data collected:', taskData);

    const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!taskResponse.ok) {
      throw new Error(`HTTP error during save task! Status: ${taskResponse.status}`);
    }

    let responseAsJson = await taskResponse.json();
    console.log('Data saved to Firebase:', responseAsJson);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}