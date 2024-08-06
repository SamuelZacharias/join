function returnResetSubtaskHtml(){
 return `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" readonly onclick="writeSubtask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}

function returnWriteSubtaskHtmlAddTask(){
  return `
      <div class="addSubtask">
          <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
          <div class="d-flex">
              <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
              <img src="assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
          </div>
      </div>
  `;
}

function returnShowAddTaskSubtaskHTML(subtaskText, s) {
  return `
    <li onmouseenter="showActions(this)" onmouseleave="hideActions(this)">
      <div class="subtask-item">
        <div class="subtask-content">
          <span class="custom-bullet">•</span>
          ${subtaskText}
        </div>
        <div class="subtask-icons d-none">
          <img src="assets/img/png/editSubtask.png" onclick="editSubtask(${s})" alt="" />
          <div class="vertical-line"></div>
          <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
        </div>
      </div>
    </li>
  `;
}

function returnEditSubtaskAddtaskIfHtml(index) {
  return `
    <div class="addSubtask">
      <input type="text" id="editSubtaskInput" value="${subtaskInfos[index]}" minlength="3" required />
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${index})" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index})" alt="" />
      </div>
    </div>
  `;
}

function returnEditSubtaskAddTaskElseHtml(index, s) {
  return `
    <div class="addSubtask">
      <div style="width:100%" onclick="editSubtask(${s})">
        ${subtaskInfos[index]}
      </div>
      <div class="d-flex">
        <img src="assets/img/png/subtaskDone.png" onclick="showSubtasks()" alt="" />
        <img src="assets/img/png/delete.png" onclick="deleteSubtask(${index})" alt="" />
      </div>
    </div>
  `;
}

function returnAddTaskDropCategoryHtml(){
  return `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
}