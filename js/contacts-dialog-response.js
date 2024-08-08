function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
}

async function closeDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

async function openDialogEdit(index) {
  const contact = contacts[index];
  const initials = openDialogEditGenerateInitials(contact.name);
  currentContactIndex = index;
  openDialogEditShow();
  openDialogEditPopulateForm(contact, index);
  await openDialogEditAnimate();
  openDialogEditShowGreyBackground();
  openDialogEditUpdateBigLetterCircle(contact, initials);
}

function openDialogEditGenerateInitials(name) {
  const nameParts = name.split(' ');
  return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
}

function openDialogEditShow() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
}

function openDialogEditPopulateForm(contact, index) {
  document.getElementById('inputEditName').value = contact.name;
  document.getElementById('inputEditEmail').value = contact.email;
  document.getElementById('inputEditPhone').value = contact.phone;
  document.getElementById('inputEditName').dataset.index = index;
  document.getElementById('inputEditEmail').dataset.index = index;
  document.getElementById('inputEditPhone').dataset.index = index;
}

async function openDialogEditAnimate() {
  const dialogContainer = document.getElementById("dialog-edit");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
}

function openDialogEditShowGreyBackground() {
  document.getElementById("grey-background").classList.remove("hidden");
}

function openDialogEditUpdateBigLetterCircle(contact, initials) {
  document.getElementById('bigLetterCircle').innerHTML = generateBigLetterCircle(contact, initials);
}

async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

async function openDialogContact(message) {
  const dialogContainer = document.getElementById("succesfullyCreated");
  const dialogResponse = document.getElementById('succesfullyDeleted');
  dialogResponse.innerHTML = message;
  openDialogContactTimeout(dialogContainer);
}

async function openDialogContactTimeout(dialogContainer) {
  setTimeout(async () => {
      dialogContainer.open = true;
      await sleep(300);
      dialogContainer.classList.add("dialog-open");
      dialogContainer.classList.add("d-flex");
      await sleep(1000);
      dialogContainer.classList.remove("dialog-open");
      await sleep(300);
      dialogContainer.classList.remove("d-flex");
      dialogContainer.open = false;
  }, 300);
}