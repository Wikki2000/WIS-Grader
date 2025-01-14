import {
  ajaxRequest, getBaseUrl, validateForm, confirmationModal,
  showNotification, fetchData, closeConfirmationModal, togleTableMenuIcon
} from '../global/utils.js';
import  { vatListTemplate } from '../global/templates1.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const USER_ROLE = localStorage.getItem('role');

  // Show popup menu to enter year for VAT lists
  $('#dynamic__load-dashboard')
    .off('click', '#main__vat-view--btn')
    .on('click', '#main__vat-view--btn', function() {
      $('#main__vat-year--inputPopup').css('display', 'flex');
    });

  // Show list of vat record's
  $('#dynamic__load-dashboard')
    .off('submit', '#main__enter-vat--yearForm')
    .on('submit', '#main__enter-vat--yearForm', function(e) {
      e.preventDefault();
      const vatYear = $('#main__vat-year--input').val();
      const url = APP_BASE_URL + '/pages/vat';

      const date = new Date();
      const currentYear = date.toLocaleDateString('en-GB').split('/')[2]

      $('#main__enter-vat--yearForm').trigger('reset');

      if (vatYear > currentYear) {
        $('#main__vat-year--inputPopup').hide();
        const msg = `The entered year (${vatYear}) must not be more than current year (${currentYear}).`;
        showNotification(msg, true);
        return;
      }

      $('#sidebar__main').removeClass('highlight-sidebar');

      $('#dynamic__load-dashboard').load(url, function() {

        $('#main__vat-year').text(vatYear);

        const vatUrl = API_BASE_URL + `/vats/${vatYear}/get`;
        fetchData(vatUrl)
          .then((data) => {
            data.forEach((vat) => {
              $('#vat__list-table--body').append(vatListTemplate(vat));
            });
          })
          .catch((error) => {
          });
      });
    });

  // Change payment status of VAT
  $('#dynamic__load-dashboard')
    .off('click', '#vat__list-table--body .vatcat__payment-status')
    .on('click', '#vat__list-table--body .vatcat__payment-status', function() {
      const vatId = $(this).data('id');
      const vatUrl = API_BASE_URL + `/vats/${vatId}/status`

      const headingText = 'Confirm Payment of VAT';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'main__confirm-vat--payment';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard')
        .off('click', '.main__confirm-vat--payment')
        .on('click', '.main__confirm-vat--payment', function() {

          closeConfirmationModal();
          togleTableMenuIcon();

          $(`#vat__list-table--body tr[data-id="${vatId}"] .manage`).hide();
          ajaxRequest(vatUrl, 'PUT', null,
            (success) => {
              $(`#vat__list-table--body tr[data-id="${vatId}"] .status`)
                .css('color', 'green');
              $(`#vat__list-table--body tr[data-id="${vatId}"] .status`)
                .text('Paid');

              const month = $(`#vat__list-table--body tr[data-id="${vatId}"] .month`).text();
              showNotification(`${month} VAT Status Updated Successfully !`);
            },
            (error) => {
              console.log(error);
            }
          );
        });
    });

  // Add new vat to the list
  $('#dynamic__load-dashboard')
    .off('click', '#add__vat-btn')
    .on('click', '#add__vat-btn', function() {
      $('#vat__add-edit').css('display', 'flex');
    });

  $('#dynamic__load-dashboard').off('submit', '#vat__form-add-edit')
    .on('submit', '#vat__form-add-edit', function(e) {
      e.preventDefault();

      const month = $('input[name="month"]').val();
      const amount = $('input[name="amount"]').val();
      const paymentStatus = $('input[name="status"]').val().toLowerCase();

      const date = new Date();
      const currentMonth = date.toLocaleDateString('en-GB').split('/')[1];


      // Ensure that paymentstatus enter is pending or paid
      if (paymentStatus != 'pending' && paymentStatus != 'paid') {
        showNotification('Enter valid payment status (paid or pending)', true);
        return;
      }

      // Ensure that VAT is only entered for current month
      if (currentMonth < month.split('-')[1]) {
        showNotification('VAT not dew for payment', true);
        return;
      }

      const payStatus = paymentStatus === 'paid' ? true : false;
      $('#vat__add-edit').hide();

      // Reset form
      $('#vat__form-add-edit').trigger('reset');

      const headingText = 'Confirm Adding VAT';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'main__confirm-adding--vat';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard').off('click', '.main__confirm-adding--vat')
        .on('click', '.main__confirm-adding--vat', function() {

          const yearEnter = month.split('-')[0];
          const currentYearVatList = $('#main__vat-year').text();

          $('#order__confirmation-modal').empty();

          if (currentYearVatList !=  yearEnter) {
            const msg = `The entered year (${yearEnter}) must match the VAT list year (${currentYearVatList}).`;
            showNotification(msg, true);
            return;
          }

          const data = { amount, month, is_paid: payStatus };
          const url = API_BASE_URL + '/vats';

          ajaxRequest(url, 'POST', JSON.stringify(data),
            (response) =>  {
              const msg = `${response.month} Monthly VAT Added Successfullly!`;
              $('#vat__list-table--body').append(vatListTemplate(response));
              showNotification(msg);
            },
            (error) => {
              if (error.status === 409) {
                showNotification(error.responseJSON.error, true);
                return;
              }
              showNotification('Oops! An error occured, Try Again !', true);
            }
          );
        });
    });
});
