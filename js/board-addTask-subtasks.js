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
  document.getElementById('subtaskContainerAddTask').innerHTML = returnResetBoardSubtaskHtml()
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
    if (index >= 0) {
      newSubtask.innerHTML = returnIfEditSubtaskAddTaskHTML(index, addTaskBoardInfos)
    } else {
      newSubtask.innerHTML = returnElseEditSubtaskAddTaskHtml(index, addTaskBoardInfos)
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