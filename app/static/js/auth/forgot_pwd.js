import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {

  const SERVER_URL_PREFIX = '/wisgrader';

  $('#forgot-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('.auth-card__button').hide();

    const data = JSON.stringify({ email: $('#email').val() });
    const url = SERVER_URL_PREFIX + '/account/forgot-password';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
	  alert("success");
	  window.location.href = 'web_static/reset-password-email-sent.html';
         }
      },
      (error) => {
	const alertDivClass = 'auth__alert__msg';
        const msg = 'Email does not exists';
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.auth-card__button').show();
      }
    );
  });
});
