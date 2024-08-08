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
      if (task.category === 'User Story') {
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
        const assignedContacts = tasks[i].assignedContacts;
  
        if (assignedContacts && assignedContacts.length > 0) {
            const maxContactsToShow = 5;
            
            const validContacts = assignedContacts
                .map(contact => contact.name)  
                .filter(contactName => {
                    const isValid = contacts.some(contact => contact.name === contactName);
                    return isValid;
                });

            for (let c = 0; c < Math.min(validContacts.length, maxContactsToShow); c++) {
                const contactName = validContacts[c];
                const contact = contacts.find(contact => contact.name === contactName);

                if (contact) {
                    const initials = contact.initials;
                    const color = contact.color || '#000';
                    renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: ${color};">${initials}</div>`;
                }
            }

            if (validContacts.length > maxContactsToShow) {
                const additionalContacts = validContacts.length - maxContactsToShow;
                console.log(`Additional contacts to display: ${additionalContacts}`);
                renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: gray;">+${additionalContacts}</div>`;
            }
        } 
    }
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