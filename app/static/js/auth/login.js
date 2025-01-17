import {
  togglePasswordVisibility, ajaxRequest, getBaseUrl, alertBox
} from '../global/utils.js'; 

$(document).ready(function () {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  togglePasswordVisibility('password', 'passwordIconId');
  $('#login-form').submit(function (event) {
    event.preventDefault();
    const alertDivClass = 'auth-alert';
    $(`.${alertDivClass}`).hide();
    $('.loader').show();
    $('#signin-btn').hide();

    const data = JSON.stringify(
      {
        email_or_username: $('#email_or_username').val(),
        password: $('#password').val(),
      }
    );
    const url = API_BASE_URL + '/account/login';
    ajaxRequest(url, "POST", data,
      (response) => {
        // Set user ID and name in session for quick recovery.
        //localStorage.setItem('userName', response.username);
        window.location.href = APP_BASE_URL + '/dashboard';
      },
      (error) => {
        // Hide loader and display button to user on error
        const msg = 'Invalid Login Credentials';
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('#signin-btn').show();
      }
    );
  })
});
