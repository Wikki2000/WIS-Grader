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
    .off('click', '#main__cat-view--btn')
    .on('click', '#main__cat-view--btn', function() {
      $('#main__cat-year--inputPopup').css('display', 'flex');
    });

  // Show list of vat record's
  $('#dynamic__load-dashboard')
    .off('submit', '#main__enter-cat--yearForm')
    .on('submit', '#main__enter-cat--yearForm', function(e) {
      e.preventDefault();
      const catYear = $('#main__cat-year--input').val();
      const url = APP_BASE_URL + '/pages/cat';

      const date = new Date();
      const currentYear = date.toLocaleDateString('en-GB').split('/')[2]

      $('#main__enter-cat--yearForm').trigger('reset');

      if (catYear > currentYear) {
        $('#main__cat-year--inputPopup').hide();
        const msg = `The entered year (${catYear}) must not be more than current year (${currentYear}).`;
        showNotification(msg, true);
        return;
      }

      $('#sidebar__main').removeClass('highlight-sidebar');

      $('#dynamic__load-dashboard').load(url, function() {

        $('#main__cat-year').text(catYear);

        const catUrl = API_BASE_URL + `/cats/${catYear}/get`;
        fetchData(catUrl)
          .then((data) => {
            data.forEach((cat) => {
              $('#cat__list-table--body').append(vatListTemplate(cat));
            });
          })
          .catch((error) => {
          });
      });
    });

  // Change payment status of VAT
  $('#dynamic__load-dashboard')
    .off('click', '#cat__list-table--body .vatcat__payment-status')
    .on('click', '#cat__list-table--body .vatcat__payment-status', function() {
      const catId = $(this).data('id');
      const vatUrl = API_BASE_URL + `/cats/${catId}/status`

      const headingText = 'Confirm Payment of VAT';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'main__confirm-cat--payment';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard')
        .off('click', '.main__confirm-cat--payment')
        .on('click', '.main__confirm-cat--payment', function() {

          closeConfirmationModal();
          togleTableMenuIcon();

          $(`#cat__list-table--body tr[data-id="${catId}"] .manage`).hide();
          ajaxRequest(vatUrl, 'PUT', null,
            (success) => {
              $(`#cat__list-table--body tr[data-id="${catId}"] .status`)
                .css('color', 'green');
              $(`#cat__list-table--body tr[data-id="${catId}"] .status`)
                .text('Paid');

              const month = $(`#cat__list-table--body tr[data-id="${catId}"] .month`).text();
              showNotification(`${month} CAT Status Updated Successfully !`);
            },
            (error) => {
              console.log(error);
            }
          );
        });
    });

  // Add new cat to the list
  $('#dynamic__load-dashboard')
    .off('click', '#add__cat-btn')
    .on('click', '#add__cat-btn', function() {
      $('#cat__add-edit').css('display', 'flex');
    });

  $('#dynamic__load-dashboard').off('submit', '#cat__form-add-edit')
    .on('submit', '#cat__form-add-edit', function(e) {
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
        showNotification('CAT not dew for payment', true);
        return;
      }

      const payStatus = paymentStatus === 'paid' ? true : false;
      $('#cat__add-edit').hide();

      // Reset form
      $('#cat__form-add-edit').trigger('reset');

      const headingText = 'Confirm Adding CAT';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'main__confirm-adding--cat';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard').off('click', '.main__confirm-adding--cat')
        .on('click', '.main__confirm-adding--cat', function() {

          const yearEnter = month.split('-')[0];
          const currentYearCatList = $('#main__cat-year').text();

          $('#order__confirmation-modal').empty();

          if (currentYearCatList !=  yearEnter) {
            const msg = `The entered year (${yearEnter}) must match the VAT list year (${currentYearCatList}).`;
            showNotification(msg, true);
            return;
          }

          const data = { amount, month, is_paid: payStatus };
          const url = API_BASE_URL + '/cats';

          ajaxRequest(url, 'POST', JSON.stringify(data),
            (response) =>  {
              const msg = `${response.month} Monthly CAT Added Successfullly!`;
              $('#cat__list-table--body').append(vatListTemplate(response));
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
