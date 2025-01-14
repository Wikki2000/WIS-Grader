import {
  alertBox, ajaxRequest, getBaseUrl
} from '../global/utils.js';

$(document).ready(function() {
  const APP_BASE_URL =  getBaseUrl()['appBaseUrl'];
  const API_BASE_URL =  getBaseUrl()['apiBaseUrl'];
  const alertDivClass = 'auth-alert';
  $(`.${alertDivClass}`).hide();

  // Listen for input event on each code-input field
  $('input[type="text"]').on('input', function() {
    // Check any value is entered and not the end of input field.
    if ($(this).val !== '' && $(this).next().length) {
      $(this).next().focus();
    }
  });

  // Listen for backspace to navigate to the previous input
  $('input[type="text"]').on('keydown', function(e) {
    let $current = $(this);
    if (e.key === 'Backspace' && $current.val() === '' && $current.prev().length) {
      $current.prev().focus();
    }
  });

  $('#verify-form').submit(function (event) {
    event.preventDefault();

    $('.loader').show();
    $('#otp-btn').hide();

    const token = (
      $('#f1').val() + $('#f2').val() +
      $('#f3').val() + $('#f4').val() +
      $('#f5').val() + $('#f6').val()
    )
    const data = JSON.stringify({ token });

    const url = API_BASE_URL + '/account/verify';
    ajaxRequest(url, "POST", data,
      (response) => {
        window.location.href = APP_BASE_URL + '/dashboard';
      },
      (error) => {
        if (error.status === 401) {
          $('input').addClass('error-password');
          const msg = 'Invalid or Expired Token';
          alertBox(alertDivClass, msg)
          $(this).trigger('reset');
        } else {
          const msg = 'An error occured. Try again !';
          alertBox(alertDivClass, msg);
        }
        $(this).trigger('reset');
        // Hide loader and display button to user on error
        $('.loader').hide();
        $('#otp-btn').show();
      }
    );
  });
});
