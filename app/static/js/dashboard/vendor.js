import { 
  confirmationModal, fetchData, sanitizeInput,
  ajaxRequest, getBaseUrl, showNotification,  getFormDataAsDict
} from '../global/utils.js';
import  { vendorListTemplate } from '../global/templates1.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const USER_ROLE = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  // Load vendor List's
  $('#dynamic__load-dashboard').on('click', '#vendor__list-btn', function() {
    const vendorUrl = APP_BASE_URL + '/pages/vendor';

    $('#sidebar__main').removeClass('highlight-sidebar');

    $('#dynamic__load-dashboard').load(vendorUrl, function() {
      const vendorUrl = API_BASE_URL + '/vendors';

      // Hide the add new vendor button if logged-in user is a staff.
      if (USER_ROLE === 'staff') {
        $('#add__vendor-btn').hide();
      }

      fetchData(vendorUrl)
        .then((data) => {
          data.forEach((vendor) => {
            $('#vendor__list-table--body').append(vendorListTemplate(vendor));
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  // Handle deletion of vendor
  $('#dynamic__load-dashboard')
    .off('click', '#vendor__list-table--body .fa-trash')
    .on('click', '#vendor__list-table--body .fa-trash', function() {

      const vendorId = $(this).data('id');

      const headingText = 'Confirm Removal of Vendor';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'vendor__delete-confirmBtn';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard')
        .off('click', '.vendor__delete-confirmBtn')
        .on('click', '.vendor__delete-confirmBtn', function() {

          const staffDeleteUrl = API_BASE_URL + `/vendors/${vendorId}/delete`;
          ajaxRequest(staffDeleteUrl, 'DELETE', null,
            (response) => {
              $('#order__confirmation-modal').empty();
              $(`#vendor__list-table--body tr[data-id="${vendorId}"]`).remove();
              showNotification(`Vendor (${response.name}) Remove successfully !`);
            },
            (error) => {
              $('#order__confirmation-modal').empty();
              console.log(error);
            }
          );
        });
    });

  $('#dynamic__load-dashboard')
    .off('click', '#vendor__list-table--body .fa-edit')
    .on('click', '#vendor__list-table--body .fa-edit', function() {
      const vendorId = $(this).data('id');

      const vendorUrl = API_BASE_URL + `/vendors/${vendorId}/get`;
      fetchData(vendorUrl)
        .then((data) => {
          $('#vendor__add-edit').css('display', 'flex');

          $('input[name="name"]').val(data.name);
          $('input[name="number"]').val(data.number);
          $('input[name="portfolio"]').val(data.portfolio);
          $('#vendor_id').val(data.id);

          $('#vendor__form-add-edit').addClass('edit__vendor-form');
        })
        .catch((error) => {
          console.log(error);
        });
    });

  // Add new vendor to the list
  $('#dynamic__load-dashboard')
    .off('click', '#add__vendor-btn')
    .on('click', '#add__vendor-btn', function() {
      $('#vendor__add-edit').css('display', 'flex');
      $('#vendor__form-add-edit').addClass('add__vendor-form');
    });

  // Submission of form for Add/Edit vendor
  $('#dynamic__load-dashboard')
    .on('submit', '#vendor__form-add-edit', function(e) {
      e.preventDefault();

      const $formElement = $(this);
      const data = JSON.stringify(
        sanitizeInput(getFormDataAsDict($formElement))
      );
      $('#vendor__add-edit').hide();

      let url;
      let method;
      let msg;
      const vendorId = $('#vendor_id').val();
      if ($formElement.hasClass('edit__vendor-form')) {

        url = API_BASE_URL + `/vendors/${vendorId}/edit`;
        method ='PUT';
        msg = 'Vendor Record Successfullly Edited !';
      } else if ($formElement.hasClass('add__vendor-form')) {
        url = API_BASE_URL + '/vendors';
        method ='POST';
        msg = 'Vendor Added Successfullly !';
      }

      // Remove the temp class once form is submitted
      $('#vendor__form-add-edit').removeClass('add__vendor-form');
      $('#vendor__form-add-edit').removeClass('edit__vendor-form');

      // Reset form
      $('#vendor__form-add-edit').trigger('reset');

      ajaxRequest(url, method, data,
        (response) =>  {
          console.log(response);
          showNotification(msg);
          if (method === 'PUT') {
            $(`#vendor__list-table--body tr[data-id="${vendorId}"] .name`).text(response.name);
            $(`#vendor__list-table--body tr[data-id="${vendorId}"] .number`).text(response.number);
            $(`#vendor__list-table--body tr[data-id="${vendorId}"] .portfolio`).text(response.portfolio);
          } else if(method === 'POST') {
            $('#vendor__list-table--body').prepend(vendorListTemplate(response));
          }
        },
        (error) => {
          showNotification('Oops! An error occured, Try Again !', true);
        }
      );
    });
});
