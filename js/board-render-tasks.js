function renderTasks(tasksToRender = tasks) {
  loadTasksFromLocalStorage()
  const columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
  columns.forEach(columnId => {
      const columnElement = document.getElementById(columnId);
      if (columnElement) {
          columnElement.innerHTML = '';
      }
  });

  tasksToRender.forEach((task, i) => {
      const columnElement = document.getElementById(task.column);
      if (columnElement) {
          const taskHtml = returnRenderHtml(i, task);
          columnElement.innerHTML += taskHtml;
          categoryColor(i, task);
          renderPriority(i);
          renderContacts(i);
          renderSubtasks(i);
      }
  });

  columns.forEach(columnId => {
      const columnElement = document.getElementById(columnId);
      if (columnElement) {
          const noTaskMessage = columnElement.querySelector('.noTask');
          if (columnElement.querySelectorAll('.taskCard').length === 0) {
              if (!noTaskMessage) {
                  const messageHtml = `<div class="noTask">No tasks in ${columnId.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>`;
                  columnElement.innerHTML += messageHtml;
              }
          } else {
              if (noTaskMessage) {
                  noTaskMessage.remove();
              }
          }
      }
  });
}






function categoryColor(i, task) {
  const categoryElement = document.getElementById(`taskCategory${i}`);
  if (categoryElement) {
      if (task.category === 'User Task') {
          categoryElement.classList.add('userTask');
      } else if (task.category === 'Technical task') {
          categoryElement.classList.add('technicalTask');
      }
  }
}


function renderPriority(i) {
  const priorityElement = document.getElementById(`priority${i}`);
  if (priorityElement) {
      if (tasks[i].priority === 'Low') {
          priorityElement.innerHTML = `<img src="./assets/img/svg/low.svg" alt="Low Priority">`;
      }
      if (tasks[i].priority === 'Medium') {
          priorityElement.innerHTML = `<img src="./assets/img/png/mediumColor.png" alt="Medium Priority">`;
      }
      if (tasks[i].priority === 'Urgent') {
          priorityElement.innerHTML = `<img src="./assets/img/svg/urgent.svg" alt="Urgent Priority">`;
      }
  }
}


function renderContacts(i) {
  let renderedContacts = document.getElementById(`contacts${i}`);
  if (renderedContacts) {
      renderedContacts.innerHTML = ''; 
      const contacts = tasks[i].assignedContacts;
      const contactColorsAssignment = JSON.parse(localStorage.getItem('contactColorsAssignment')) || {};

      if (contacts && contacts.length > 0) {
          const maxContactsToShow = 5;
          for (let c = 0; c < Math.min(contacts.length, maxContactsToShow); c++) {
              const initials = getInitials(contacts[c]);
              const color = contactColorsAssignment[contacts[c]] || '#000'; 
              renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: ${color};">${initials}</div>`;
          }
          if (contacts.length > maxContactsToShow) {
              const additionalContacts = contacts.length - maxContactsToShow;
              renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: gray;">+${additionalContacts}</div>`;
          }
      } else {
          renderedContacts.innerHTML = '';
      }
  }
}

let contactColors = [
  "#FF4646","#FFE62B","#FFBB2B","#C3FF2B","#0038FF","#FFC701","#FC71FF","#FFA35E","#FF745E","#9327FF","#00BEE8","#1FD7C1","#6E52FF","#FF5EB3","#FF7A00"
];
function assignColors() {
  // Access the first object in the contacts array
  let contactsArray = contacts[0];

  // Loop through the firstname array
  for (let i = 0; i < contactsArray.firstname.length; i++) {
    // Construct the full name from the firstname and lastname arrays
    let fullName = contactsArray.firstname[i] + " " + contactsArray.lastname[i];
    
    // Assign a random color from contactColors to the full name
    contactInitialColors[fullName] = contactColors[Math.floor(Math.random() * contactColors.length)];
  }
}

function getInitials(name) {
  const nameParts = name.split(' ');
  let initials = '';
  for (let part of nameParts) {
      if (part.length > 0 && initials.length < 2) { 
          initials += part[0].toUpperCase();
      }
  }
  return initials;
}


function renderSubtasks(i) {
  const subtaskArea = document.getElementById(`subtaskArea${i}`);
  if (!subtaskArea) {
      console.error(`Subtask area not found for task index ${i}`);
      return;
  }

  let progressBar = subtaskArea.querySelector('.progress-bar');
  let progressBarFill = subtaskArea.querySelector('.progress-bar-fill');
  let subtaskProgressText = subtaskArea.querySelector('.subtaskProgressText');

  if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      subtaskArea.appendChild(progressBar);

      progressBarFill = document.createElement('div');
      progressBarFill.className = 'progress-bar-fill';
      progressBar.appendChild(progressBarFill);

      subtaskProgressText = document.createElement('div');
      subtaskProgressText.className = 'subtaskProgressText';
      subtaskArea.appendChild(subtaskProgressText);
  }

  const subtasks = tasks[i].subtasks;

  if (!subtasks || subtasks.length === 0) {
      subtaskArea.style.display = 'none';
      return;
  }
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = subtasks.length;
  const progress = (completedSubtasks / totalSubtasks) * 100;
  console.log(`Task ${i}: ${completedSubtasks}/${totalSubtasks} subtasks completed`);
  console.log(`Progress: ${progress}%`);
  progressBarFill.style.width = `${progress}%`;
  progressBar.style.display = totalSubtasks > 0 ? 'flex' : 'none';
  subtaskProgressText.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  subtaskProgressText.style.display = totalSubtasks > 0 ? 'flex' : 'none';
  subtaskArea.style.display = totalSubtasks > 0 ? 'flex' : 'none';
}