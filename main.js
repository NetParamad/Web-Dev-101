// const validateData = (userData) => {
//  let errors = [];
//  if(!userData.firstname){
//   errors.push("firstname is required");
//  }
//  if(!userData.lastname){
//   errors.push("lastname is required");
//  }
//  if(!userData.age){
//   errors.push("age is required");
//  }
//  if(!userData.gender){
//   errors.push("gender is required");
//  }
//  if(!userData.interest){
//   errors.push("interest is required");
//  }
//  if(!userData.description){
//   errors.push("description is required");
//  }
//  return errors
// }

const BASE_URL = "http://localhost:8000";

let mode = "CEATE";
let selectId = "";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    mode = "EDIT";
    selectId = id;
  }

  try {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    const user = response.data[0];

    let firstNameDOM = document.querySelector("input[name=firstname]");
    let lastNameDOM = document.querySelector("input[name=lastname]");
    let ageDOM = document.querySelector("input[name=age]");
    let descriptionDOM = document.querySelector("textarea[name=description]");
    // console.log(user);
    firstNameDOM.value = user.firstname;
    lastNameDOM.value = user.lastname;
    ageDOM.value = user.age;
    descriptionDOM.value = user.description;

    let genderDOMs = document.querySelectorAll("input[name=gender]");
    let interestDOMs = document.querySelectorAll("input[name=interest]");

    for (let i = 0; i < genderDOMs.length; i++) {
      if (user.gender === genderDOMs[i].value) {
        genderDOMs[i].checked = true;
      }
    }

    for (let i = 0; i < interestDOMs.length; i++) {
      if (user.interest.includes(interestDOMs[i].value)) {
        interestDOMs[i].checked = true;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const submitData = async () => {
  let firstNameDOM = document.querySelector("input[name=firstname]");
  let lastNameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");

  let genderDOM = document.querySelector("input[name=gender]:checked") || {};
  let interestDOMs =
    document.querySelectorAll("input[name=interest]:checked") || {};
  let descriptionDOM = document.querySelector("textarea[name=description]");

  let messageDOM = document.getElementById("message");

  try {
    let interest = "";
    for (let i = 0; i < interestDOMs.length; i++) {
      interest += interestDOMs[i].value;
      if (i != interestDOMs.length - 1) {
        interest += ", ";
      }
    }
    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      interest: interest,
      description: descriptionDOM.value,
    };

    // const errors = validateData(userData);
    // if (errors.length > 0) {
    //   throw{
    //     message: 'invalid data',
    //     errors: errors
    //   };
    // }

    if (mode === "EDIT") {
      const response = await axios.put(
        `${BASE_URL}/users/${selectId}`,
        userData
      );
      console.log("Response", response.data);
      messageDOM.innerText = "User updated successfully";
      messageDOM.className = "message success";
      return;
    } else if (mode === "CEATE") {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      console.log("Response", response.data);
      messageDOM.innerText = "User created successfully";
      messageDOM.className = "message success";
    }
  } catch (err) {
    // console.log("Error message", err.message);
    // console.log("Error", err.errors);
    if (err.response) {
      console.log(err.response);
      err.message = err.response.data.message;
      err.errors = err.response.data.errors;
    }
    let htmlText = "<div>";
    htmlText += `<center>${err.message}</center>`;
    htmlText += "<ul>";
    for (let i = 0; i < err.errors.length; i++) {
      htmlText += `<li>${err.errors[i]}</li>`;
    }
    htmlText += "</ul>";
    htmlText += "</div>";
    messageDOM.innerHTML = htmlText;
    messageDOM.className = "message error";
  }
};
