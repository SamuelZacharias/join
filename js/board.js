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
        const tasksArray = Object.values(responseAsJson);
        tasks.push(...tasksArray);

        console.log('Tasks array:', tasks);

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
function renderTasks() {
    // Clear existing columns
    document.getElementById('toDo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';

    // Render tasks into respective columns
    tasks.forEach((task, i) => {
        let columnElement = document.getElementById(task.column);
        if (columnElement) {
            const taskHtml = returnRenderHtml(i, task);
            columnElement.innerHTML += taskHtml;
            categoryColor(i, task);
            renderPriority(i);
        }
    });
}

// Function to generate HTML for a task
function returnRenderHtml(i, task) {
    return `
    <div draggable="true" class="taskCard" id="taskCard${i}" ondragstart="drag(event)">
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

// Function to handle drag start
function drag(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Function to handle drop event
function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    const targetColumnId = event.target.closest('.taskColumn').id;

    if (taskElement && targetColumnId) {
        const taskIndex = parseInt(taskId.replace('taskCard', ''));
        const task = tasks[taskIndex];
        if (task) {
            task.column = targetColumnId;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
    }
}

// Allow drop operation
function allowDrop(event) {
    event.preventDefault();
}