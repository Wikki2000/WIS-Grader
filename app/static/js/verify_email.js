import { ajaxRequest, alertBox } from './utils.js';

$(document).ready(function () {
  $('#verify-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('.auth-card__button').hide();

    const token = (
      $('#f1').val() + $('#f2').val() + $('#f3').val() +
      $('#f4').val() + $('#f5').val() + $('#f6').val()
    )

    const data = JSON.stringify({ token: token});
    const url = '/account/verify';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
	  //window.location.href = '/account/verify-success';
	  window.location.href = '/static/email-confirmed';
         }
      },
      (error) => {
	const alertDivClass = 'auth-alert';
        const msg = 'Invalid or Expired Token';
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.auth-card__button').show();
      }
    );
  });
});
