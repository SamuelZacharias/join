function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function openDialog(){
    // event.stopPropagation();
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open")
  document.getElementById("grey-background").classList.remove("hidden");
}

async function closeDialog(){
    const dialogContainer = document.getElementById("dialog-contacts");
    dialogContainer.classList.remove("dialog-open")
    document.getElementById("grey-background").classList.add("hidden");
    await sleep(300);
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;;
    
}