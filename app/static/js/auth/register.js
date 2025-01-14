import { ajaxRequest, alertBox, getBaseUrl,  } from '../global/utils.js';

$(document).ready(function () {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  const alertDivClass = 'auth-alert';
  const pwd_input_border = $('input[type="password"]');

  // Ensure password match and meet some criteria.
  $('.button--signup').click(function (event) {

    const pwd1 = $("#password").val();
    const pwd2 = $("#confirm_password").val();
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (pwd1 !== pwd2) {
      event.preventDefault();
      const msg = 'Password must match';
      alertBox(alertDivClass, msg);
      pwd_input_border.addClass('highlight__pwd__input');
    } else if (!passwordPattern.test(pwd1)) {
      event.preventDefault();
      const msg = 'Password must be atleast 8 characters and ' +
        'contains uper, lowercase and special character';
      alertBox(alertDivClass, msg);
    }
  });

  //Handles Form Submission
  $('#reg-form').submit(function (event) {
    event.preventDefault();

    // Show loader and hide button each time form is submitted
    $('.loader').show();
    $('.button--signup').hide()

    // Clear Previous Message
    $(`.${alertDivClass}`).hide();

    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const password = $('#password').val()

    const data = JSON.stringify({
      first_name: firstName, email: email,
      last_name: lastName, password: password
    });
    const url = API_BASE_URL + '/account/send-token';

    ajaxRequest(url, "POST", data,
      (response) => {
        const msg = 'Registration Successfull. Continue to Verify Email';
        alertBox(alertDivClass, msg, false);

        setTimeout(() => {
          window.location.href = APP_BASE_URL + '/account/verify';
        }, 2000);

      },
      (error) => {
        if (error.status == 409) {
          const msg = 'This user already exist';
          alertBox(alertDivClass, msg);
          return;
        }
        console.log(error);
        const msg = 'An error occured. Try again !';
        alertBox(alertDivClass, msg)
        // Hide loader and display button to user on error
        $('.loader').hide();
        $('.button--signup').show()
      }
    );
  });
});
