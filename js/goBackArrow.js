function goBack() {
  var loggedInUserName = localStorage.getItem("loggedInUserName");
  if (loggedInUserName === null || loggedInUserName === "") {
    window.location.href = "index.html";
    
  } else {
    window.location.href = "summary.html";
  }
}