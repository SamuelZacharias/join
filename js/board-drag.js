async function drop(event) {
  event.preventDefault();
  const { taskId, taskElement, targetColumnId } = getDropEventDetails(event);
  if (taskElement && targetColumnId) {
    const task = getTask(taskId);
    if (task) {
      await moveTask(task, targetColumnId);
    } else {
      console.error('Task not found in tasks array:', { taskId, tasks });
    }
  } else {
    console.error('Task element or target column not found:', { taskElement, targetColumnId });
  }

  if (taskElement) {
    taskElement.classList.remove('taskCardClickHold');
  }
}

function getDropEventDetails(event) {
  const taskId = event.dataTransfer.getData('text/plain');
  return {
    taskId,
    taskElement: document.getElementById(taskId),
    targetColumnId: event.target.closest('.taskColumn').id
  };
}

function getTask(taskId) {
  const taskIndex = parseInt(taskId.replace('taskCard', ''));
  return tasks[taskIndex];
}

async function moveTask(task, targetColumnId) {
  task.column = targetColumnId;
  await updateTaskInFirebase(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
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