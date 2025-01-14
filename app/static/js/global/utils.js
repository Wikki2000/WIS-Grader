/*=======================================================================
              Helper Function common amongst all Modules
=======================================================================*/
/**
 * Sanitize user input data
 *
 * @param {object} data - The data to be sanitize
 * @param {object} - The sanitized data
 */
export function sanitizeInput(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value !== "" ? value : null])
  );
}
/**
 * Converts form data into a dictionary (JavaScript object).
 *
 * @param {HTMLElement} formElement - The form element from which the data is extracted.
 * @return {Object} formDataDict - A dictionary where keys are the form field names and values are the field values.
 */
export function getFormDataAsDict($formElement) {
  var formDataArray = $formElement.serializeArray(); // Serialize the form data into an array of objects
  var formDataDict = {};

  // Convert the array into a dictionary (object)
  $.each(formDataArray, function(index, field) {
    formDataDict[field.name] = field.value;
  });

  return formDataDict;
}

/**
 * Preview selected image and return its Base64 string.
 * 
 * @param {string} inputSelector - Selector for the file input element (as a string for delegation).
 * @param {string} imageSelector - Selector for the image preview element (as a string for delegation).
 * @return {Promise<string>} - The Base64 string of the selected image.
 */
export function previewImageAndReurnBase64(inputSelector, imageSelector) {
  return new Promise((resolve, reject) => {
    $(document).on('change', inputSelector, function (e) {
      // Access the first selected file
      const files = e.target.files
      if (files) {
        const reader = new FileReader();

        // On successful read
        reader.onload = function (e) {
          $(imageSelector).attr('src', e.target.result); // Update the image preview
          resolve(e.target.result);
        };

        // On error
        reader.onerror = function () {
          console.log("Image preview updated error");
          reject('Error reading file content.');
        };

        reader.readAsDataURL(files[0]); // Read file as Base64
      } else {
        reject('No file selected');
      }
    });
  });
}

/**
 * Fetches data from the specified URL.
 *
 *
 * @param {string} url - The URL from which to fetch the data.
 * @returns {Promise} - A promise that resolves with the fetched data or rejects with an error.
 *
 * @example
 * fetchData('https://example.com/api/data')
 *   .then((data) => console.log(data))
 *   .catch((error) => console.error(error));
 */
export function fetchData(url) {
  return new Promise((resolve, reject) => {
    // Fetch data from the URL
    $.get(url)
      .done((data) => {
        resolve(data); // Resolve the promise with the fetched data
      })
      .fail((error) => {
        console.error('An error occurred while retrieving data:', error);
        reject(error); // Reject the promise with the error
      });
  });
}

/**
 * Format date to british format (DD/MM/YYYY)
 * @param {string} servereDate - The date from server
 *
 * @returns {string} - The formated date 
 */
export function britishDateFormat(servereDate) {
  if (!servereDate) {
    return '';
  }
  const date = new Date(servereDate);
  return date.toLocaleDateString('en-GB');
}

/**
 * Format date to british format (yyyy-MM-dd)
 * @param {string} servereDate - The date from server
 * @returns {string} - The formated date
 */
export function canadianDateFormat(servereDate) {
  if (!servereDate) {
    return '';
  }
  const date = new Date(servereDate);
  return date.toLocaleDateString('en-CA');
}

/**
 * Gets the current date in the format "22 November, 2024".
 * @returns {string} The current date formatted as "day month, year".
 */
export function getFormattedDate(serverDate = null) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = serverDate ? new Date(serverDate) : new Date();
  return date.toDateString('en-us', options);
}

/**
 * Load confirmation modal.
 *
 * @param {string} title - The heading text of modal.
 * @param {string} description - The description text of modal.
 * @param {string} confirmBtnClass - The modal btn confirmation class.
 * @param {Array} [extraData = null] - The data to be pass to modal.
 */
export function confirmationModal(
  title, description, confirmBtnClass, extraData = null
) {
  const url = getBaseUrl()['appBaseUrl'] + '/pages/confirmation_modal';
  $('#order__confirmation-modal').load(url, function() {

    $('#order__confirm-btn').addClass(confirmBtnClass);
    $('#order__popup-modal').css('display', 'flex');
    $('#order__popup-modal h2').text(title);
    $('#order__popup-modal p').text(description);

    if (extraData) {
      extraData.forEach(({ data, value }) => {
        $('#extraData').attr(`data-${data}`, value);
      });
    }
  });
}

/**
 * Close confirmation modal
 */
export function closeConfirmationModal() {
  $('#order__confirmation-modal').empty();
}


export function hideTableMenu() {
  $('.manage').hide();
}

/**
 * Compare server response date with current date
 * @param {string} serverDate - The date to be compare with present
 * @returns {boolean} - True if equal, otherwise false.
 */
export function compareDate(serverDate) {
  const serverDateObj = new Date(serverDate);
  const clientDateObj = new Date();

  // Compare the date portions
  return serverDateObj.toDateString() === clientDateObj.toDateString();
}

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
  contentType: 'application/json',
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
 * Define a dictionary of api and app base url,
 * this will make future changes in the base url easy.
 *
 * @return {object} - Object containing base url for api and app. 
 */
export function getBaseUrl() {
  return {
    apiBaseUrl: '/api/v1',
    appBaseUrl: '/app'
  }
}

/**
 * Go back to previous page.
 *
 * @param {string} iconId - The ID of icon to be click.
 */
export function goBack(iconId) {
  $(`#${iconId}`).click(function() {
    window.history.back();
  });
}

/**
 * Retrieve a query parameter value from the current page URL.
 *
 * This function extracts the value of a specified query parameter from the URL's search string.
 *
 * @param {string} param - The name of the query parameter to retrieve.
 * @return {string | null} - The value of the query parameter if found, or `null` if not found.
 */
export function getQueryParam(param) {
  // Create an instance of URLSearchParams from the current window's search string
  const urlParams = new URLSearchParams(window.location.search);

  // Retrieve and return the value of the specified parameter
  return urlParams.get(param);
}

/**
 * Display Popup menu list
 *
 * @param {Array} menuList - The menu list of items
 * @param {object} $selector - The current item clicked.
 */
export function displayMenuList(menuList, $selector, menuClass = "") {
  if (Array.isArray(menuList)) {
    // Clear existing dropdown items to avoid duplication
    $selector.siblings('.dropdown-menu')
      .find('.main__dropdown--menu-list')
      .empty();

    // Populate dropdown with room numbers
    menuList.forEach((menu) => {
      $selector.siblings('.dropdown-menu')
        .find('.main__dropdown--menu-list')
        .append(`<li class="dropdown-item ${menuClass}">${menu}</li>`);
    });

    // Add select to beginig of menu list
    /*
    $selector.siblings('.dropdown-menu')
      .find('.main__dropdown--menu-list')
      .prepend('<li class="dropdown-item main__dropdown-item">Select</li>');
      */
  } else {
    console.error('Rooms data is not an array:', menuList);
  }

  // Show the dropdown menu
  $selector.siblings('.dropdown-menu').toggle();
}

/**
 * Validates the given form element.
 *
 * @param {jQuery} $formElement - Form selector object.
 * @returns {boolean} - True if form is valid, otherwise false.
 */
export function validateForm($formElement) {
  let isValid = true;

  // Loop through all required input fields
  $formElement.find('input[required]').each(function() {
    const $currentInputField = $(this);
    if (!$currentInputField.val()) {
      isValid = false;
    }
  });
  return isValid;
}

/**
 * Displays a notification message.
 * @param {string} message - The message to display in the notification.
 * @param {boolean} [isError=false] - Flag to indicate if the notification is an error.
 */
export function showNotification(message, isError = false) {
  // Create the notification container
  const notificationClass = isError ? 'notification error' : 'notification success';
  const $notification = $(`
        <div class="${notificationClass}">
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        </div>
    `);

  // Append notification to the body
  $('body').append($notification);

  // Automatically fade out and remove the notification after 5 seconds
  setTimeout(() => {
    $notification.fadeOut(400, function () {
      $(this).remove();
    });
  }, 7000);

  // Remove notification when clicking the close button
  $notification.find('.close-btn').on('click', function () {
    $notification.fadeOut(400, function () {
      $(this).remove();
    });
  });
}

/**
 * Update count of target element.
 *
 * @param {jQuery} $targetElement -The target element to update count.
 * @param {boolean} [isIncrease=false] - Flag to indicate if count is increase or reduce.
 */
export function updateElementCount($targetElement, isIncrease = false) {
  const elementCount = $($targetElement).text();

  const reduceCount = parseInt(elementCount) === 0 ? 0: parseInt(elementCount) - 1;
  const increaseCount = parseInt(elementCount) + 1;

  const currentCount = isIncrease ? increaseCount : reduceCount;
  $($targetElement).text(currentCount);
  return currentCount;
}

/*================================================================
        Helper Function for staff_dashboard Modules
=================================================================*/

/**
 * Persist the highlighted class item order
 *
 * @param {Array} cart - The cart containing items order
 */
export function highLightOrderBtn(cart) {
  // Get the key, which is the ID of selected items
  const cartItems = Array.from(CART.keys());

  cartItems.forEach((cartItemId) => {
    $(`button[data-id="${cartItemId}"]`).addClass('highlight-btn');
  });
}

/**
 * Calculate total amount of item ordered
 *
 * @param {object} cart - The CART for storing item ordered
 * @param {Float} - The total amount of all items ordered
 */
export function cartItemsTotalAmount(cart) {
  if (cart.size === 0) {
    return 0;
  }

  const cartItemsAmountList = Array.from(
    cart.values(), item => item.itemAmount.replaceAll(',', '')
  );
  return cartItemsAmountList.reduce(
    (sum, value) => sum + parseFloat(value), 0
  );
}

/*
 * Hide all sections of staff management dashboard.
 */
export function hideAllStaffManagmentDashboard() {
  $('#staff__list').hide();
  $('#staff__loan-list').hide();
  $('#staff__leave-list').hide();
  $('#staff__profile').hide();
  $('#loan-content').hide();
}


/*
 * Toggle table menu icon visibility
 */
export function togleTableMenuIcon() {
  $('.fa-ellipsis-v').show();
  $('.fa-times').hide();
  $('.manage').hide();
}
