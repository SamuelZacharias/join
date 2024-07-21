let selectedPriority = 'Medium';
let selectedContacts = [];
let activeButton = 2;


function handleClick(buttonNumber) {
  if (activeButton !== null) {
    const previousButton = document.getElementById('button' + activeButton);
    const previousImage = document.getElementById('prioImg' + activeButton);
    
    previousButton.classList.add('hover-shadow');
    previousButton.style.backgroundColor = '';
    previousButton.style.color = '';
    previousButton.style.fontWeight = '';

    switch (activeButton) {
      case 1:
        previousImage.src = 'assets/img/svg/urgent.svg';
        break;
      case 2:
        previousImage.src = 'assets/img/png/mediumColor.png';
        break;
      case 3:
        previousImage.src = 'assets/img/svg/low.svg';
        break;
    }
  }

  activeButton = buttonNumber;
  const activeButtonElement = document.getElementById('button' + activeButton);
  const activeImage = document.getElementById('prioImg' + activeButton);

  activeButtonElement.classList.remove('hover-shadow');
  activeButtonElement.style.color = 'white';
  activeButtonElement.style.fontWeight = '600';

  switch (buttonNumber) {
    case 1:
      activeButtonElement.style.backgroundColor = '#FF3D00';
      activeImage.src = 'assets/img/png/urgentWhite.png';
      break;
    case 2:
      activeButtonElement.style.backgroundColor = '#FFA800';
      activeImage.src = 'assets/img/svg/medium.svg';
      break;
    case 3:
      activeButtonElement.style.backgroundColor = '#7AE229';
      activeImage.src = 'assets/img/png/lowWhite.png';
      break;
  }
}

function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    document.getElementById('taskForm').submit();
  }
}

function validateForm() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');

  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  });

  if (!choosenCategory) {
    choosenCategory = false;
    document.getElementById('dropdownCategory').classList.add('invalid');
  }
  return valid;
}

function showCategory(){
  let categories = document.getElementById('categories')
  categories.innerHTML =`
      <div class="openedDropDown">
        <span class="spanHover" onclick="chooseUserStory()">${category[0]}</span>
        <span onclick="chooseTechnical()"> ${category[1]}</span>
      </div>
    `; 
    document.getElementById('categories').classList.remove('d-none')
    document.getElementById('dropDownImg').classList.remove('dropDownImg')
    document.getElementById('dropDownImg').classList.add('dropUpImg')
    choosenCategory = false
}

function chooseUserStory(){
  let chooseCategory = document.getElementById('dropdownCategory')
  chooseCategory.innerHTML = `
  <span onclick="showCategory()" class="spanCategory">${category[0]}</span>
  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
   document.getElementById('categories').classList.add('d-none')
   choosenCategory = true
   clickCount = 0
   document.getElementById('dropDownImg').classList.add('dropDownImg')
}

function chooseTechnical(){
  let chooseCategory = document.getElementById('dropdownCategory')
  chooseCategory.innerHTML = `
  <span onclick="showCategory()" class="spanCategory">${category[1]}</span>
  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
   document.getElementById('categories').classList.add('d-none')
   choosenCategory = true
   clickCount = 0
   document.getElementById('dropDownImg').classList.add('dropDownImg')
}




function hideCategory(){
  document.getElementById('categories').classList.add('d-none')
  clickCount = 0
}

let clickCount = 0
document.getElementById("dropdownCategory").addEventListener("click", function() {
  clickCount++;
  if (clickCount % 2 === 1) {
      showCategory();
  } else {
      hideCategory();
  }
});


choosenCategory = false
let category = ["User Task", "Technical task"]
let contacts = ["Biene Maya", "Vladimir Putin", "Ella Bella"]


function handleClickOutside(event) {
  const container = document.getElementById('dropdownCategory');
  if (!container.contains(event.target)) {
      console.log("Clicked outside the container");
      hideCategory()
  }
}
document.addEventListener('click', handleClickOutside)