import { ajaxRequest, alertBox, getBaseUrl, goBack } from '../global/utils.js';

$(document).ready(function () {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  goBack('back-arrow'); // Go back to prev page

  $('#forgot-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('#forgot-password').hide();

    const email = $('#email').val();
    const data = JSON.stringify({ email: email });
    const url = API_BASE_URL + '/account/reset-token';

    ajaxRequest(url, "POST", data,
      (response) => {
	sessionStorage.setItem('email', email);
        window.location.href = APP_BASE_URL + '/account/otp';
      },
      (error) => {
	$('#error-box').show();
	$('input[type="email"]').addClass('error');
        $('.loader').hide();
        $('#forgot-password').show();
      }
    );
  });
});
