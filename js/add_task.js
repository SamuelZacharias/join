let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];
let activeButton = 2;

let contacts = localStorage.getItem('contacts');
if (contacts) {
  contacts = JSON.parse(contacts);
} else {
  contacts = [];
}



function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    document.getElementById('taskForm').submit();
  }
}

function validateForm() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');

  
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
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
  
  setTimeout(() => {
    document.querySelectorAll('.invalid').forEach(element => {
      element.classList.remove('invalid');
    });
  }, 1000); // 500 milliseconds = 0.5 seconds

  return valid;
  
}


document.getElementById("dropdownCategory").addEventListener("click", function() {
  clickCount++;
  if (clickCount % 2 === 1) {
    showCategory();
  } else {
    hideCategory();
  }
});

function handleClickOutside(event) {
  const container = document.getElementById('dropdownCategory');
  if (!container.contains(event.target)) {
    hideCategory();
  }
}
document.addEventListener('click', handleClickOutside);


document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', function() {
    const parentP = input.closest('.inputContainer');
    if (parentP && input.value.trim()) {
      parentP.classList.remove('invalid');
    }
  });
});


document.getElementById('dropdownCategory').addEventListener('click', function() {
  if (choosenCategory) {
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
});





let selectedContacts = [];




document.addEventListener('click', function(event) {
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
  document.getElementById('dropDownContactsImg').classList.remove('dropUpImg')
  }
});


let subtaskInfos = [];

function writeSubtask() {
  let subtaskArea = document.getElementById('subtaskContainer');
  subtaskArea.innerHTML = `
      <div class="addSubtask">
          <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
          <div class="d-flex">
              <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
              <img src="assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
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
          addSubtask(); // Call the addSubtask function
      }
  });

  // Ensure the input gets focus
  inputField.focus();
}

function addSubtask(){
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

  subtaskInfos.push(subtaskInfo);
  showSubtasks();
  resetSubtask();
}

function resetSubtask() {
  document.getElementById('subtaskContainer').innerHTML = `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" readonly onclick="writeSubtask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}

function showSubtasks() {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = '';
  for (let s = 0; s < subtaskInfos.length; s++) {
    newSubtask.innerHTML += `
      <li onmouseenter="showActions(this)" onmouseleave="hideActions(this)">
        <div class="subtask-item">
          <div class="subtask-content">
            <span class="custom-bullet">•</span>
            ${subtaskInfos[s]}
          </div>
          <div class="subtask-icons d-none">
            <img src="assets/img/png/editSubtask.png" onclick="editSubtask(${s})" alt="" />
            <div class="vertical-line"></div>
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
          </div>
        </div>
      </li>
    `;
  }
}

function showActions(element) {
  let actions = element.querySelector('.subtask-icons');
  if (actions) {
    actions.classList.remove('d-none');
  }
}

function hideActions(element) {
  let actions = element.querySelector('.subtask-icons');
  if (actions) {
    actions.classList.add('d-none');
  }
}

function editSubtask(index) {
  let newSubtask = document.getElementById('newSubtasks');
  
  for (let s = 0; s < subtaskInfos.length; s++) {
    if (s === index) {
      newSubtask.innerHTML = `
        <div class="addSubtask"  style="margin-left:-40px" >
          <input type="text" id="editSubtaskInput" value="${subtaskInfos[s]}" minlength="3" required />
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${s})" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
          </div>
        </div>
      `;
    } else {
      newSubtask.innerHTML = `
        <div class="addSubtask" style="margin-left:-40px";>
          <div style="width:100%" onclick="editSubtask(${s})"  >
            ${subtaskInfos[s]}
          </div>
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="showSubtasks()" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
          </div>
        </div>
      `;
    }
  }
  let inputField = document.getElementById('editSubtaskInput');
    if (inputField) {
        inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action if necessary
                saveSubtask(index); // Call the saveSubtask function
            }
        });
        inputField.focus(); 
};
}

function saveSubtask(index) {
  let editInput = document.getElementById('editSubtaskInput');
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

  subtaskInfos[index] = editedSubtask;
  showSubtasks();
}

function deleteSubtask(index) {
  subtaskInfos.splice(index, 1);
  showSubtasks();
}


document.querySelector('.createButton').addEventListener('click', async function(event) {
  event.preventDefault(); 

  if (validateForm()) {
    collectData(); 

    try {
      await sendTaskDataToFirebase(); 

     
      showSuccessMessage() 

    } catch (error) {
      console.error('Failed to send task data to Firebase:', error); 
    }
  } 
});



document.getElementById('clearButton').addEventListener('click', function(event) {
  
  const form = document.getElementById('taskForm');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasks').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  subtaskInfos = [];
  handleClick(2); 
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
});


const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';


async function sendTaskDataToFirebase() {
  try {
    await initializeTasksNode(); // Ensure the 'tasks' node exists

    // Fetch existing tasks to determine the next index
    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];

    // Sort tasks by their ids
    tasksArray.sort((a, b) => a.id - b.id);

    // Ensure task ids are sequential starting from 0
    tasksArray.forEach((task, index) => {
      if (task.id !== index) {
        task.id = index;
        fetch(`${BASE_TASKS_URL}/${index}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
      }
    });

    // Determine the next index
    const nextIndex = tasksArray.length;

    // Collect new task data
    const taskData = collectData();
    if (!taskData) {
      console.error("No task data to send");
      return;
    }

    // Send the new task with the determined index
    const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!taskResponse.ok) {
      throw new Error(`HTTP error! Status: ${taskResponse.status}`);
    }

    let responseAsJson = await taskResponse.json();
    console.log('Data saved to Firebase:', responseAsJson);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}


function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation')
  setTimeout(() => {
    window.location.href = 'board.html';
  }, 3000);
}

