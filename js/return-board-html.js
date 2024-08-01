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