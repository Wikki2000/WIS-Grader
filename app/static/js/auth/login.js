import { togglePasswordVisibility, ajaxRequest, getBaseUrl } from '../global/utils.js'; 

$(document).ready(function () {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  togglePasswordVisibility('password', 'passwordIconId');
  $('#login-form').submit(function (event) {
    event.preventDefault();
    const alertDivClass = 'auth__alert__msg';
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
	localStorage.setItem('userName', response.username);
        localStorage.setItem('userId', response.id);
        localStorage.setItem('role', response.role);
	localStorage.setItem('performance', response.performance);

	$('input').addClass('correct-password');
        setTimeout(() => {
          window.location.href = APP_BASE_URL + '/dashboard';
        }, 2000);
      },
      (error) => {
	$('#error-box').show();
	$('input').addClass('error-password');
        // Hide loader and display button to user on error
        $('.loader').hide();
        $('#signin-btn').show();
      }
    );
  })
});
