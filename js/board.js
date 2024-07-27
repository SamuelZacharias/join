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
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    console.log('Loaded tasks:', tasks);
    renderToDoTasks();
}





function renderToDoTasks() {
    let toDoColumn = document.getElementById('toDo');
    const tasksWithToDo = tasks.filter(task => task.column === 'toDo');
    toDoColumn.innerHTML = '';
    tasksWithToDo.forEach((task, i) => {
        toDoColumn.innerHTML += `
            <div draggable="true" class="taskCard" id="taskCard${i}">
                <span id="taskCategory${i}" class="taskCategory">${task.category || 'No Category'}</span>
                <div class="taskInfo">
                    <div class="taskTitle">${task.title || 'No Title'}</div>
                    <div id="taskDescription${i}" class="taskDescription">${task.description || 'No Description'}</div>
                </div>
                <div class="contactsPrioArea">
                    <div class="taskContacts" id="contacts${i}">
                    </div>
                    <div id="priority${i}"></div>
                </div>
            </div>
        `;
        categoryColor(i, task)
        renderPriority(i)
    });
    
}



function categoryColor(i, task) {
    const categoryElement = document.getElementById(`taskCategory${i}`);
    if (task.category === 'User Task') {
        categoryElement.classList.add('userTask');
    } else if (task.category === 'Technical task') {
        categoryElement.classList.add('technicalTask');
    }
}

function taskDescriptionLength(i) {
    const descriptionElement = document.getElementById(`taskDescription${i}`);
    if (descriptionElement.textContent.length > 100) {
        descriptionElement.textContent = `${descriptionElement.textContent.slice(0, 100)}...`;
    }
}

function renderPriority(i) {
    const priorityElement = document.getElementById(`priority${i}`);
    
    if (tasks[i].priority === 'Low') {
        priorityElement.innerHTML = `<img src="./assets/img/svg/low.svg" alt="Low Priority">`;
    }
    if (tasks[i].priority === 'Medium') {
        priorityElement.innerHTML = `<img src="./assets/img/png/mediumColor.png" alt="Low Priority">`;
    } 
    if (tasks[i].priority === 'Urgent') {
        priorityElement.innerHTML = `<img src="./assets/img/svg/urgent.svg" alt="Low Priority">`;
    } 
     
}
