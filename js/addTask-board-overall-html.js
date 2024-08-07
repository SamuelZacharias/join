
function returnShowCategoryOverallHtml(){
  return `
      <div class="openedDropDown">
        <span class="spanHover" onclick="chooseCategory(0)">${category[0]}</span>
        <span class="spanHover" onclick="chooseCategory(1)"> ${category[1]}</span>
      </div>
    `;
}

function returnChooseCategoryOverallHTML(index){
  return `
    <span onclick="showCategory()" class="spanCategory">${category[index]}</span>
    <img class="dropDownImg" id="dropDownImg" src="./assets/img/png/arrow_drop_down (1).png" alt="">
  `;
}

function returnShowContactsOverallHTML(contact, index) {
  return `
    <div class="contactsOpen ${selectedContacts.some(sc => sc.name === contact.name) ? 'selected' : ''}" 
      data-index="${index}">
      <div class="contactInitials" style="background-color: ${contact.color};">
        ${contact.initials}
      </div>
      <div class="contactName">
        <span style="width:100%;">${contact.name}</span>
        <img src="./assets/img/png/Rectangle 5.png" alt="">
      </div>
    </div>
  `;
}

function renderOverallAssignedContactsHTML(contact) {
  return `
    <div class="contactInitials" style="background-color: ${contact.color}; color:white;">
      ${contact.initials}
    </div>
  `;
}

function renderAssignedContactsHTML(contact) {
  return `
    <div class="contactInitials" style="background-color: ${contact.color}; color:white;">
      ${contact.initials}
    </div>
  `;
}