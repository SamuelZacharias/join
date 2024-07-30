const tasks = [];
const contacts = []

const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';


async function getTasksFromDataBase() {
    try {
        const response = await fetch(BASE_URL + '.json');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const responseAsJson = await response.json();
        console.log('Tasks fetched from database:', responseAsJson);

       
        tasks.length = 0;

        
        const tasksArray = Object.keys(responseAsJson).map(key => ({ id: key, ...responseAsJson[key] }));
        tasks.push(...tasksArray);

        console.log('Tasks array:', tasks);

        
        

        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        loadTasksFromLocalStorage();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


function loadTasksFromLocalStorage() {
    const savedContacts = JSON.parse(localStorage.getItem('contactsCanBeAssigned'))

    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks || contacts) {
        contacts.length = 0;
        contacts.push(savedContacts);
        tasks.length = 0;  
        tasks.push(...savedTasks);
    }
    console.log('Loaded tasks:', tasks);
    renderTasks(); 
     
}


function renderTasks(tasksToRender = tasks) {
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



function returnRenderHtml(i, task) {
    return `
    <div draggable="true" class="taskCard" id="taskCard${i}" ondragstart="drag(event)" ondragend="dragEnd(event)" onmousedown="mouseHold(event)" onmouseup="mouseRelease(event)" onmouseleave="mouseLeave(event)" onclick="openTask(${i}, tasks[${i}])">
        <span id="taskCategory${i}" class="taskCategory">${task.category}</span>
        <div class="taskInfo">
            <div class="taskTitle">${task.title || 'No Title'}</div>
            <div id="taskDescription${i}" class="taskDescription">${task.description || 'No Description'}</div>
        </div>
        <div id="subtaskArea${i}" class="subtaskArea">
            <div class="progress-bar" style="display: none;">
                <div id="progressBarFill${i}" class="progress-bar-fill"></div>
            </div>
            <div id="subtaskProgressText${i}" class="subtaskProgressText" style="display: none;"></div>
        </div>
        <div class="contactsPrioArea">
            <div class="taskContacts" id="contacts${i}"></div>
            <div id="priority${i}"></div>
        </div>
    </div>
    `;
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


async function setSubtaskCompleted(taskIndex, subtaskIndex, completed) {
    tasks[taskIndex].subtasks[subtaskIndex].completed = completed;
    await updateTaskInFirebase(tasks[taskIndex]);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}


function filterTasks() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchInput) || task.description.toLowerCase().includes(searchInput);
    });
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    renderTasks(filteredTasks);
}



function drag(event) {
    const taskId = event.target.id;
    const taskElement = document.getElementById(taskId);
    taskElement.classList.add('taskCardClickHold');
    event.dataTransfer.setData('text/plain', taskId);
}


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

    
    if (taskElement) {
        taskElement.classList.remove('taskCardClickHold');
    }
}

function allowDrop(event) {
    event.preventDefault();
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

    
    document.querySelectorAll('.taskColumn').forEach(column => {
        column.classList.remove('columnDragTo');
    });
}
function mouseHold(event) {
    const taskCard = event.currentTarget;
    taskCard.classList.add('taskCardClickHold');
}


function mouseRelease(event) {
    const taskCard = event.currentTarget;
    taskCard.classList.remove('taskCardClickHold');
}


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
        const taskId = task.id;  
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





function openTask(i, task) {
    let openedTaskContainer = document.getElementById('openedTaskContainer');
    openedTaskContainer.classList.remove('d-none');
    openedTaskContainer.innerHTML = `
        <div class="openedTask" id="openedTask"></div>
    `;
    document.getElementById('openedTask').innerHTML = `
        <div class="taskDetails">
            <div class="openedTaskCategory">
                <span>${task.category}</span>
                <img class="openedTaskClose" src="/assets/img/png/openedTaskClose.png" onclick="closeOpenedTask()">
            </div>
            <h1>${task.title}</h1>
            <p>${task.description}</p>
            <div>Due date: ${task.dueDate}</div>
            <div>Priority: ${task.priority}</div>
            <div>
             <div style="margin-bottom:10px;">Assigned To:</div>
             <div id="openedAssignedContacts" class="openedAssigendContactsArea"> </div>
            </div>
            <div>   
                <div>Subtasks:</div>
                <div id="openedSubtasks"></div> 
            </div>
            <div class="deleteEditArea">
                <div onclick="deleteTask(${i})"  class="delete"><img src="/assets/img/png/delete.png" > Delete</div>
                <div onclick="editTask(${i})" class="edit"><img src="/assets/img/png/editOpen.png"> Edit</div>
            </div>
        </div>
    `;
    renderOpenTaskAssignedContacts(task)
    renderOpenTaskSubtasks(task)
}

function renderOpenTaskAssignedContacts(task) {
    let openedAssignedContacts = document.getElementById('openedAssignedContacts');
    openedAssignedContacts.innerHTML = '';
   
    if (!task.assignedContacts || task.assignedContacts.length === 0) {
        openedAssignedContacts.innerHTML = 'No contacts assigned';
    } else {
        const contactColorsAssignment = JSON.parse(localStorage.getItem('contactColorsAssignment')) || {};
        
        for (let x = 0; x < task.assignedContacts.length; x++) {
            let contactName = task.assignedContacts[x];
            const initials = getInitials(contactName);
            const color = contactColorsAssignment[contactName] || '#000';

            openedAssignedContacts.innerHTML += `
            <div class="openedAssigendContacts">
                <div class="openedAssigendContactsInitials" style="background-color: ${color}; ">
                    ${initials}
                </div>
                <div>${contactName}</div>
            </div>
            `;
        }
    }
}
function renderOpenTaskSubtasks(task) {
    let openedSubtasksArea = document.getElementById('openedSubtasks');
    openedSubtasksArea.innerHTML = ''; // Clear existing subtasks

    if (!task.subtasks || task.subtasks.length === 0) {
        openedSubtasksArea.innerHTML = 'No Subtasks';
    } else {
        for (let subtaskIndex = 0; subtaskIndex < task.subtasks.length; subtaskIndex++) {
            let subtask = task.subtasks[subtaskIndex];
            let isChecked = subtask.completed ? 'checked' : '';
            openedSubtasksArea.innerHTML += `
                <div class="openedSubtaskTitle">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${isChecked}
                            onclick="setSubtaskCompleted(${tasks.indexOf(task)}, ${subtaskIndex}, this.checked)">
                        <span class="checkmark"></span>
                        ${subtask.title}
                    </label>
                </div>
            `;
        }
    }
}

function closeOpenedTask(){
    document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
    document.getElementById(`editTaskContainer`).classList.add(`d-none`)
}


async function deleteTask(taskIndex) {
    try {
        const task = tasks[taskIndex];
        if (!task || !task.id) {
            throw new Error('Task not found or invalid task ID');
        }

        // Remove the task from Firebase
        const response = await fetch(`${BASE_URL}${task.id}.json`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        // Remove the task from the local tasks array
        tasks.splice(taskIndex, 1);

        // Update localStorage with the modified tasks array
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Re-render the tasks
        renderTasks();

        console.log('Task deleted successfully:', task);
        closeOpenedTask()
    } catch (error) {
        console.error('There was a problem with the delete operation:', error);
    }
}





function editTask(taskIndex) {
    document.getElementById('openedTaskContainer').classList.add('d-none');
    let editTaskContainer = document.getElementById('editTaskContainer');
    editTaskContainer.classList.remove('d-none');
    editTaskContainer.innerHTML = `
        <div class="openedTask" style="gap:24px;" id="editTask"></div>
    `;
    let task = tasks[taskIndex];
    if (!task.assignedContacts) {
        task.assignedContacts = []; // Initialize if not present
    }
    currentTaskBeingEdited = task; // Set currentTaskBeingEdited here
    renderEditHTML(task);
}

function renderEditHTML(task){
    let openedEdit = document.getElementById('editTask');
    openedEdit.innerHTML = `
        <div class="closeEditTask">
            <img class="openedTaskClose" src="/assets/img/png/openedTaskClose.png" onclick="closeOpenedTask()">
        </div>
        <div class="editTaskInfo">
            <div class="editTitle">
                <div>Title</div>
                <div class="titleInput"><input type="text" value="${task.title}"></div>
            </div>
            <div class="editTitle">
                <div>Description</div>
                <textarea id="taskDescriptionTextarea"></textarea>
            </div>
            <div class="editTitle">
                <div>Due date</div>
                <div class="titleInput"><input  type="date"></div>
            </div>
            <div class="editPriorityArea editTitle">
                <div>Priority: </div>
                <div id="editPriorityButtons">
                </div>
            </div>
            <div class="editTitle">
                <div>Assigned to:</div>
                <div class="editAssignContacts" onclick="showContactsToChoose()">
                    <div>Select contacts to assign</div>
                    <img id="dropDownImg" src="/assets/img/png/arrow_drop_down (1).png">
                </div>
                <div id="contactsToChoose"></div>
            </div>
        </div>
    `;
    checkForDescription(task)
    renderEditPriorityButtons(task)
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
    buttonsArea.innerHTML = `
        <button class="prioButton buttonhover" id="button1" onclick="switchButton('Urgent')">Urgent <img src="assets/img/svg/urgent.svg"></button>
        <button class="prioButton buttonhover" id="button2" onclick="switchButton('Medium')">Medium <img src="assets/img/png/mediumColor.png"></button>
        <button class="prioButton buttonhover" id="button3" onclick="switchButton('Low')">Low   <img src="assets/img/svg/low.svg"></button>
    `;

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
            element.classList.remove('buttonhover');
        } else {
            element.classList.remove(button.class);
            element.classList.add('buttonhover');
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
    contactsToChooseElement.innerHTML = ''; // Clear existing content

    // Access global contacts array
    const contactData = contacts[0]; // Assuming there's only one contact object in the array

    // Combine firstnames and lastnames to form full contact names
    const contactsList = contactData.firstname.map((firstname, index) => `${firstname} ${contactData.lastname[index]}`);

    // Retrieve the assigned contacts for the current task
    const task = currentTaskBeingEdited;
    const assignedContacts = task.assignedContacts || [];
    
    // Get contact colors assignment
    let contactColorsAssignment = JSON.parse(localStorage.getItem('contactColorsAssignment')) || {};

    // Assign colors to contacts if they don't already have one
    contactsList.forEach(contact => {
        if (!contactColorsAssignment[contact]) {
            const randomColor = contactColors[Math.floor(Math.random() * contactColors.length)];
            contactColorsAssignment[contact] = randomColor;
        }
    });

    // Save the updated colors assignment to localStorage
    localStorage.setItem('contactColorsAssignment', JSON.stringify(contactColorsAssignment));

    // Render the contacts list with the option to assign/unassign
    contactsList.forEach(contact => {
        const isAssigned = assignedContacts.includes(contact);
        const contactClass = isAssigned ? 'editAssignedTo' : '';
        const initials = getInitials(contact);
        const color = contactColorsAssignment[contact];

        contactsToChooseElement.innerHTML += `
            <div class="contactToChoose ${contactClass}" onclick="toggleContactAssignment('${contact}')">
                <div class="contactInitials" style="background-color: ${color};">
                    ${initials}
                </div>
                <div>${contact}</div>
            </div>
        `;
    });
}

function toggleContactAssignment(contact) {
    if (!currentTaskBeingEdited) {
        console.error('No task is currently being edited.');
        return;
    }

    const task = currentTaskBeingEdited;
    const assignedContacts = task.assignedContacts || [];
    const contactIndex = assignedContacts.indexOf(contact);

    if (contactIndex > -1) {
        // Contact is assigned, so unassign it
        assignedContacts.splice(contactIndex, 1);
    } else {
        // Contact is not assigned, so assign it
        assignedContacts.push(contact);
    }

    task.assignedContacts = assignedContacts;
    showContactsToChoose(); // Re-render the contacts list
}