import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {

  const SERVER_URL_PREFIX = '/wisgrader';

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
    const url = SERVER_URL_PREFIX + '/account/verify';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
	  //window.location.href = '/account/verify-success';
	  window.location.href = '/web_static/email-confirmed.html';
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
