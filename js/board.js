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
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const validTasks = savedTasks.filter(task => task !== null);

    // Update tasks array with valid tasks
    tasks.length = 0;  
    tasks.push(...validTasks);

    // Update contacts array directly
    contacts.length = 0;
    contacts.push(...savedContacts);  // Spread savedContacts into the contacts array

    console.log('Loaded tasks:', tasks);
    console.log('Loaded contacts:', contacts);
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


let addTaskColumn = null

function openBoardAddTask(){
   let addTaskContainer = document.getElementById('addTaskContainer')
   addTaskContainer.classList.remove('d-none')
   renderAddTaskBoardHtml(addTaskContainer)
   addTaskColumn = 'toDo'
   console.log(addTaskColumn);
   
}

function openBoardAddTaskInProgress(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    addTaskColumn = 'inProgress'
    console.log(addTaskColumn);
}

function openBoardAddTaskawaitFeedback(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    addTaskColumn = 'awaitFeedback'
    console.log(addTaskColumn);
 }

 

function closeAddTaskBoard(){
    document.getElementById('addTaskContainer').classList.add('d-none')
}


function renderAddTaskBoardHtml(addTaskContainer){
    addTaskContainer.innerHTML = `
        <section class="addTask" >
            <div class="boardAddTaskTitle">
                <h1>Add Task</h1>
                <img src="/assets/img/png/close.png" onclick="closeAddTaskBoard()">
            </div>
            <form id="taskForm" >
              <div class="formLeft">
                <div class="eachInput">
                  <span>Title<b style="color: red">*</b></span>
                  <p class="inputContainer"><input required type="text" /></p>
                </div>
                <div class="eachInput">
                  <span>Description</span>
                  <p><textarea name="" id=""></textarea></p>
                </div>
                <div class="eachInput">
                  <span>Assigned to</span>
                  <div class="categoryDropDown" id="dropdownContacts" onclick="toggleContacts()">
                    <span class="spanCategory" >Select Contacts to assign</span>
                    <img class="dropDownImg" id="dropDownContactsImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
                  </div>
                  <div id="contacts" class="d-none"></div>
                  <div id="assignedContacts"></div>
                </div>
              </div>
              <div class="separator"></div>
              <div class="formLeft">
                <div class="eachInput">
                  <span>Due date <b style="color: red">*</b></span>
                  <p class="inputContainer"><input required type="date" id="dateInput"/></p>
                </div>
                <div class="eachInput">
                  <span>Prio</span>
                  <div class="d-flex prioArea">
                    <button type="button" id="button1" onclick="handleClick(1)" class="buttonCenter prioButton">
                      Urgent <img id="prioImg1" src="assets/img/svg/urgent.svg" alt="" />
                    </button>
                    <button type="button" id="button2" onclick="handleClick(2)" class="buttonCenter prioButton">
                      Medium <img id="prioImg2" src="assets/img/png/mediumColor.png" alt="" />
                    </button>
                    <button type="button" id="button3" onclick="handleClick(3)" class="buttonCenter prioButton">
                      Low <img id="prioImg3" src="assets/img/svg/low.svg" alt="" />
                    </button>
                  </div>
                </div>
                <span style="margin-bottom: -6px; margin-top: -8px;">Category <b style="color: red">*</b></span>
                <div class="categoryDropDown" id="dropdownCategory" onclick="showCategory()">
                  <span class="spanCategory" >Select task category</span>
                  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
                </div>
                <div id="categories"></div>
                <div class="eachInput">
                  <span>Subtasks</span>
                  <div id="subtaskContainer">
                    <p>
                      <input type="text" name="" placeholder="Add new subtask" readonly onclick="writeSubtaskAddTask()" />
                      <img src="assets/img/png/Subtasks icons11.png"  onclick="writeSubtaskAddTask()"alt="" />
                    </p>
                  </div>
                  <ul id="newSubtasks" style="display: flex;"></ul>
                </div>
              </div>
            </form>
            <section class="buttonsSection d-flex">
              <span><b style="color: red">*</b> This field is Required</span>
              <div class="buttonArea">
                <button id="clearButton" class="buttonCenter clear">
                  Clear
                  <img src="assets/img/png/iconoir_cancel.png" alt="" />
                </button>
                <button type="submit" class="buttonCenter createButton">
                  Create Task <img src="assets/img/png/check.png" alt="" />
                </button>
              </div>
            </section>
          </section>
    `;
}


