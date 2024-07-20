let selectedCategory = '';

function openDropDown() {
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div id="openedDropDown" style="display:flex; flex-direction:column; width:100%;">
      <div class="categoryOption" onclick="closeDropDown()">
        <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
        <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
      <span class="spanHover" onclick="selectCategory('Technical Task')">Technical Task</span>
      <span class="spanHover" onclick="selectCategory('User Story')">User Story</span>
    </div>
  `;
}

function selectCategory(category) {
  selectedCategory = category;
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div class="categoryOption" onclick="openDropDown()">
      <span class="spanCategory">${selectedCategory}</span>
      <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="" onclick="openDropDown()">
    </div>
  `;
}

function closeDropDown() {
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div class="categoryOption" onclick="openDropDown()">
      <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
      <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="" onclick="openDropDown()">
    </div>
  `;
}

function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault(); // Prevent form submission if validation fails
  } else {
    document.getElementById('taskForm').submit();
  }
}

function validateForm() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  // Remove previous invalid styles
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdown').classList.remove('invalid');

  // Check all input fields for validity
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  });

  // Check if a category has been selected
  if (!selectedCategory) {
    valid = false;
    document.getElementById('dropdown').classList.add('invalid'); // Add invalid class to dropdown
  } else {
    document.getElementById('dropdown').classList.remove('invalid');
  }

  return valid; // Return validation result
}