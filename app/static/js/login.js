import { ajaxRequest } from './utils.js';

$(document).ready(function () {

  $('.register__form').submit(function (event) {
    event.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    const data = JSON.stringify({
      email: email,
      password: password
    });

    ajaxRequest('http://127.0.0.1:5000/account/signin', 'POST', data,
      function (response) {
        if (response.message === "Login Successful") {
          window.location.href = 'http://127.0.0.1:5000/dashboard';
        } else {
          alert("Invalid Email or Password");
        }
      },
      function (error) {
        alert("An error occurred during login");
      }
    );
  });
});

