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
                <div id="openedTaskDescription">${task.description}</div>
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

function returnOpenEditHTML(task, today) {
    return `
      <div class="closeEditTask">
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
              <div class="titleInput"><input id="dateValue" type="date" value="${task.dueDate || ''}" min="${today}"></div>
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
              <ul id="newSubtasks"></ul>
          </div>
      </div>
      <div class="editOkay" id="editOkay" ><span onclick="collectDataEdit('${task.id}')">Ok<img src="assets/img/png/check.png" alt=""></span></div>
    `;
}

function returnEditPriorityButtonsHTML(){
    return `
        <button class="prioButton hover-shadow" id="button1" onclick="switchButton('Urgent')">Urgent <img src="assets/img/svg/urgent.svg"></button>
        <button class="prioButton hover-shadow" id="button2" onclick="switchButton('Medium')">Medium <img src="assets/img/png/mediumColor.png"></button>
        <button class="prioButton hover-shadow" id="button3" onclick="switchButton('Low')">Low   <img src="assets/img/svg/low.svg"></button>
    `;
}

function returnEditSubtasksHTML() {
    return `
        <div id="editAreaSubtask" onclick="startWritingSubtask()" class="subtaskAdd">
            <span>Add new subtask</span>
            <img src="/assets/img/png/Subtasks icons11.png">
        </div>
    `;
}

function returnWriteSubtaskHTML() {
    return `
        <div class="editSubtaskInput" id="editSubtask">
            <input type="text" id="subtaskInput2" minlength="3" required placeholder="Enter subtask"/>
            <div class="d-flex">
                <img src="/assets/img/png/subtaskX.png" onclick="renderEditSubtasks({ subtasks: subtaskInfos })" alt="" />
                <img src="/assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
            </div>
        </div>
    `;
}

function returnSubtaskHTML(index, title) {
    return `
        <li onmouseenter="showActions(this)" onmouseleave="hideActionsAddTask(this)" class="addTaskBoardEdit">
        <div class="subtask-item">
          <div class="subtask-content">
            <span class="custom-bullet">•</span>
              <div style="width:100%" onclick="editSubtaskBoard(${index})"> ${title}</div>
          </div>
          <div class="subtaskIconsAddTask d-none">
            <img src="assets/img/png/editSubtask.png" onclick="editSubtaskBoard(${index})" alt="" />
            <div class="vertical-line"></div>
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index})" alt="" />
          </div>
        </div>
      </li>
    `;
}

function returnEditSubtaskHTML(index, title) {
    return `
        <div class="editSubtask addSubtask">
            <input type="text" id="editSubtaskInput" value="${title}" minlength="3" required />
            <div class="d-flex">
                <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${index})" alt="" />
            
            </div>
        </div>
    `;
}

function returnContactsToChooseHTML(contactName, contactClass, color, initials) {
    return `
      <div class="contactToChoose ${contactClass}" onclick="toggleContactAssignment('${contactName}')">
          <div class="openedAssigendContactsInitials" style="background-color: ${color};">
              ${initials}
          </div>
          <div>${contactName}</div>
      </div>
    `;
}

function returnResetBoardSubtaskHtml(){
    return `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" readonly onclick="writeSubtaskAddTask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}