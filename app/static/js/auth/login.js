import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {
  $('#auth-form').submit(function (event) {
    event.preventDefault();
    const alertDivClass = 'auth-alert';

    const email_input_border = $('input[type="email"]');
    const pwd_input_border = $('input[type="password"]');
    // Clear Previous Message
    $(`.${alertDivClass}`).hide();

    $('.loader').show();
    $('.button--signin').hide()

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

        email_input_border.addClass('highlight__pwd__input');
        pwd_input_border.addClass('highlight__pwd__input');
        // Hide loader and display button to user on error
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.button--signin').show()

      }
    );
  });
});

