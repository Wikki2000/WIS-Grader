import {
  getBaseUrl, confirmationModal, fetchData, sanitizeInput,
  getFormDataAsDict, previewImageAndReurnBase64, validateForm,
  showNotification, ajaxRequest, canadianDateFormat
} from '../global/utils.js';
import  { displayMaintenance } from '../global/templates1.js';


$(document).ready(function() {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  // Switch dashboard section of maintenance
  $('#dynamic__load-dashboard')
    .off('click', '#maintenance__history-btn, #maintenance__report-btn')
    .on('click', '#maintenance__history-btn, #maintenance__report-btn',
      function() {
        const $clickItem = $(this);
        const clickId = $clickItem.attr('id');

        $('#maintenance__report-fault').hide();
        $('#maintenance__history').hide();

        $clickItem.addClass('highlight-btn');
        $clickItem.siblings().removeClass('highlight-btn');

        switch (clickId) {
          case 'maintenance__history-btn': {
            $('#maintenance__history').show();
            break;
          }
          case 'maintenance__report-btn': {
            $('#maintenance__report-fault').show();
            break;
          }
        }
      });

  // Trigger file input when image is clicked.
  $('#dynamic__load-dashboard').off('click', '#maintenance__fault-photo')
    .on('click', '#maintenance__fault-photo', function() {
      $('#maintenance__file-input').click();

      // Function triggered when profile images is click.
      const $fileInputSelector = $('#maintenance__file-input');
      const $imgSelector = $('#maintenance__fault-photo');
      previewImageAndReurnBase64($fileInputSelector, $imgSelector)
        .then((Base64String) => {
          $('input[name="fault_photo"]').val(Base64String);
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    });

  // Load menu for room number
  $('#dynamic__load-dashboard').off('click', '#maintenance__room-menu-btn')
    .on('click', '#maintenance__room-menu-btn', function() {
      $('#room-number').empty();
      const url = API_BASE_URL + '/room-number';

      fetchData(url)
        .then((data) => {
          data.forEach((roomNumber) => {
            $('#maintenance__room-number--dropdown').show();
            $('#maintenance__room-menu--list').append(`<li class="dropdown-item maintenance__room-dropdown-item">${roomNumber}</li>`);
          });
        })
        .catch((error) => {
          console,log(error);
        });
    });

  // Handle selection of option from table menu
  $('#dynamic__load-dashboard')
    .on('click', '.maintenance__room-dropdown-item', function() {
      $('#maintenance__room-number--dropdown').hide();
      const selectedOption = $(this).text();
      $('#maintenance__room-menu-btn p').text(selectedOption);
    });
  // Handle reporting of fault.
  $('#dynamic__load-dashboard').off('click', '#report-btn')
    .on('click', '#report-btn', function() {
      const roomNumber = $('#maintenance__room-menu-btn span').text();
      const faultType = $('#report').val();
      const description = $('#short-note').val();
      const image = $('input[name="fault_photo"]').val();

      const url = API_BASE_URL + '/maintenances';

      if (!faultType || !description) {
        showNotification('Please fill out all required fields', true);
        return;
      } else if(roomNumber === 'Select') {
        showNotification('Please fill out all required fields', true);
        return;
      }
      const data = { room_number: roomNumber, fault: faultType, description, image };
      ajaxRequest(url, 'POST', JSON.stringify(sanitizeInput(data)),
        (response) => {
          displayMaintenance(response);
          showNotification('Maintenence Added Successfully');
        },
        (error) => {
          showNotification('Oops! An Error Ocured, Try Again !', true);
        }
      );
    });

  // Display menu for maintenance status
  $('#dynamic__load-dashboard').on('click', '#maintenance__dropdown', function (e) {
    e.stopPropagation(); // Prevent the click event from propagating to the document
    $('#maintenance__dropdown-menu').toggle(); // Toggle visibility
  });

  // Select and show option from  menu
  $('#dynamic__load-dashboard')
    .off('click', '.maintenance__dropdown-item')
    .on('click', '.maintenance__dropdown-item', function (e) {
      e.stopPropagation(); // Prevent the click event from propagating
      const selectedStatus = $(this).text();

      $('#maintainance__status').val(selectedStatus);  // Update the hidden input field once menu is selected.

      $('#maintenance__dropdown-menu').hide(); // Hide the menu after selection
      $('.maintenance__dropdown-btn span').text(selectedStatus);
    });

  // Change maintenance status
  $('#dynamic__load-dashboard')
    .off('click', '#maintanence__status-btn')
    .on('click', '#maintanence__status-btn', function() {
      const selectedStatus = $('#maintainance__status').val().toLowerCase();
      const maintenanceId = $('#maintainance__id').val();

      const url = (
        API_BASE_URL + `/maintenances/${maintenanceId}/${selectedStatus}/status`
      );

      const statusColor = selectedStatus === 'fixed' ? 'green' : 'red';
      const statusText = selectedStatus === 'fixed' ? 'Fixed' : 'Pending';

      $('#maintenance__popup-modal').hide();
      $(`#maintenance__history-table--body tr[data-id="${maintenanceId}"] .maintenance__report-status`).css('color', statusColor);
      $(`#maintenance__history-table--body tr[data-id="${maintenanceId}"] .maintenance__report-status`).text(statusText);

      ajaxRequest(url, 'PUT', null,
        (response) => {

          showNotification(`Maintenance Status Changed successfully !`);
        },
        (error) => {
          if (error.status === 403) {
            showNotification('Restricted Access. Contact the Management!', true);
            return;
          }
          showNotification('An error occured. Try again !', true);
          console.log(error);
        }
      );
    });

  // Display popup modal for maintenance history.
  $('#dynamic__load-dashboard')
    .off('click', '#maintenance__history-table--body .maintenance__details')
    .on('click', '#maintenance__history-table--body .maintenance__details',
      function() {
        const maintenanceId = $(this).data('id');
        const url = API_BASE_URL + `/maintenances/${maintenanceId}/get`;

        fetchData(url)
          .then((data) => {
            const photoSrc = (
              data.image ?
              `data:image/;base64, ${data.image}` :
              '/static/images/public/profile_photo_placeholder.png'
            );
            const faultStatus = data.status ? 'Fixed': 'Pending';
            const roomNameNumber = data.room_number + ' ' + data.room_name;

            $('#maintenance__room').text(roomNameNumber);
            $('#maintenance__reported-fault').text(data.fault)
            $('#maintenance__reported-by').text(data.reported_by);
            $('#maintenance__fault-description').text(data.description);
            $('#maintainance__status').val(faultStatus);
            $('#maintenance__popup-modal').css('display', 'flex');
            $('#detail__maintenance-fault--image').attr('src', photoSrc);

            $('#maintainance__id').val(maintenanceId);  // To be retreieve when changing status of maintenance.

            $('.maintenance__dropdown-btn span').text(faultStatus);
          })
          .catch((error) => {
            console.log(error);
          });
      });

  // Handle deletion of Maintenance
  $('#dynamic__load-dashboard')
    .off('click', '#maintenance__history-table--body .delete__maintenance-option')
    .on('click', '#maintenance__history-table--body .delete__maintenance-option',
      function() {

        const maintenanceId = $(this).data('id');

        const headingText = 'Confirm';
        const descriptionText = 'This action cannot be undone !'
        const confirmBtCls = 'maintenance__delete-confirmBtn';

        confirmationModal(headingText, descriptionText, confirmBtCls);

        $('#dynamic__load-dashboard')
          .off('click', '.maintenance__delete-confirmBtn')
          .on('click', '.maintenance__delete-confirmBtn', function() {

            const url = API_BASE_URL + `/maintenances/${maintenanceId}/delete`;
            ajaxRequest(url, 'DELETE', null,
              (response) => {
                $('#order__confirmation-modal').empty();
                $(`#maintenance__history-table--body tr[data-id="${maintenanceId}"]`).remove();
                showNotification(`Maintenance  Remove successfully !`);
              },
              (error) => {
                $('#order__confirmation-modal').empty();
                console.log(error);
              }
            );
          });
      });

  // Handle the table menu option
  $(document).on('click', function (event) {
    const $target = $(event.target);

    if ($target.hasClass('options-button')) {
      const $menu = $target.next('.options-menu');
      $menu.css('display', $menu.css('display') === 'block' ? 'none' : 'block');
    } else {
      $('.options-menu').css('display', 'none');
    }
  });
});
