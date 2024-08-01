function returnRenderHtml(i, task) {
  return `
  <div draggable="true" class="taskCard" id="taskCard${i}" ondragstart="drag(event)" ondragend="dragEnd(event)" onmousedown="mouseHold(event)" onmouseup="mouseRelease(event)" onmouseleave="mouseLeave(event)" onclick="openTask(tasks[${i}])">
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

function returnOpenedTaskHtml(task) {
    return `
        <div class="openedTask" id="openedTask" onclick="event.stopPropagation()">
            <div class="taskDetails">
                <div class="openedTaskCategory">
                    <span id="openedTaskCategory" class="taskCategory">${task.category}</span>
                    <img class="openedTaskClose" src="/assets/img/png/openedTaskClose.png" onclick="closeOpenedTask()">
                </div>
                <h1 id="openedTaskTitle">${task.title}</h1>
                <p id="openedTaskDescription">${task.description}</p>
                <div>Due date: ${task.dueDate}</div>
                <div>Priority: ${task.priority}</div>
                <div>
                    <div style="margin-bottom:10px;">Assigned To:</div>
                    <div id="openedAssignedContacts" class="openedAssigendContactsArea"></div>
                </div>
                <div>
                    <div>Subtasks:</div>
                    <div id="openedSubtasks"></div>
                </div>
                <div class="deleteEditArea">
                    <div onclick="deleteTask('${task.id}')" class="delete"><img src="/assets/img/png/delete.png"> Delete</div>
                    <div onclick="editTask('${task.id}')" class="edit"><img src="/assets/img/png/editOpen.png"> Edit</div>
                </div>
            </div>
        </div>
    `;
}

function returnOpenTaskAssignedContactsHTML(contactName, color, initials) {
    return `
        <div class="openedAssigendContacts">
            <div class="openedAssigendContactsInitials" style="background-color: ${color};">
                ${initials}
            </div>
            <div>${contactName}</div>
        </div>
    `;
}

function returnOpenTaskSubtaskHTML(taskId, subtaskIndex, subtask) {
    let isChecked = subtask.completed ? 'checked' : '';
    return `
        <div class="openedSubtaskTitle">
            <label class="custom-checkbox">
                <input type="checkbox" ${isChecked}
                    onclick="setSubtaskCompleted('${taskId}', ${subtaskIndex}, this.checked)">
                <span class="checkmark"></span>
                ${subtask.title}
            </label>
        </div>
    `;
}
