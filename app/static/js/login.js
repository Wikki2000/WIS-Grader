import { ajaxRequest } from './utils.js'

$(document).ready(function () {

  // Handle login form submission
  $('.register__form').submit(function (event) {
    event.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    // Check if email and password are not empty
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    const data = JSON.stringify({
      email: email,
      password: password
    });

    const url = 'http://127.0.0.1:5000/account/signin';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.access_token) {
          // Set the access token as a cookie
          document.cookie = `access_token_cookie=${response.access_token}; secure=true; httponly=true`;
          alert("Login Successful");
          sessionStorage.removeItem('registration_data');
          
          // Redirect to dashboard
          window.location.href = '/dashboard';  // Dashboard dummy route
        } else {
          alert("Invalid Email or Password");
        }
      },
      (error) => {
        console.error('An error occurred during login', error);
        alert("Invalid Email or Password");
      }
    );
  });
});
