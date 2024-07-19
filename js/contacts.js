function openDialog(){
    // event.stopPropagation();
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey-background").classList.remove("hidden");
}

function closeDialog(){
    const dialogContainer = document.getElementById("dialog-contacts");
    dialogContainer.open = false;
    dialogContainer.classList.remove("d-flex");
    document.getElementById("grey-background").classList.add("hidden");
}