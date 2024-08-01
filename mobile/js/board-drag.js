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