function goBack() {
  // Den Wert von loggedInUserName aus dem localStorage holen
  var loggedInUserName = localStorage.getItem("loggedInUserName");

  // Prüfen, ob der Wert leer oder null ist
  if (loggedInUserName === null || loggedInUserName === "") {
    // Wenn leer, zur index.html weiterleiten
    window.location.href = "index.html";
    
  } else {
    // Wenn nicht leer, zur summary.html weiterleiten
    window.location.href = "summary.html";
  }
}