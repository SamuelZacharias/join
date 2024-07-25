let allTasks = []
let tasksToDo = []
let tasksInProgress = []
let tasksFeedback = []
let tasksDone = []

const BASE_URL = ('https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/')

async function getTasksFromDataBase(){
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




function renderTasks(){
  let toDoArea = document.getElementById('toDo');
  toDoArea.innerHTML =``;
  for(i= 0; i<allTasks.length; i++){
    toDoArea.innerHTML += `
      <div><div>
      <div class="taskCard">
        <div class="taskCategory">${allTasks[i].category}</div>
        <div>${allTasks[i].title}<div>
        <div>${allTasks[i].description}<div>
        <div id="subtaskContainer${i}"><div>
      <div>
    `;
    renderSubtasks(i)
}
}


function renderSubtasks(i) {
  let subtaskContainer = document.getElementById(`subtaskContainer${i}`); // Assuming an element with this ID exists

 
  subtaskContainer.innerHTML = '';

  if (allTasks[i] && allTasks[i].subtasks && allTasks[i].subtasks.length > 0) {
    for(x = 0; x < allTasks[i].subtasks.length; x++ )
    subtaskContainer.innerHTML = ``; allTasks[i].subtasks

    
    
  } else {
    console.log('No subtasks to render.');
  }
}