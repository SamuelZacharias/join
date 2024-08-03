const tasks = [];
const contacts = []
let selectedContacts = [];
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
   document.getElementById('boardAddTask').classList.add('slide-in')
   handleClick(2)
   addTaskColumn = 'toDo'
   console.log(addTaskColumn);
   
}

function openBoardAddTaskInProgress(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    document.getElementById('boardAddTask').classList.add('slide-in')
    handleClick(2)
    addTaskColumn = 'inProgress'
    console.log(addTaskColumn);
}

function openBoardAddTaskawaitFeedback(){
    let addTaskContainer = document.getElementById('addTaskContainer')
    addTaskContainer.classList.remove('d-none')
    renderAddTaskBoardHtml(addTaskContainer)
    document.getElementById('boardAddTask').classList.add('slide-in')
    handleClick(2)
    addTaskColumn = 'awaitFeedback'
    console.log(addTaskColumn);
}


function closeAddTaskBoard(){
    document.getElementById('addTaskContainer').classList.add('d-none')
}

let activeButton = null
let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];

function renderAddTaskBoardHtml(addTaskContainer){
    addTaskContainer.innerHTML = `
        <section class="addTask" id="boardAddTask" >
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

function handleClick(buttonNumber) {
    if (activeButton !== null) {
      const previousButton = document.getElementById('button' + activeButton);
      const previousImage = document.getElementById('prioImg' + activeButton);
      
      previousButton.classList.add('hover-shadow');
      previousButton.style.backgroundColor = '';
      previousButton.style.color = '';
      previousButton.style.fontWeight = '';
  
      switch (activeButton) {
        case 1:
          previousImage.src = 'assets/img/svg/urgent.svg';
          break;
        case 2:
          previousImage.src = 'assets/img/png/mediumColor.png';
          break;
        case 3:
          previousImage.src = 'assets/img/svg/low.svg';
          break;
      }
    }
  
    activeButton = buttonNumber;
    const activeButtonElement = document.getElementById('button' + activeButton);
    const activeImage = document.getElementById('prioImg' + activeButton);
  
    activeButtonElement.classList.remove('hover-shadow');
    activeButtonElement.style.color = 'white';
    activeButtonElement.style.fontWeight = '600';
  
    switch (buttonNumber) {
      case 1:
        activeButtonElement.style.backgroundColor = '#FF3D00';
        activeImage.src = 'assets/img/png/urgentWhite.png';
        break;
      case 2:
        activeButtonElement.style.backgroundColor = '#FFA800';
        activeImage.src = 'assets/img/svg/medium.svg';
        break;
      case 3:
        activeButtonElement.style.backgroundColor = '#7AE229';
        activeImage.src = 'assets/img/png/lowWhite.png';
        break;
    }
  }

  function showCategory() {
    let categories = document.getElementById('categories');
    categories.innerHTML = `
        <div class="openedDropDown">
          <span class="spanHover" onclick="chooseUserStory()">${category[0]}</span>
          <span class="spanHover" onclick="chooseTechnical()"> ${category[1]}</span>
        </div>
      `; 
    document.getElementById('categories').classList.remove('d-none');
    document.getElementById('dropDownImg').classList.remove('dropDownImg');
    document.getElementById('dropDownImg').classList.add('dropUpImg');
    choosenCategory = false;
  }
  
  function chooseUserStory() {
    let chooseCategory = document.getElementById('dropdownCategory');
    chooseCategory.innerHTML = `
    <span onclick="showCategory()" class="spanCategory">${category[0]}</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
    document.getElementById('categories').classList.add('d-none');
    choosenCategory = true;
    clickCount = 0;
    document.getElementById('dropDownImg').classList.add('dropDownImg');
  
    
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
  
  function chooseTechnical() {
    let chooseCategory = document.getElementById('dropdownCategory');
    chooseCategory.innerHTML = `
    <span onclick="showCategory()" class="spanCategory">${category[1]}</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
    document.getElementById('categories').classList.add('d-none');
    choosenCategory = true;
    clickCount = 0;
    document.getElementById('dropDownImg').classList.add('dropDownImg');
  
    
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
  
  function hideCategory() {
    document.getElementById('dropDownImg').classList.add('dropDownImg');
    document.getElementById('dropDownImg').classList.remove('dropUpImg')
    document.getElementById('categories').classList.add('d-none');
    clickCount = 0;
  }

  document.addEventListener("DOMContentLoaded", function() {
    let clickCount = 0;
    const dropdown = document.getElementById("dropdownCategory");
    if (dropdown) {
      dropdown.addEventListener("click", function() {
        clickCount++;
        if (clickCount % 2 === 1) {
          showCategory();
        } else {
          hideCategory();
        }
      });
    } 
  });

  function handleClickOutside(event) {
    const container = document.getElementById('dropdownCategory');
    if (!container.contains(event.target)) {
      hideCategory();
    }
  }
  




function showContacts() {
  let contactsContainer = document.getElementById('contacts');
  contactsContainer.innerHTML = '';

  for (let x = 0; x < contacts.length; x++) {
    let contact = contacts[x];
    let fullName = contact.name;
    let color = contact.color;

    let isSelected = selectedContacts.some(c => c.name === contact.name);
    let selectedClass = isSelected ? 'selected' : '';

    contactsContainer.innerHTML += `
      <div class="contactsOpen ${selectedClass}" data-index="${x}">
        <div class="contactInitials" style="background-color: ${color}; ">
          ${contact.initials}
        </div>
        <div class="contactName">
          <span style="width:100%;">${fullName}</span>
          <img src="assets/img/png/Rectangle 5.png" alt="">
        </div>
      </div>
    `;
  }

  let contactElements = contactsContainer.getElementsByClassName('contactsOpen');
  for (let contactElement of contactElements) {
    contactElement.addEventListener('click', function() {
      let index = this.getAttribute('data-index');
      let contact = contacts[index];

      let selectedIndex = selectedContacts.findIndex(c => c.name === contact.name);
      if (selectedIndex === -1) {
        selectedContacts.push(contact);
      } else {
        selectedContacts.splice(selectedIndex, 1);
      }

      this.classList.toggle('selected');
      showAssignedContacts();
    });
  }
}

function toggleContacts() {
  document.getElementById('dropDownContactsImg').classList = ('dropUpImg')
  let contactsContainer = document.getElementById('contacts');
  if (contactsContainer.classList.contains('d-none')) {
    contactsContainer.classList.remove('d-none');

    showContacts();
  } else {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList = ('dropDownImg')
  }
}

function showAssignedContacts() {
  let assignedContactsContainer = document.getElementById('assignedContacts');
  assignedContactsContainer.innerHTML = '';
  let maxContactsToShow = 5;

  for (let a = 0; a < Math.min(selectedContacts.length, maxContactsToShow); a++) {
    let contact = selectedContacts[a];
    let fullName = contact.name;  // Assuming `name` field is a single string.
    let color = contact.color;    // Use the color from the contact object.

    assignedContactsContainer.innerHTML += `
      <div class="contactInitials" style="background-color: ${color}; color:white;">
        ${contact.initials}
      </div>
    `;
  }

  if (selectedContacts.length > maxContactsToShow) {
    let moreCount = selectedContacts.length - maxContactsToShow;
    let moreContactsColor = "#999999"; 

    assignedContactsContainer.innerHTML += `
      <div class="contactInitials more-contacts" style="background-color: ${moreContactsColor};">
        +${moreCount} 
      </div>
    `;
  }
}


document.addEventListener('click', function(event) {
    let contactsContainer = document.getElementById('contacts');
    let dropdownContacts = document.getElementById('dropdownContacts');
    if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
      contactsContainer.classList.add('d-none');
      document.getElementById('dropDownContactsImg').classList.add('dropDownImg');
    document.getElementById('dropDownContactsImg').classList.remove('dropUpImg')
    }
  });