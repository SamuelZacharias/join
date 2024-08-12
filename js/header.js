document.addEventListener('DOMContentLoaded', () => {
  let includesLoadedHandled = false;

  document.addEventListener('includesLoaded', handleIncludesLoaded);

  function handleIncludesLoaded() {
    if (!includesLoadedHandled) {
      includesLoadedHandled = true;
      handleUserProfile();
    }
  }

  function handleUserProfile() {
    let loggedInUserName = localStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
      let initials = getInitials(loggedInUserName);
      updateInitialsElement(initials);
    }
  }

  function getInitials(userName) {
    let nameParts = userName.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  }

  function updateInitialsElement(initials) {
    let initialsElement = document.getElementById('user-profile-initials');
    if (initialsElement) {
      initialsElement.innerHTML = `${initials}`;
      initialsElement.addEventListener('click', toggleLogOutVisibility);
    }
  }

  function toggleLogOutVisibility() {
    let logOutElement = document.getElementById('logOut');
    if (logOutElement) {
      logOutElement.classList.toggle('d-none');
    }
  }

  document.addEventListener('click', handleDocumentClick);

  function handleDocumentClick(event) {
    let logOutElement = document.getElementById('logOut');
    let initialsElement = document.getElementById('user-profile-initials');

    if (logOutElement && !logOutElement.contains(event.target) &&
      !initialsElement.contains(event.target) &&
      !event.target.closest('#logOut')) {
      logOutElement.classList.add('d-none');
    }
  }
});

function logout() {
  localStorage.removeItem('loggedInUserName');
  localStorage.removeItem('loggedInUserEmail');
  sessionStorage.setItem('ShowGreetingScreen', 'false');
  sessionStorage.removeItem('loggedInUserName');
}

function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          elmnt.removeAttribute("w3-include-html");
          includeHTML(callback);
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (callback) callback();
}

function hideElements() {
  if (!localStorage.getItem('loggedInUserName')) {
    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
          .icon-bar { display: none !important; }
          #user-profile-initials { display: none !important; }
          .credit-box { height: 655px !important; }
          .icon-box { width: 42px !important; }
      `;
    document.head.appendChild(styleSheet);
  }
}


 

document.addEventListener('DOMContentLoaded', function() {
  checkForHeaderLogo();
});


function checkForWidthHeader() {
  let logoContainer = document.getElementById('headerLogo');
  if (logoContainer) {
    logoContainer.innerHTML = window.innerWidth < 600 
      ? `<img src="/assets/img/png/Capa 2.png">` 
      : `<span>Kanban Project Management Tool</span>`;
  }
}

function checkForHeaderLogo() {
  let logoContainer = document.getElementById('headerLogo');
  if (logoContainer) {
    checkForWidthHeader();
    window.addEventListener('resize', checkForWidthHeader);
  } else {
    setTimeout(checkForHeaderLogo, 100);
  }
}

includeHTML(hideElements);