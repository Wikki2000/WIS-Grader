import { ajaxRequest, getBaseUrl, goBack } from '../global/utils.js';

$(document).ready(function () {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  goBack('back-arrow'); // Go back to prev page

  $('#reset-form').submit(function (event) {
    event.preventDefault();

    // Show animation and hide butthon
    // while waiting for server response
    $('.loader').show();
    $('#reset-btn').hide();

    const password1 = $('#password').val();
    const password2 = $('#verify-password').val();

    if (password1 !== password2) {
      $('input[type="password"]').addClass('error-password');
      $('.loader').hide();
      $('#reset-btn').show();
      $('#error-box').show();
      return;
    }
    const data = JSON.stringify({ password: password1 });
    const url = API_BASE_URL + '/account/reset-password';

    ajaxRequest(url, "PUT", data,
      (response) => {
        $('#complete-modal').show();
        $('input[type="password"]').addClass('correct-password');
      },
      (error) => {
        $('.loader').hide();
        $('#reset-btn').show();
      }
    );

    $('#reset__complete-btn').click(function() {
      window.location.href = APP_BASE_URL + '/account/login';
    });
  });
});
