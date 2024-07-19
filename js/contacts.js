function openDialog(event){
    event.stopPropagation();
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
}