let allTasks = [];
let tasksToDo = [];
let tasksInProgress = [];
let tasksFeedback = [];
let tasksDone = [];

const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

async function getTasksFromDataBase() {
  try {
    let response = await fetch(BASE_URL + '.json');
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    let responseAsJson = await response.json();
    console.log(responseAsJson);
    allTasks = responseAsJson;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  renderTasks();
}

function renderTasks() {
  let toDoArea = document.getElementById('toDo');
  toDoArea.innerHTML = ``;
  for (let i = 0; i < allTasks.length; i++) {
    toDoArea.innerHTML += `
      <div draggable="true" class="taskCard"  id="taskCard${i}" >
        <span id="taskCategory${i}" class="taskCategory">${allTasks[i].category}</span>
        <div class="taskInfo">
          <div class="taskTitle">${allTasks[i].title}</div>
          <div id="taskDescription${i}" class="taskDescription">${allTasks[i].description}</div>
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
    renderSubtasks(i);
    categoryColor(i);
    taskDescriptionLength(i);
    renderContacts(i);
    renderPriority(i);
  }

  // Initialize drag-and-drop for all task cards after rendering
  setTimeout(() => {
    for (let i = 0; i < allTasks.length; i++) {
      initializeDragAndDrop(i);
    }
  }, 0);
}

function renderSubtasks(i) {
  let task = allTasks[i];
  let progressBarContainer = document.getElementById(`progressBarContainer${i}`);
  let progressBarFill = document.getElementById(`progressBarFill${i}`);
  let subtaskStatus = document.getElementById(`subtaskStatus${i}`);
  if (task && task.subtasks && task.subtasks.length > 0) {
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBarFill.style.width = progressPercentage + '%';
    subtaskStatus.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
    progressBarContainer.style.display = 'block';
  } else {
    progressBarContainer.style.display = 'none';
    subtaskStatus.textContent = '';
  }
}

let contactInitialColors = {};
let contactColors = ["#FF4646", "#FFE62B", "#FFBB2B", "#C3FF2B", "#0038FF", "#FFC701", "#FC71FF",
  "#FFA35E", "#FF745E", "#9327FF", "#00BEE8", "#1FD7C1", "#6E52FF", "#FF5EB3", "#FF7A00"];
let availableColors = [...contactColors]; // Create a copy of the contactColors array

function categoryColor(i) {
  if (allTasks[i].category === 'User Task') {
    document.getElementById(`taskCategory${i}`).classList.add('userTask');
  }
  if (allTasks[i].category === 'Technical task') {
    document.getElementById(`taskCategory${i}`).classList.add('technicalTask');
  }
}

function taskDescriptionLength(i) {
  let taskDescription = document.getElementById(`taskDescription${i}`);
  let text = taskDescription.innerText;

  if (text.length > 100) {
    taskDescription.innerText = text.substring(0, 100) + '...';
  }
}

function renderContacts(i) {
  let taskContacts = document.getElementById(`contacts${i}`);
  taskContacts.innerHTML = '';
  for (let c = 0; c < allTasks[i].assignedContacts.length; c++) {
    let fullName = allTasks[i].assignedContacts[c];
    let initials = getInitials(fullName);
    let color = contactInitialColors[fullName] || assignColor(fullName);
    taskContacts.innerHTML += `<div style="background-color: ${color};" class="assignedTaskContacts">${initials}</div>`;
  }
}

function getInitials(name) {
  return name.split(' ').map(word => word[0].toUpperCase()).join('');
}

function assignColor(name) {
  if (!contactInitialColors[name]) {
    if (availableColors.length === 0) {
      availableColors = [...contactColors];
    }
    contactInitialColors[name] = availableColors.pop();
    localStorage.setItem('contactInitialColors', JSON.stringify(contactInitialColors));
  }
  return contactInitialColors[name];
}

function assignColors() {
  let savedColors = localStorage.getItem('contactInitialColors');
  if (savedColors) {
    contactInitialColors = JSON.parse(savedColors);
  } else {
    for (let i = 0; i < contacts.firstname.length; i++) {
      let fullName = contacts.firstname[i] + " " + contacts.lastname[i];
      contactInitialColors[fullName] = assignColor(fullName);
    }
    localStorage.setItem('contactInitialColors', JSON.stringify(contactInitialColors));
  }
}

function renderPriority(i) {
  let priority = document.getElementById(`priority${i}`);
  if (allTasks[i].priority === 'Low') {
    priority.innerHTML = `
      <img src="assets/img/svg/low.svg" alt="">
    `;
  }
  if (allTasks[i].priority === 'Medium') {
    priority.innerHTML = `
      <img src="assets/img/png/mediumColor.png" alt="">
    `;
  }
  if (allTasks[i].priority === 'Urgent') {
    priority.innerHTML = `
      <img src="assets/img/svg/urgent.svg" alt="">
    `;
  }
}

function tiltTaskCard(i) {
  let taskcard = document.getElementById(`taskCard${i}`);
  taskcard.classList.add('taskCardClickHold');
}

function tiltTaskCardBack(i) {
  let taskcard = document.getElementById(`taskCard${i}`);
  taskcard.classList.remove('taskCardClickHold');
}

function initializeDragAndDrop(i) {
  const source = document.getElementById(`taskCard${i}`);

  source.addEventListener("dragstart", (event) => {
    // Store a reference to the dragged element
    dragged = event.target;
    // Add the class to show the card is being dragged
    event.target.classList.add("dragging");
    event.target.classList.add('taskCardClickHold');
    // Use event.dataTransfer to store some data
    event.dataTransfer.setData("text/plain", event.target.id);
  });

  source.addEventListener("dragend", (event) => {
    // Remove the class when dragging is done
    event.target.classList.remove("dragging");
    event.target.classList.remove('taskCardClickHold');
  });

  // Add event listeners for each drop target
  const dropTargets = document.getElementsByClassName("dragTarget");
  for (let target of dropTargets) {
    target.addEventListener("dragover", (event) => {
      // Prevent default to allow drop
      event.preventDefault();
    });

    target.addEventListener("drop", (event) => {
      // Prevent default action (open as link for some elements)
      event.preventDefault();
      // Move dragged element to the drop target
      if (dragged) {
        target.appendChild(dragged);
      }
    });
  }
}