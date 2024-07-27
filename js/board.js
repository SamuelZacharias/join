const tasks = [];

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

        // Clear global array before populating
        tasks.length = 0;

        // Transform the object into an array
        const tasksArray = Object.keys(responseAsJson).map(key => ({ id: key, ...responseAsJson[key] }));
        tasks.push(...tasksArray);

        console.log('Tasks array:', tasks);

        // Assign colors to contacts
        assignContactColors();

        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        loadTasksFromLocalStorage();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks.length = 0;  // Clear the current tasks
        tasks.push(...savedTasks);
    }
    console.log('Loaded tasks:', tasks);
    renderTasks();  // Render all tasks
}

// Function to render tasks based on their column
// Function to render tasks based on their column
function renderTasks() {
    const columns = ['toDo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(columnId => {
        const columnElement = document.getElementById(columnId);
        if (columnElement) {
            columnElement.innerHTML = '';
        }
    });

    tasks.forEach((task, i) => {
        const columnElement = document.getElementById(task.column);
        if (columnElement) {
            const taskHtml = returnRenderHtml(i, task);
            columnElement.innerHTML += taskHtml;
            categoryColor(i, task);
            renderPriority(i);
            renderContacts(i);
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

// Function to generate HTML for a task
function returnRenderHtml(i, task) {
    return `
    <div draggable="true" class="taskCard" id="taskCard${i}" ondragstart="drag(event)" ondragend="dragEnd(event)"onmousedown="mouseHold(event)" onmouseup="mouseRelease(event)" onmouseleave="mouseLeave(event)">
        <span id="taskCategory${i}" class="taskCategory">${task.category}</span>
        <div class="taskInfo">
            <div class="taskTitle">${task.title || 'No Title'}</div>
            <div id="taskDescription${i}" class="taskDescription">${task.description || 'No Description'}</div>
        </div>
        <div class="contactsPrioArea">
            <div class="taskContacts" id="contacts${i}"></div>
            <div id="priority${i}"></div>
        </div>
    </div>
    `;
}

// Function to set category color
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

// Function to set task priority
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
        renderedContacts.innerHTML = ''; // Clear any existing contacts
        const contacts = tasks[i].assignedContacts;
        const contactColorsAssignment = JSON.parse(localStorage.getItem('contactColorsAssignment')) || {};

        if (contacts && contacts.length > 0) {
            const maxContactsToShow = 5;
            for (let c = 0; c < Math.min(contacts.length, maxContactsToShow); c++) {
                const initials = getInitials(contacts[c]);
                const color = contactColorsAssignment[contacts[c]] || '#000'; // Default to black if no color assigned
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
    "#FF4646",
    "#FFE62B",
    "#FFBB2B",
    "#C3FF2B",
    "#0038FF",
    "#FFC701",
    "#FC71FF",
    "#FFA35E",
    "#FF745E",
    "#9327FF",
    "#00BEE8",
    "#1FD7C1",
    "#6E52FF",
    "#FF5EB3",
    "#FF7A00"
  ];
  function assignContactColors() {
    let contactColorsAssignment = JSON.parse(localStorage.getItem('contactColorsAssignment')) || {};
    let assignedColors = Object.values(contactColorsAssignment);
    let colorIndex = 0;

    tasks.forEach(task => {
        if (task.assignedContacts && task.assignedContacts.length > 0) {
            task.assignedContacts.forEach(contact => {
                if (!contactColorsAssignment[contact]) {
                    contactColorsAssignment[contact] = contactColors[colorIndex];
                    colorIndex = (colorIndex + 1) % contactColors.length;
                }
            });
        }
    });

    localStorage.setItem('contactColorsAssignment', JSON.stringify(contactColorsAssignment));
}

function getInitials(name) {
    const nameParts = name.split(' ');
    let initials = '';
    for (let part of nameParts) {
        if (part.length > 0 && initials.length < 2) { // Limit initials to 2 characters
            initials += part[0].toUpperCase();
        }
    }
    return initials;
}












// Function to handle drag start
function drag(event) {
    const taskId = event.target.id;
    const taskElement = document.getElementById(taskId);
    taskElement.classList.add('taskCardClickHold');
    event.dataTransfer.setData('text/plain', taskId);
}

// Function to handle drop event
async function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    const targetColumnId = event.target.closest('.taskColumn').id;

    console.log('Drop event:', { taskId, targetColumnId, taskElement });

    if (taskElement && targetColumnId) {
        const taskIndex = parseInt(taskId.replace('taskCard', ''));
        const task = tasks[taskIndex];
        console.log('Task being moved:', task);

        if (task) {
            task.column = targetColumnId;
            await updateTaskInFirebase(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        } else {
            console.error('Task not found in tasks array:', { taskIndex, tasks });
        }
    } else {
        console.error('Task element or target column not found:', { taskElement, targetColumnId });
    }

    // Remove the class after dropping
    if (taskElement) {
        taskElement.classList.remove('taskCardClickHold');
    }
}
function drag(event) {
    const taskId = event.target.id;
    const taskElement = document.getElementById(taskId);
    taskElement.classList.add('taskCardClickHold');
    event.dataTransfer.setData('text/plain', taskId);
}

function dragEnd(event) {
    const taskId = event.target.id;
    const taskElement = document.getElementById(taskId);
    taskElement.classList.remove('taskCardClickHold');

    // Remove the columnDragTo class from all columns
    document.querySelectorAll('.taskColumn').forEach(column => {
        column.classList.remove('columnDragTo');
    });
}
function mouseHold(event) {
    const taskCard = event.currentTarget;
    taskCard.classList.add('taskCardClickHold');
}

// Function to handle mouse release
function mouseRelease(event) {
    const taskCard = event.currentTarget;
    taskCard.classList.remove('taskCardClickHold');
}

// Function to handle mouse leave
function mouseLeave(event) {
    const taskCard = event.currentTarget;
    taskCard.classList.remove('taskCardClickHold');
}
function dragEnter(event) {
    event.preventDefault();
    const column = event.currentTarget;
    column.classList.add('columnDragTo');
}
function dragLeave(event) {
    const column = event.currentTarget;
    column.classList.remove('columnDragTo');
}

async function updateTaskInFirebase(task) {
    try {
        const taskId = task.id;  // Assuming each task has a unique `id` property
        const response = await fetch(`${BASE_URL}${taskId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const updatedTask = await response.json();
        console.log('Task updated in Firebase:', updatedTask);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Allow drop operation
function allowDrop(event) {
    event.preventDefault();
}


