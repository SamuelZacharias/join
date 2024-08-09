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
    const renderedContacts = document.getElementById(`contacts${i}`);
    if (!renderedContacts) return;

    renderedContacts.innerHTML = '';
    const assignedContacts = tasks[i].assignedContacts || [];
    const validContacts = assignedContacts
        .map(c => c.name)
        .filter(name => contacts.some(c => c.name === name));

    validContacts.slice(0, 5).forEach(name => {
        const contact = contacts.find(c => c.name === name);
        if (contact) {
            const { initials, color = '#000' } = contact;
            renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: ${color};">${initials}</div>`;
        }
    });

    if (validContacts.length > 5) {
        const additionalContacts = validContacts.length - 5;
        renderedContacts.innerHTML += `<div class="assignedTaskContacts" style="background-color: gray;">+${additionalContacts}</div>`;
    }
}


function renderSubtasks(i) {
    const subtaskArea = document.getElementById(`subtaskArea${i}`);
    if (!subtaskArea) return console.error(`Subtask area not found for task index ${i}`);

    let progressBar = subtaskArea.querySelector('.progress-bar');
    let progressBarFill = subtaskArea.querySelector('.progress-bar-fill');
    let subtaskProgressText = subtaskArea.querySelector('.subtaskProgressText');

    if (!progressBar) {
        subtaskArea.innerHTML += `<div class='progress-bar'><div class='progress-bar-fill'></div></div><div class='subtaskProgressText'></div>`;
        progressBar = subtaskArea.querySelector('.progress-bar');
        progressBarFill = subtaskArea.querySelector('.progress-bar-fill');
        subtaskProgressText = subtaskArea.querySelector('.subtaskProgressText');
    }

    const subtasks = tasks[i].subtasks || [];
    const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
    const progress = (completedSubtasks / subtasks.length) * 100;

    progressBarFill.style.width = `${progress}%`;
    progressBar.style.display = subtasks.length ? 'flex' : 'none';
    subtaskProgressText.textContent = `${completedSubtasks}/${subtasks.length} Subtasks`;
    subtaskProgressText.style.display = subtasks.length ? 'flex' : 'none';
    subtaskArea.style.display = subtasks.length ? 'flex' : 'none';
}