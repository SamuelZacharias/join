let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];
let activeButton = 2;
let selectedContacts = [];
let contacts = localStorage.getItem('contacts');
let subtaskInfos = [];

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
  resetInvalidStates();

  // Run input validation
  let validInputs = validateInputs();

  // Run category validation
  let validCategory = validateFormCategory();

  // Combine the results - form is valid only if both are valid
  let valid = validInputs && validCategory;

  // Additional validation (e.g., form timeout)
  validateFormTimeout();

  return valid;
}

function validateInputs() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
    validateDateInput(input);
  });
  
  return valid;
}

function resetInvalidStates() {
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

function validateFormTimeout() {
  setTimeout(() => {
    document.querySelectorAll('.invalid').forEach(element => {
      element.classList.remove('invalid');
    });
  }, 1000); 
}

function validateFormCategory() {
  let valid = false
  if (!choosenCategory) {
    valid = false;
    document.getElementById('dropdownCategory').classList.add('invalid');
  }else{
    valid = true
  }
  return valid
}

function validateDateInput(input){
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

document.addEventListener('click', function(event) {
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
  document.getElementById('dropDownContactsImg').classList.remove('dropUpImg')
  }
});

function writeSubtask() {
  let subtaskArea = document.getElementById('subtaskContainer');
  subtaskArea.innerHTML = returnWriteSubtaskHtmlAddTask()
  let inputField = document.getElementById('subtaskInput');
  inputField.addEventListener('focusout', function() {
      if (!this.value.trim()) {
          resetSubtask();
      }
  });
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault(); 
          addSubtask(); 
      }
  });
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
  document.getElementById('subtaskContainer').innerHTML = returnResetSubtaskHtml()
}

function showSubtasks() {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = '';
  for (let s = 0; s < subtaskInfos.length; s++) {
    newSubtask.innerHTML += returnShowAddTaskSubtaskHTML(subtaskInfos[s], s);
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

function updateSubtaskHtml(index) {
  let newSubtask = document.getElementById('newSubtasks');
  if (index >= 0) {
      newSubtask.innerHTML = returnEditSubtaskAddtaskIfHtml(index);
  } else {
      newSubtask.innerHTML = returnEditSubtaskAddTaskElseHtml(index);
  }
}

function editSubtask(index) {
  updateSubtaskHtml(index);
  let inputField = document.getElementById('editSubtaskInput');
  if (inputField) {
      inputField.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault(); 
              saveSubtask(index); 
          }
      });
      inputField.focus(); 
  }
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
  document.getElementById('dropdownCategory').innerHTML = returnAddTaskDropCategoryHtml()
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


function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation')
  setTimeout(() => {
    window.location.href = 'board.html';
  }, 3000);
}

