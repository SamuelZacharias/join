let currentTaskId = null;

function openTask(task) {
  currentTaskId = task.id;
  let openedTaskContainer = document.getElementById('openedTaskContainer');
  openedTaskContainer.classList.add('openedTaskContainer');
  openedTaskContainer.classList.remove('d-none');
  openedTaskContainer.innerHTML = returnOpenedTaskHtml(task);
  checkforOpenedDecsripiton(task);
  renderOpenTaskAssignedContacts(task);
  renderOpenTaskSubtasks(task);
  checkforOpenedTitle(task);
  openedCategoryColor(task);
}

function openedCategoryColor(task) {
  const categoryElement = document.getElementById(`openedTaskCategory`);
  if (categoryElement) {
    if (task.category === 'User Story') {
      categoryElement.classList.add('userTask');
    } else if (task.category === 'Technical task') {
      categoryElement.classList.add('technicalTask');
    }
  }
}

function checkforOpenedDecsripiton(task) {
  let openedTaskDescription = document.getElementById('openedTaskDescription')
  if (task.description === "") {
    openedTaskDescription.innerHTML = `No Description`;
  } else {
    openedTaskDescription.innerHTML = `${task.description}`;
  }
}

function checkforOpenedTitle(task) {
  let openedTaskTitle = document.getElementById('openedTaskTitle')
  if (task.title === "") {
    openedTaskTitle.innerHTML = `No Title`;
  } else {
    openedTaskTitle.innerHTML = `${task.title}`;
  }
}

function renderOpenTaskAssignedContacts(task) {
  let openedAssignedContacts = document.getElementById('openedAssignedContacts');
  console.log('Rendering open task assigned contacts');
  
  openedAssignedContacts.innerHTML = '';

  if (!task.assignedContacts || task.assignedContacts.length === 0) {
    openedAssignedContacts.innerHTML = 'No contacts assigned';
    
    return;
  }
  let contactsHTML = '';
  const validContacts = task.assignedContacts
    .filter(assignedContact => 
      contacts.some(contact => contact.name === assignedContact.name)
    );

  console.log('Valid contacts:', validContacts);

  if (validContacts.length === 0) {
    openedAssignedContacts.innerHTML = 'No valid contacts assigned';
    return;
  }

  for (let x = 0; x < validContacts.length; x++) {
    let contactName = validContacts[x].name;
    const initials = validContacts[x].initials;
    const color = validContacts[x].color;
    contactsHTML += returnOpenTaskAssignedContactsHTML(contactName, color, initials);
  }

  openedAssignedContacts.innerHTML = contactsHTML;
}

function renderOpenTaskSubtasks(task) {
  let openedSubtasksArea = document.getElementById('openedSubtasks');
  openedSubtasksArea.innerHTML = ''; // Clear existing subtasks
  if (!task.subtasks || task.subtasks.length === 0) {
    openedSubtasksArea.innerHTML = 'No Subtasks';
  } else {
    let subtasksHTML = '';
    for (let subtaskIndex = 0; subtaskIndex < task.subtasks.length; subtaskIndex++) {
      let subtask = task.subtasks[subtaskIndex];
      subtasksHTML += returnOpenTaskSubtaskHTML(task.id, subtaskIndex, subtask);
    }
    openedSubtasksArea.innerHTML = subtasksHTML;
  }
}

async function setSubtaskCompleted(taskId, subtaskIndex, completed) {
  let task = tasks.find(t => t.id === taskId);
  if (task) {
    task.subtasks[subtaskIndex].completed = completed;
    await updateTaskInFirebase(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  } else {
    console.error(`Task with id ${taskId} not found`);
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${BASE_URL}${taskId}.json`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    tasks.splice(taskIndex, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    console.log('Task deleted successfully:', taskId);
    closeOpenedTask();
  } catch (error) {
    console.error('There was a problem with the delete operation:', error);
  }
}