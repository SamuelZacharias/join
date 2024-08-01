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

        const tasksArray = Object.keys(responseAsJson)
            .filter(key => responseAsJson[key] !== null)
            .map(key => ({ id: key, ...responseAsJson[key] }));

        // Clear and update the tasks array
        tasks.length = 0;
        tasks.push(...tasksArray);

        console.log('Tasks array:', tasks);

        // Update local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Load tasks from local storage to ensure consistency
        renderTasks()
    } catch (error) {
        console.warn('There was a problem with the fetch operation:', error);
    }
}


function loadTasksFromLocalStorage() {
    const savedContacts = JSON.parse(localStorage.getItem('contactsCanBeAssigned')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const validTasks = savedTasks.filter(task => task !== null);

    tasks.length = 0;  
    tasks.push(...validTasks);

    contacts.length = 0;
    contacts.push(savedContacts);

    console.log('Loaded tasks:', tasks);
    
}



function filterTasks() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        return task.title.includes(searchInput) || task.description.toLowerCase().includes(searchInput);
    });
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    renderTasks(filteredTasks);
}




async function updateTaskInFirebase(task) {
    try {
        const response = await fetch(`${BASE_URL}${task.id}.json`, {
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

document.addEventListener('click', handleClickOutside);



function closeOpenedTask(){
    document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
    document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer')
    document.getElementById(`editTaskContainer`).classList.add(`d-none`)
    document.getElementById('editTaskContainer').classList.remove('openedTaskContainer')
}

function handleClickOutside(event) {
    const container = document.getElementById('openedTaskContainer');
        if(container.contains(event.target)){
        document.getElementById('openedTaskContainer').classList.add('d-none')
        
        container.classList.remove('openedTaskContainer')
        }

        const containerEdit = document.getElementById('editTaskContainer');
        if(containerEdit.contains(event.target)){
        document.getElementById('editTaskContainer').classList.add('d-none')
        
        containerEdit.classList.remove('openedTaskContainer')
        }

}
  








function editTask(taskId) {
    // Retrieve task by ID
    let task = getTaskById(taskId);
    console.log('Task to edit:', task);  // Debugging line
    if (!task) {
        console.error('Task not found.');
        return;
    }
    document.getElementById('editTaskContainer').innerHTML= `<div class="openedTask" id="editTask" onclick="event.stopPropagation()" ></div>`
    // Set the current task being edited
    currentTaskBeingEdited = task;

    // Render the edit form
    renderEditHTML(task);
}

function renderEditHTML(task) {
    console.log('Rendering edit form for task:', task); // Debugging line
    let openedEdit = document.getElementById('editTask');
    document.getElementById('editTaskContainer').classList.remove('d-none')
    document.getElementById('editTaskContainer').classList.add('openedTaskContainer')
    openedEdit.innerHTML = `
        <div class="closeEditTask" >
            <img class="openedTaskClose" src="/assets/img/png/openedTaskClose.png" onclick="closeEdit()">
        </div>
        <div class="editTaskInfo">
            <div class="editTitle">
                <div>Title</div>
                <div id="editTitle" class="titleInput"><input type="text" value="${task.title}"></div>
            </div>
            <div class="editTitle">
                <div>Description</div>
                <textarea id="taskDescriptionTextarea">${task.description || ''}</textarea>
            </div>
            <div class="editTitle">
                <div>Due date</div>
                <div class="titleInput"><input id="dateValue" type="date" value="${task.dueDate || ''}"></div>
            </div>
            <div class="editPriorityArea editTitle">
                <div>Priority: </div>
                <div id="editPriorityButtons"></div>
            </div>
            <div class="editTitle">
                <div>Assigned to:</div>
                <div class="editAssignContacts" onclick="closeContactsDropdown()">
                    <div>Select contacts to assign</div>
                    <img id="dropDownImg" src="/assets/img/png/arrow_drop_down (1).png">
                </div>
                <div id="contactsToChoose" class="d-none contactsToChoose"></div>
            </div>
            <div class="editTitle">
                <div>Subtasks:</div>
                <div class="editAssignContacts" id="editSubtasks"></div>
                <div id="newSubtasks"></div>
            </div>
        </div>
        <div class="editOkay" id="editOkay" onclick="collectData('${task.id}')"><span>Ok<img src="assets/img/png/check.png" alt=""></span></div>
    `;
    checkForDescription(task);
    renderEditPriorityButtons(task);
    renderEditSubtasks(task);
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
    contactsToChooseElement.classList.remove('d-none')
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
        const contactClass = isAssigned ? 'editAssignedTo contactIsAssigned' : '';
        const initials = getInitials(contact);
        const color = contactColorsAssignment[contact];

        contactsToChooseElement.innerHTML += `
            <div class="contactToChoose ${contactClass}" onclick="toggleContactAssignment('${contact}')">
                <div class="openedAssigendContactsInitials" style="background-color: ${color};">
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
    console.log('Updated assigned contacts:', assignedContacts);  // Debugging line
    showContactsToChoose(); // Re-render the contacts list
}


function closeContactsDropdown(){
 let  contactsTochoose =  document.getElementById('contactsToChoose')
 if(contactsTochoose.classList.contains('d-none')){
    showContactsToChoose()
    document.getElementById('dropDownImg').classList.add('dropUpImg')
 }else{
    contactsTochoose.classList.add('d-none')
    document.getElementById('dropDownImg').classList.remove('dropUpImg')
 }
}



let subtaskInfos = [];
let isSubtaskEditMode = false; // Flag to check if we're in edit mode

function renderEditSubtasks(task) {
    // Initialize subtaskInfos with existing subtasks of the selected task
    subtaskInfos = task.subtasks || [];

    let editSubtaskArea = document.getElementById('editSubtasks');
    editSubtaskArea.innerHTML = `
        <div id="editAreaSubtask" onclick="startWritingSubtask()" class="subtaskAdd">
            <span>Add new subtask</span>
            <img src="/assets/img/png/Subtasks icons11.png">
        </div>
    `;
    showSubtasks();  // Call to display existing subtasks when rendering the edit area
}

function startWritingSubtask() {
    if (!isSubtaskEditMode) {
        writeSubtask();
        
        isSubtaskEditMode = true; // Set flag to prevent redundant calls
    }else{
        isSubtaskEditMode = false
        
    }
}

function writeSubtask() {
    let subtaskArea = document.getElementById('editAreaSubtask');
    subtaskArea.innerHTML = `
        <div class="addSubtask" id="editSubtask">
            <input type="text"  id="subtaskInput2" minlength="3" required placeholder="Enter subtask"/>
            <div class="d-flex">
                <img src="/assets/img/png/subtaskX.png" onclick="renderEditSubtasks({ subtasks: subtaskInfos })" alt="" />
                <img src="/assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
            </div>
        </div>
    `;
  
}

function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput2');
    let subtaskInfo = subtaskInput.value.trim();
    let editSubtask = document.getElementById('editSubtasks');

    // Add input event listener to remove error styling
    subtaskInput.addEventListener('input', function() {
        if (subtaskInput.value.trim().length >= 3) {
            subtaskInput.placeholder = 'Enter subtask'; 
            editSubtask.classList.remove('error-container');  // Reset parent container border
            subtaskInput.classList.remove('error-placeholder');  // Remove error class from input
        }
    });

    if (subtaskInfo.length < 3) {
        // Display error message and styling for invalid input
        subtaskInput.value = '';
        subtaskInput.placeholder = 'Min 3 characters needed'; 
        editSubtask.classList.add('error-container');  // Apply red border to parent container
        subtaskInput.classList.add('error-placeholder');  // Apply error class to input
        return; 
    } else {
        // Clear error styling
        subtaskInput.placeholder = 'Enter subtask'; 
        editSubtask.classList.remove('error-container');  // Reset parent container border
        subtaskInput.classList.remove('error-placeholder');  // Remove error class from input
    }

    // Clear input value only after valid input
    subtaskInfos.push({ completed: false, title: subtaskInfo });
    subtaskInput.value = ''; // Clear the input after pushing the valid subtask
    showSubtasks();
    renderEditSubtasks({ subtasks: subtaskInfos });  // Reset the subtask area after adding a new subtask
}

function showSubtasks() {
    let newSubtask = document.getElementById('newSubtasks');
    newSubtask.innerHTML = '';
    for (let s = 0; s < subtaskInfos.length; s++) {
        newSubtask.innerHTML += `
            <div class="addSubtask editSubtask  showedSubtask">
                <div style="width:100%"  onclick="editSubtask(${s})">
                    ${subtaskInfos[s].title}
                </div>
                <div class="d-flex">
                    <img src="assets/img/png/editSubtask.png" onclick="editSubtask(${s})" alt="" />
                    <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
                </div>
            </div>
        `;
    }
   
}
function editSubtask(index) {
    // Get the subtask container by index
    let subtaskContainers = document.querySelectorAll('#newSubtasks .addSubtask');
    let subtaskContainer = subtaskContainers[index];

    // Create the editable input field
    subtaskContainer.innerHTML = `
        <div class="addSubtask editSubtask">
            <input type="text" id="editSubtaskInput" value="${subtaskInfos[index].title}" minlength="3" required />
            <div class="d-flex">
                <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${index})" alt="" />
                <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index})" alt="" />
            </div>
        </div>
    `;

}

function saveSubtask(index) {
    let editInput = document.getElementById('editSubtaskInput');
    let editedSubtask = editInput.value.trim();

    if (editedSubtask.length < 3) {
        // Display error message and styling for invalid input
        editInput.value = ''; 
        editInput.placeholder = 'Min 3 characters needed'; 
        editInput.style.borderColor = 'red'; 
        editInput.classList.add('error-placeholder'); 

        // Add focus event listener to remove error styling
        editInput.addEventListener('focus', function() {
            editInput.placeholder = 'Enter subtask'; 
            editInput.style.borderColor = ''; 
            editInput.classList.remove('error-placeholder'); 
        }, { once: true }); // Ensure the listener is called only once

        return; 
    } else {
        // Clear error styling
        editInput.placeholder = 'Enter subtask'; 
        editInput.style.borderColor = ''; 
        editInput.classList.remove('error-placeholder'); 
    }

    // Update the subtask in the array
    subtaskInfos[index].title = editedSubtask;

    // Re-render the subtasks
    showSubtasks();
}

function deleteSubtask(index) {
    subtaskInfos.splice(index, 1);
    showSubtasks();
}




function collectData(taskId) {
    // Retrieve task by ID
    const task = getTaskById(taskId);
    console.log('Collecting data for task:', task);  // Debugging line

    if (!task) {
        console.error('Task not found.');
        return null;
    }

    // Collect data from the form
    const title = document.getElementById('editTitle').querySelector('input').value;
    const description = document.getElementById('taskDescriptionTextarea').value;
    const dueDate = document.getElementById('dateValue').value;
    console.log('Collected data:', { title, description, dueDate });  // Debugging line

    // Determine priority
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
    console.log('Priority:', priority);  // Debugging line

    // Retrieve assigned contacts from the DOM or state
    const assignedContacts = currentTaskBeingEdited.assignedContacts || [];  // Ensure this reflects the latest state

    // Retrieve subtasks
    const subtasks = subtaskInfos.map(subtask => ({
        title: subtask.title,
        completed: subtask.completed
    }));
    console.log('Collected subtasks:', subtasks);  // Debugging line

    // Create an updated task object
    const updatedTask = {
        ...task,
        title,
        description,
        dueDate,
        priority,
        assignedContacts,  // Ensure this is up-to-date
        subtasks
    };

    console.log('Updated task:', updatedTask);  // Debugging line

    // Update the task in local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log('Task updated in localStorage.');
    } else {
        console.warn('Task not found in localStorage.');
    }

    // Update the task in Firebase
    updateTaskInFirebase(updatedTask).then(() => {
        console.log('Task updated in Firebase.');
        // Re-render tasks
        renderTasks();
        closeEdit();

        // Open the updated task after closing the edit form
        openTask(updatedTask);
    }).catch(error => {
        console.error('Error updating task in Firebase:', error);
    });
    renderTasks();
    closeEdit();
    openTask(updatedTask);
    return updatedTask;
}
function closeEdit(){
    document.getElementById('editTaskContainer').classList.add('d-none')
}

function getTaskById(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.find(task => task.id === taskId);
}

