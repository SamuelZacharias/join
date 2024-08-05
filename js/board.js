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

function showSuccessMessageAddTask() {
  const successContainer = document.getElementById('successContainer');
  const successMessageAddTask = document.getElementById('sucessMessageAddTask');

  if (!successContainer) {
      console.error("Element with id 'successContainer' not found");
      return;
  }
  
  if (!successMessageAddTask) {
      console.error("Element with id 'sucessMessageAddTask' not found");
      return;
  }

  successContainer.classList.remove('d-none');
  successMessageAddTask.innerHTML = `Your task was added to ${addTaskColumn}`;
  console.log('Success message shown');
  setTimeout(() => {
    successContainer.classList.add('d-none');
  }, 1000);
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



function writeSubtaskAddTask() {
  let subtaskArea = document.getElementById('subtaskContainerAddTask');
  subtaskArea.innerHTML = returnWriteSubtaskAddTaskBoardHTML()
  let inputField = document.getElementById('subtaskInput');
  inputField.addEventListener('focusout', function() {
      if (!this.value.trim()) {
          resetSubtask();
      }
  });
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          addSubtaaskBoard(); 
      }
  });
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
    newSubtask.innerHTML += returnShowSubtasksAddTaskHtml(s, addTaskBoardInfos)
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
      const taskData = collectData();
      if (taskData) {
        console.log('Task data collected:', taskData);
        try {
          await sendTaskDataToFirebaseAddTask(taskData); 
          console.log('Task data sent to Firebase successfully');
          clearForm()
          closeAddTaskBoard()
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


