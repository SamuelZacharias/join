function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openDialog() {
  // event.stopPropagation();
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

async function openDialogEdit(){
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
}

async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

let contacts = [];

function addContact() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (name && email && phone) {
        const newContact = {
            name: name,
            email: email,
            phone: phone
        };

        contacts.push(newContact);

        // Zum Testen in der Konsole ausgeben
        console.log(contacts);

        // Formular zurücksetzen
        document.getElementById('contactForm').reset();
    } else {
        alert('Bitte füllen Sie alle Felder aus.');
    }
}