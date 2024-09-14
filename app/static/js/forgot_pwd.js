import { ajaxRequest, alertBox } from './utils.js';

$(document).ready(function () {
  $('#forgot-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('.auth-card__button').hide();

    const data = JSON.stringify({ email: $('#email').val() });
    const url = '/account/forgot-password';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
	  alert("success");
	  window.location.href = 'static/reset-password-email-sent';
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
