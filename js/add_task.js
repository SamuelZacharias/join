function openDropDown(){
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
  <div style="display:flex; flex-direction:column;">
    <div >
      <span>Select task category</span>
      <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
    </div>
    <span>Technical Task</span>
    <span>User Story</span>
  </div>
  `;

}