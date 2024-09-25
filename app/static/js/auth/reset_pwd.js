import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {

  const SERVER_URL_PREFIX = '/wisgrader';

  $('#reset-pwd-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('.auth-card__button').hide();

    const alertDivClass = 'auth__alert__msg';
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    const pwd1 = $('#pwd1').val();
    const pwd2 = $('#pwd2').val()

    if (pwd1 !== pwd2) {
      const msg = 'Password must match';
      alertBox(alertDivClass, msg);
      $('.loader').hide();
      $('.auth-card__button').show();
      return;
    } else if (!passwordPattern.test(pwd1)) {
      const msg = 'Password must be atleast 8 characters and ' +
                  'contains uper, lowercase and special character';
      alertBox(alertDivClass, msg);
      $('.loader').hide();
      $('.auth-card__button').show();
      return;
    }

    const data = JSON.stringify({ password: $('#pwd1').val() });
    const url = SERVER_URL_PREFIX + '/account/password-recovery';

    ajaxRequest(url, 'PUT', data,
      (response) => {
        if (response.status == "Success") {
          window.location.href = '/web_static/reset-password-success';
         }
      },
      (error) => {
        const msg = 'Inalid or Expired Token';
        alertBox(alertDivClass, msg);
        $('.loader').hide();
        $('.auth-card__button').show();
      }
    );
  });
});
