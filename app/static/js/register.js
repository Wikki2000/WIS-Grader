import { ajaxRequest } from './utils.js';


$(document).ready(function () {

  // Ensure password match and meet some criteria.
  $('.signup__btn').click(function (event) {

    const pwd1 = $("#password").val();
    const pwd2 = $("#confirm_password").val();
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (pwd1 !== pwd2) {
      event.preventDefault();
      alert('Password Must Match');
    } else if (!passwordPattern.test(pwd1)) {
      event.preventDefault();
      alert('Must pass password criteria');
    }
  });

  //Handles Form Submission
  $('#reg-form').submit(function (event) {
    event.preventDefault();

    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const password = $('#password').val() 

    const data = JSON.stringify({
      firstname: firstName, email: email,
      lastname: lastName, password: password
    });
    const url = 'http://127.0.0.1:5000/account/signup';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
          window.location.href = `http://127.0.0.1:5000/account/verify-email?email=${email}`;

         }
      },
      (error) => {
        console.error('An error occurred while submitting form');
      }
    );
  });
});
