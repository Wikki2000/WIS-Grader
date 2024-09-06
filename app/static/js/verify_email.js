import { ajaxRequest, alertBox } from './utils.js';

$(document).ready(function () {
  $('#verify-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('.primary__btn').hide();

    const token = (
      $('#f1').val() + $('#f2').val() + $('#f3').val() +
      $('#f4').val() + $('#f5').val() + $('#f6').val()
    )

    const data = JSON.stringify({ token: token});
    const url = 'http://127.0.0.1:5000/account/verify-email';

    ajaxRequest(url, "POST", data,
      (response) => {
        if (response.status == "Success") {
          window.location.href = 'http://127.0.0.1:5000/account/verify-success';
         }
      },
      (error) => {
	const alertDivClass = 'auth__alert__msg';
        const msg = 'Invalid or Expired Token';
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.primary__btn').show();
      }
    );
  });
});
