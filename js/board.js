let allTasks = []
let tasksToDo = []
let tasksInProgress = []
let tasksFeedback = []
let tasksDone = []

const BASE_URL = ('https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/')

async function getTasksFromDataBase() {
  try {
    let response = await fetch(BASE_URL + '.json');
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    let responseAsJson = await response.json();
    console.log(responseAsJson);
    allTasks = responseAsJson
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
  renderTasks()
}




function renderTasks() {
  let toDoArea = document.getElementById('toDo');
  toDoArea.innerHTML = ``;
  for (let i = 0; i < allTasks.length; i++) {
    toDoArea.innerHTML += `
      <div class="taskCard">
        <div class="taskCategory">${allTasks[i].category}</div>
        <div>${allTasks[i].title}</div>
        <div>${allTasks[i].description}</div>
        <div id="taskContainer${i}">
          <div class="task">
            <div class="progress-bar" id="progressBarContainer${i}">
              <div class="progress-bar-fill" id="progressBarFill${i}"></div>
            </div>
            <span id="subtaskStatus${i}"></span>
          </div>
        </div>
        <button onclick="setSubtaskToDone(${i})">Done</button>
      </div>
    `;
    renderSubtasks(i);
  }
}

function renderSubtasks(i) {
  let task = allTasks[i];
  let progressBarContainer = document.getElementById(`progressBarContainer${i}`);
  let progressBarFill = document.getElementById(`progressBarFill${i}`);
  let subtaskStatus = document.getElementById(`subtaskStatus${i}`);

  if (task && task.subtasks && task.subtasks.length > 0) {
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;

    // Calculate the progress percentage
    let progressPercentage = (completedSubtasks / totalSubtasks) * 100;
    progressBarFill.style.width = progressPercentage + '%';

    // Update the subtask status text
    subtaskStatus.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;

    // Show the progress bar
    progressBarContainer.style.display = 'block';
  } else {
    // Hide the progress bar if no subtasks
    progressBarContainer.style.display = 'none';
    subtaskStatus.textContent = '';
  }
}


function setSubtaskToDone(i) {
  // Mark all subtasks of the task as completed
  let task = allTasks[i];
  if (task && task.subtasks) {
    task.subtasks.forEach(subtask => {
      subtask.completed = true;
    });
  }

  // Re-render the tasks to update the progress bar and subtask status
  renderTasks();
} 