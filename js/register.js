
const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/"



async function showFireBaseData(){
  let response =  await fetch(BASE_URL + ".json")
  let responseAsJason = await response.json()
  console.log(responseAsJason);
  
}

function getRegisterInfo(){
    letRegisterInfo = {}
    let registerName = document.getElementById('name').value;
    console.log(registerName);
    let registerMail = document.getElementById('email').value;
    console.log(registerMail);
    let registerPassword = document.getElementById('password').value;
    console.log(registerPassword);
    let registerRepeatPassword = document.getElementById('repeatPassword').value;
    console.log(registerRepeatPassword);

}


var registerInfo = {
  name : "",
  mail : "",
  password : "",
  repeatPassword : "",
};