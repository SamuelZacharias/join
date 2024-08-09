let subtaskInfos = [];
let isSubtaskEditMode = false; 

document.addEventListener('click', handleClickOutsideEdit);

function editTask(taskId) {
  let task = getTaskById(taskId); 
  if (!task) {
      console.error('Task not found.');
      return;
  }
  document.getElementById('editTaskContainer').innerHTML= `<div class="openedTask" id="editTask" onclick="event.stopPropagation()" ></div>`
  currentTaskBeingEdited = task;
  renderEditHTML(task);
}

function renderEditHTML(task) {
  let openedEdit = document.getElementById('editTask');
  document.getElementById('editTaskContainer').classList.remove('d-none');
  document.getElementById('editTaskContainer').classList.add('openedTaskContainer');
  let today = new Date().toISOString().split('T')[0];
  openedEdit.innerHTML = returnOpenEditHTML(task, today);
  checkForDescription(task);
  renderEditPriorityButtons(task);
  renderEditSubtasks(task);
}

function checkForDescription(task){
  let textarea = document.getElementById('taskDescriptionTextarea');
  if (!task.description) { 
    textarea.value = 'No description';
  } else {
    textarea.value = task.description; 
  }
}

function renderEditPriorityButtons(task) {
  let buttonsArea = document.getElementById('editPriorityButtons');
  buttonsArea.innerHTML = returnEditPriorityButtonsHTML()
  switchButton(task.priority);
}

function switchButton(priority) {
  const buttons = [
      { id: 'button1', priority: 'Urgent', class: 'urgent' },
      { id: 'button2', priority: 'Medium', class: 'medium' },
      { id: 'button3', priority: 'Low', class: 'low' },
  ];
  buttons.forEach(button => {
      const element = document.getElementById(button.id);
      if (button.priority === priority) {
          element.classList.add(button.class);
          element.classList.remove('hover-shadow');
      } else {
          element.classList.remove(button.class);
          element.classList.add('hover-shadow');
      }
  });
}

function showContactsToChoose() {
  document.getElementById('dropDownImg').classList.add('dropUpImg');
  if (!currentTaskBeingEdited) {
    console.error('No task is currently being edited.');
    return;
  }
  const contactsToChooseElement = document.getElementById('contactsToChoose');
  contactsToChooseElement.innerHTML = '';
  contactsToChooseElement.classList.remove('d-none');
  const assignedContacts = currentTaskBeingEdited.assignedContacts || [];
  renderContactsList(contacts, assignedContacts, contactsToChooseElement);
}

function renderContactsList(contactsList, assignedContacts, contactsToChooseElement) {
  contactsList.forEach(contact => {
    const isAssigned = assignedContacts.some(assignedContact => assignedContact.name === contact.name);
    const contactClass = isAssigned ? 'selected' : '';
    const initials = contact.initials;
    const color = contact.color;

    contactsToChooseElement.innerHTML += returnContactsToChooseHTML(contact.name, contactClass, color, initials);
  });
}

function toggleContactAssignment(contactName) {
  if (!currentTaskBeingEdited) {
      console.warn('No task is currently being edited.');
      return;
  }
  const task = currentTaskBeingEdited;
  const contact = contacts.find(c => c.name === contactName);
  if (!contact) {
      console.warn('Contact not found.');
      return;
  }
  if (isContactAssigned(task, contactName)) {
      unassignContact(task, contactName);
  } else {
      assignContact(task, contact);
  }
  showContactsToChoose(); 
}

function isContactAssigned(task, contactName) {
  const assignedContacts = task.assignedContacts || [];
  return assignedContacts.some(assignedContact => assignedContact.name === contactName);
}

function assignContact(task, contact) {
  if (!task.assignedContacts) {
    task.assignedContacts = [];
  }
  if (!task.assignedContacts.some(c => c.name === contact.name)) {
    task.assignedContacts.push(contact);
  }
}


function unassignContact(task, contactName) {
  if (!task.assignedContacts) {
    return;
  }
  const contactIndex = task.assignedContacts.findIndex(c => c.name === contactName);
  if (contactIndex > -1) {
      task.assignedContacts.splice(contactIndex, 1);
  }
}

function closeContactsDropdown(){
let  contactsTochoose =  document.getElementById('contactsToChoose')
if(contactsTochoose.classList.contains('d-none')){
  showContactsToChoose()
  document.getElementById('dropDownImg').classList.add('dropUpImg')
}else{
  contactsTochoose.classList.add('d-none')
  document.getElementById('dropDownImg').classList.remove('dropUpImg')
}}

function renderEditSubtasks(task) {
  subtaskInfos = task.subtasks || [];
  let editSubtaskArea = document.getElementById('editSubtasks');
  editSubtaskArea.innerHTML = returnEditSubtasksHTML();
  showSubtasks();  
}

function startWritingSubtask() {
  if (!isSubtaskEditMode) {
      writeSubtask();
      
      isSubtaskEditMode = true; 
  }else{
      isSubtaskEditMode = false
      
  }
}

function writeSubtask() {
  let subtaskArea = document.getElementById('editAreaSubtask');
  subtaskArea.innerHTML = returnWriteSubtaskHTML();
  let subtaskInput = document.getElementById('subtaskInput2');
  subtaskInput.focus()
  subtaskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        addSubtask();  
    }
});
}

function validateSubtaskInput(subtaskInput, editSubtask) {
  if (subtaskInput.value.trim().length < 3) {
    subtaskInput.value = '';
    subtaskInput.placeholder = 'Min 3 characters needed';
    editSubtask.classList.add('error-container');
    subtaskInput.classList.add('error-placeholder');
    return false;
  } else {
    subtaskInput.placeholder = 'Enter subtask';
    editSubtask.classList.remove('error-container');
    subtaskInput.classList.remove('error-placeholder');
    return true;
  }
}

function addInputEventListener(subtaskInput, editSubtask) {
  subtaskInput.addEventListener('input', function() {
    if (subtaskInput.value.trim().length >= 3) {
      subtaskInput.placeholder = 'Enter subtask';
      editSubtask.classList.remove('error-container');
      subtaskInput.classList.remove('error-placeholder');
    }
  });
}

function clearInputAndAddSubtask(subtaskInput, subtaskInfos) {
  subtaskInfos.push({ completed: false, title: subtaskInput.value.trim() });
  subtaskInput.value = '';
}

function addSubtask() {
  let subtaskInput = document.getElementById('subtaskInput2');
  let subtaskInfo = subtaskInput.value.trim();
  let editSubtask = document.getElementById('editSubtasks');
  addInputEventListener(subtaskInput, editSubtask);
  if (!validateSubtaskInput(subtaskInput, editSubtask)) {
    return;
  }
  clearInputAndAddSubtask(subtaskInput, subtaskInfos);
  showSubtasks();
  renderEditSubtasks({ subtasks: subtaskInfos });
}

function appendSubtaskHTML(container, html) {
  container.innerHTML += html;
}

function showSubtasks() {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = ''; 
  for (let s = 0; s < subtaskInfos.length; s++) {
    const subtaskHTML = returnSubtaskHTML(s, subtaskInfos[s].title);
    appendSubtaskHTML(newSubtask, subtaskHTML);
  }
}

function showActions(element) {
  let actions = element.querySelector('.d-none');
  if (actions && editSubtaskBoard(index)) {
      return;
  }else{
    actions.classList.remove('d-none');
  }
}

function hideActions(element) {
  let actions = element.querySelector('.d-flex:not(.d-none)');
  if (actions) {
      actions.classList.add('d-none');
  }
}

function editSubtaskBoard(index) {
  let subtaskContainers = document.querySelectorAll('#newSubtasks .subtask-content');
  let subtaskContainer = subtaskContainers[index];
  let subtaskTitle = subtaskInfos[index].title;
  subtaskContainer.innerHTML = returnEditSubtaskHTML(index, subtaskTitle);
  let editInput = document.getElementById('editSubtaskInput');
    editInput.focus(); 
    editInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();  
            saveSubtask(index); 
        }
    });
}

function handleEditInputError(editInput) {
  editInput.value = '';
  editInput.placeholder = 'Min 3 characters needed';
  editInput.style.borderColor = 'red';
  editInput.classList.add('error-placeholder');
  editInput.addEventListener('focus', function() {
      editInput.placeholder = 'Enter subtask';
      editInput.style.borderColor = '';
      editInput.classList.remove('error-placeholder');

  }, { once: true });
}

function saveSubtask(index) {
  let editInput = document.getElementById('editSubtaskInput');
  let editedSubtask = editInput.value.trim();
  if (editedSubtask.length < 3) {
      handleEditInputError(editInput);
      return;
  } else {
      editInput.placeholder = 'Enter subtask';
      editInput.style.borderColor = '';
      editInput.classList.remove('error-placeholder');
      
  }
  subtaskInfos[index].title = editedSubtask;
  showSubtasks();
}

function deleteSubtask(index) {
  subtaskInfos.splice(index, 1);
  showSubtasks();
}


