function collectDataEdit(taskId) {
  const task = getTaskById(taskId);
  if (!task) {
      console.error('Task not found.');
      return null;
  }

  const formData = collectFormData();
  const priority = determinePriority();
  const assignedContacts = getAssignedContacts();
  const subtasks = collectSubtasks();

  const updatedTask = createUpdatedTask(task, formData, priority, assignedContacts, subtasks);
  saveTask(updatedTask, taskId);
  updateTaskInFirebaseAndUI(updatedTask);

  return updatedTask;
}

function collectFormData() {
  const title = document.getElementById('editTitle').querySelector('input').value;
  const description = document.getElementById('taskDescriptionTextarea').value;
  const dueDate = document.getElementById('dateValue').value;
  console.log('Collected data:', { title, description, dueDate });
  return { title, description, dueDate };
}

function determinePriority() {
  const priorityButtons = document.querySelectorAll('#editPriorityButtons .prioButton');
  let priority = '';
  priorityButtons.forEach(button => {
      if (button.classList.contains('urgent')) {
          priority = 'Urgent';
      } else if (button.classList.contains('medium')) {
          priority = 'Medium';
      } else if (button.classList.contains('low')) {
          priority = 'Low';
      }
  });
  console.log('Priority:', priority);
  return priority;
}

function getAssignedContacts() {
  return currentTaskBeingEdited.assignedContacts || [];
}

function collectSubtasks() {
  const subtasks = subtaskInfos.map(subtask => ({
      title: subtask.title,
      completed: subtask.completed
  }));
  console.log('Collected subtasks:', subtasks);
  return subtasks;
}

function createUpdatedTask(task, formData, priority, assignedContacts, subtasks) {
  return {
      ...task,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority,
      assignedContacts,
      subtasks
  };
}

function saveTask(updatedTask, taskId) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      console.log('Task updated in localStorage.');
  } else {
      console.warn('Task not found in localStorage.');
  }
  
}

function closeEdit(){
  document.getElementById('editTaskContainer').classList.add('d-none')
  switchButton('Medium')
}

function getTaskById(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  return tasks.find(task => task.id === taskId);
}