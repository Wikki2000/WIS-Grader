import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {

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
      firstname: firstName, email: email,
      lastname: lastName, password: password
    });
    const url = '/account/signup';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
          const msg = 'Registration Successfull. Continue to Verify Email';
          alertBox(alertDivClass, msg, false);

          setTimeout(() => {
            window.location.href = '/account/verify';
          }, 2000);

         }
      },
      (error) => {
        const msg = 'This user already exist';
        alertBox(alertDivClass, msg);

        // Hide loader and display button to user on error
        $('.loader').hide();
        $('.button--signup').show()
      }
    );
  });
});
