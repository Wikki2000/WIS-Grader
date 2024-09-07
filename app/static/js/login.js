import { ajaxRequest, alertBox } from './utils.js';

$(document).ready(function () {

  $('.register__form').submit(function (event) {
    event.preventDefault();
    const alertDivClass = 'auth__alert__msg';
    // Clear Previous Message
    $(`.${alertDivClass}`).hide();

    $('.loader').show();
    $('.signup__btn').hide()

    const email = $('#email').val();
    const password = $('#password').val();

    const data = JSON.stringify({
      email: email,
      password: password
    });

    ajaxRequest('/account/signin', 'POST', data,
      function (response) {
        if (response.message === "Login Successful") {
          const msg = 'Login Successfull';
          alertBox(alertDivClass, msg, false);

          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
      },
      function (error) {
        const msg = 'Invalid Email or Password';

        // Hide loader and display button to user on error
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.signup__btn').show()
        
      }
    );
  });
});

