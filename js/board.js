// Global task arrays
const toDoTasks = [];
const inProgressTasks = [];
const awaitFeedbackTasks = [];
const doneTasks = [];

// Base URL for fetching tasks
const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

// Function to fetch tasks from the database
async function getTasksFromDataBase() {
    try {
        const response = await fetch(BASE_URL + '.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseAsJson = await response.json();
        console.log('Tasks fetched from database:', responseAsJson);

        // Clear global arrays before populating
        toDoTasks.length = 0;
        inProgressTasks.length = 0;
        awaitFeedbackTasks.length = 0;
        doneTasks.length = 0;

        // Transform the object into an array
        const tasksArray = Object.values(responseAsJson);

        console.log('Tasks array:', tasksArray);

        tasksArray.forEach(task => {
            if (task.column) {
                console.log('Processing task:', task);

                switch (task.column.trim()) {
                    case 'toDo':
                        toDoTasks.push(task);
                        break;
                    case 'inProgress':
                        inProgressTasks.push(task);
                        break;
                    case 'awaitingFeedback':
                        awaitFeedbackTasks.push(task);
                        break;
                    case 'done':
                        doneTasks.push(task);
                        break;
                    default:
                        console.warn('Unknown column for task:', task);
                }
            } else {
                console.warn('Task does not have a column property:', task);
            }
        });

        console.log('toDoTasks:', toDoTasks);
        console.log('inProgressTasks:', inProgressTasks);
        console.log('awaitFeedbackTasks:', awaitFeedbackTasks);
        console.log('doneTasks:', doneTasks);

        localStorage.setItem('toDoTasks', JSON.stringify(toDoTasks));
        localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
        localStorage.setItem('awaitFeedbackTasks', JSON.stringify(awaitFeedbackTasks));
        localStorage.setItem('doneTasks', JSON.stringify(doneTasks));
        
        renderTasks();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        loadTasksFromLocalStorage();
    }
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const toDoTasksFromStorage = JSON.parse(localStorage.getItem('toDoTasks')) || [];
    const inProgressTasksFromStorage = JSON.parse(localStorage.getItem('inProgressTasks')) || [];
    const awaitFeedbackTasksFromStorage = JSON.parse(localStorage.getItem('awaitFeedbackTasks')) || [];
    const doneTasksFromStorage = JSON.parse(localStorage.getItem('doneTasks')) || [];

    toDoTasks.length = 0;
    inProgressTasks.length = 0;
    awaitFeedbackTasks.length = 0;
    doneTasks.length = 0;

    toDoTasks.push(...toDoTasksFromStorage);
    inProgressTasks.push(...inProgressTasksFromStorage);
    awaitFeedbackTasks.push(...awaitFeedbackTasksFromStorage);
    doneTasks.push(...doneTasksFromStorage);

    console.log('Loaded toDoTasks:', toDoTasks);
    console.log('Loaded inProgressTasks:', inProgressTasks);
    console.log('Loaded awaitFeedbackTasks:', awaitFeedbackTasks);
    console.log('Loaded doneTasks:', doneTasks);

    renderTasks();
}

// Function to render tasks
function renderTasks() {
    const columns = {
        toDo: document.getElementById('toDo'),
        inProgress: document.getElementById('inProgress'),
        awaitFeedback: document.getElementById('awaitFeedback'),
        done: document.getElementById('done')
    };

    if (!columns.toDo || !columns.inProgress || !columns.awaitFeedback || !columns.done) {
        console.error('One or more task columns are missing in the HTML.');
        return;
    }

    columns.toDo.innerHTML = '';
    columns.inProgress.innerHTML = '';
    columns.awaitFeedback.innerHTML = '';
    columns.done.innerHTML = '';

    renderTaskList(toDoTasks, columns.toDo);
    renderTaskList(inProgressTasks, columns.inProgress);
    renderTaskList(awaitFeedbackTasks, columns.awaitFeedback);
    renderTaskList(doneTasks, columns.done);
}

// Function to render a list of tasks
function renderTaskList(tasks, area) {
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
        tasks.forEach((task, i) => {
            area.innerHTML += `
                <div draggable="true" class="taskCard" id="taskCard${i}">
                    <span id="taskCategory${i}" class="taskCategory">${task.category}</span>
                    <div class="taskInfo">
                        <div class="taskTitle">${task.title}</div>
                        <div id="taskDescription${i}" class="taskDescription">${task.description}</div>
                    </div>
                    <div id="taskContainer${i}">
                        <div class="task">
                            <div class="progress-bar" id="progressBarContainer${i}">
                                <div class="progress-bar-fill" id="progressBarFill${i}"></div>
                            </div>
                            <span id="subtaskStatus${i}"></span>
                        </div>
                    </div>
                    <div class="contactsPrioArea">
                        <div class="taskContacts" id="contacts${i}"></div>
                        <div id="priority${i}"></div>
                    </div>
                </div>
            `;
            renderSubtasks(i, task);
            categoryColor(i, task);
            taskDescriptionLength(i);
            renderContacts(i, task);
            renderPriority(i, task); // Add this line to call renderPriority
        });
    } else {
        area.innerHTML = '<div class="noTask">No tasks available</div>';
    }
}

// Function to render subtasks
function renderSubtasks(i, task) {
    let progressBarContainer = document.getElementById(`progressBarContainer${i}`);
    let progressBarFill = document.getElementById(`progressBarFill${i}`);
    let subtaskStatus = document.getElementById(`subtaskStatus${i}`);
    if (task.subtasks && Array.isArray(task.subtasks)) {
        const totalSubtasks = task.subtasks.length;
        const completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const percentage = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;
        progressBarFill.style.width = `${percentage}%`;
        subtaskStatus.textContent = `${completedSubtasks}/${totalSubtasks} subtasks completed`;
    }
}

// Function to set category color
function categoryColor(i, task) {
  const categoryElement = document.getElementById(`taskCategory${i}`);

  if (task.category === 'User Task') {
      categoryElement.classList.add('userTask');
  }  if (task.category === 'Technical task') {
      categoryElement.classList.add('technicalTask');
  } 
}

// Function to show/hide task description based on length
function taskDescriptionLength(i) {
    const descriptionElement = document.getElementById(`taskDescription${i}`);
    if (descriptionElement.textContent.length > 100) {
        descriptionElement.textContent = `${descriptionElement.textContent.slice(0, 100)}...`;
    }
}

// Function to render contacts
function renderContacts(i, task) {
    const taskContacts = document.getElementById(`contacts${i}`);
    if (task.contacts && Array.isArray(task.contacts)) {
        task.contacts.forEach(contact => {
            createContactElement(contact, taskContacts);
        });
    }
}

// Function to create contact element
function createContactElement(contact, taskContacts) {
    const contactElement = document.createElement('div');
    const initials = getInitials(contact.name);
    const color = getColorForContact(initials);

    contactElement.className = 'contact';
    contactElement.style.backgroundColor = color;
    contactElement.textContent = initials;
    taskContacts.appendChild(contactElement);
}

// Function to get initials from a full name
function getInitials(fullName) {
    const names = fullName.split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
}

// Function to get color for a contact based on initials
const contactInitialColors = {};
const availableColors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

function getColorForContact(initials) {
    if (contactInitialColors[initials]) {
        return contactInitialColors[initials];
    }
    if (availableColors.length === 0) {
        console.warn('No more colors available');
        return '#FFFFFF'; // Default color if no colors are left
    }
    const color = availableColors.splice(Math.floor(Math.random() * availableColors.length), 1)[0];
    contactInitialColors[initials] = color;
    return color;
}

// Function to render priority (added this function)
function renderPriority(i, task) {
    const priorityElement = document.getElementById(`priority${i}`);
    if (task.priority === 'Low') {
        priorityElement.innerHTML = `<img src="./assets/img/svg/low.svg">`;
    } 
    if (task.priority === 'medium') {
      priorityElement.innerHTML = `<img src="./assets/img/svg/medium.svg">`;
  } 
}

// Function to update task status
function updateTaskStatus(taskCard, columnId) {
    const taskIndex = parseInt(taskCard.id.replace('taskCard', ''), 10); // Parse the task index
    let task;
    
    switch (columnId) {
        case 'toDo':
            task = toDoTasks[taskIndex];
            break;
        case 'inProgress':
            task = inProgressTasks[taskIndex];
            break;
        case 'awaitFeedback':
            task = awaitFeedbackTasks[taskIndex];
            break;
        case 'done':
            task = doneTasks[taskIndex];
            break;
        default:
            console.warn('Unknown column ID:', columnId);
    }

    if (task) {
        task.column = columnId;

        localStorage.setItem('toDoTasks', JSON.stringify(toDoTasks));
        localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
        localStorage.setItem('awaitFeedbackTasks', JSON.stringify(awaitFeedbackTasks));
        localStorage.setItem('doneTasks', JSON.stringify(doneTasks));

        renderTasks();
    }
}

// Event listeners for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    getTasksFromDataBase(); // Load tasks from the database

    // Select the task columns by their specific IDs
    const columns = {
        toDo: document.getElementById('toDo'),
        inProgress: document.getElementById('inProgress'),
        awaitFeedback: document.getElementById('awaitFeedback'),
        done: document.getElementById('done')
    };

    // Add event listeners to each task column
    Object.values(columns).forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const taskId = e.dataTransfer.getData('text/plain');
            const taskCard = document.getElementById(taskId);

        });
    });

    // Add dragstart event listener to each task card
    document.querySelectorAll('.taskCard').forEach(taskCard => {
        taskCard.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
        });
    });
});