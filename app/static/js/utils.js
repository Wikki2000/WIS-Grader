/**
 * Sends an AJAX request.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {string} method - The HTTP method to use for request.
 * @param {object} data - The data to send with the request. Default is an empty object.
 * @param {function} onSuccess - Callback function to execute if the request succeeds.
 * @param {function} onError - Callback function to execute if the request fails.
 */
export function ajaxRequest(url, method, data = {}, onSuccess, onError) { $.ajax({
  url: url,
  method: method,
  contentType: method == 'GET' ? null: 'application/json',
  data: method == 'POST' || method == 'PUT' ? data : null,
  success: onSuccess,
  error: onError,
});
}

/**
 * Toggle password visibility.
 *
 * @param {string} passwordFieldId - The ID of password field.
 * @param {string} toggleButtonId - The ID of button to toggle password.
 */
export function togglePasswordVisibility(passwordFieldId, toggleButtonId) {
  $(`#${toggleButtonId}`).click(function () {
    const $password = $(`#${passwordFieldId}`);

    if ($password.attr('type') === 'password') {
      $password.attr('type', 'text');
    } else {
      $password.attr('type', 'password');
    }
  });
}

/**
 * Alert box for success and error.
 *
 * @param {string} alertDivClass - The class of the Alert DIV.
 * @param {bool} isError - Give a true or false value if it is an error alert.
 * @param {string} successClass - Class for successfull alert with default value.
 * @param {string} errorClass - Class for error alert with default value.
 * @param {string} msg - Message to be display on alert box.
 */
export function alertBox(
  alertDivClass, msg, isError = true,
  successClass = 'auth__success__alert',
  errorClass = 'auth__error__alert'
) {
  if (isError) {
    $(`.${alertDivClass}`).removeClass(successClass)
      .addClass(errorClass).text(msg).show();
  } else {
    $(`.${alertDivClass}`).removeClass(errorClass)
      .addClass(successClass).text(msg).show();
  }
}

/**
 * Send DELETE request to API to delete an object using it ID.
 *
 * @param {string} entityEndpoint - Endpoint for DELETE request in server side.
 * @param {string} entityId - Unique identifier of object to be deleted
 */
export function deleteEntity(entityEndpoint, entityId) {
  $('#popup__modal').load('/static/modal-confirm-delete', function () {

    // Send request to delete after clicking delete button
    $('#button__confirm-delete').click(function () {
      ajaxRequest(`${entityEndpoint}/${entityId}`, 'DELETE', null,
        (response) => {
          if (response.status == 'Success') {

            $('#popup__modal').load('/static/modal-success', function () {

              $('P.modal__subtitle').append('Item deleted successfully!');

              $('body').on('click', '#button__confirm-continue', function () {
                $('#popup__modal').empty();
                $(`#course_${entityId}`).remove();
              });

            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });

    $('#button__confirm-cancel, .fa-times').click(function () {
      $('#modal__delete').remove();
    });

  });
}
