import {
  getBaseUrl, confirmationModal, validateForm, closeConfirmationModal,
  showNotification, ajaxRequest, fetchData, britishDateFormat, togleTableMenuIcon
} from '../global/utils.js';
import { loanListTableTemplate, loanDetailTemplate } from '../global/templates.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const USER_ROLE = localStorage.getItem('role');

  // Show details of loans
  $('#dynamic__load-dashboard')
    .on('click', '.loanDetails', function() {
      const loanId = $(this).data('id');
      const getLoanUrl = API_BASE_URL + `/loans/${loanId}`;

      togleTableMenuIcon();

      fetchData(getLoanUrl)
        .then((data) => {
          loanDetailTemplate(data);
        })
        .catch((error) => {
          console.log(error);
        });
      $('#loan__popupModal').css('display', 'flex');
    });


  // Load the loan pages
  $('#side__bar-loanRequest').click(function() {
    $('.notifications-dropdown').addClass('hidden');
    const loanUrl = APP_BASE_URL + '/pages/loan_request';
    $('#dynamic__load-dashboard').load(loanUrl);
  });

  // Swwitch dashboard section between `Loan Request` $ `Loan History`
  $('#dynamic__load-dashboard')
    .on('click', '.loan__request--switchSection', function() {
      const $clickButton = $(this);
      const clickId = $clickButton.attr('id');

      $('.loan__request--switchSection').removeClass('highlight-btn');
      $('#loan__list').hide();
      $('#loan-content').hide();

      if (clickId === 'loan-request') {
        $clickButton.addClass('highlight-btn');
        $('#loan-content').show();
      }
      else if(clickId === 'loan__request-history') {
        const userId = localStorage.getItem('userId');

        $('#loan__table-body').empty();
        $clickButton.addClass('highlight-btn');
        $('#loan__list').show();
        const getLoanUrl = API_BASE_URL + `/members/${userId}/loans`;
        fetchData(getLoanUrl)
          .then((data) => {
            data.forEach((data) => {
              $('#loan__table-body')
                .append(loanListTableTemplate(data, USER_ROLE));
            });

            // Hide the following section if loan history is not view,
            // from 'Staff Management' section.
            $('#loan__table-body .name').hide();
            $('#loan__table-body .approveLoan').hide();
            $('#loan__table-body .rejectLoan').hide();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  // Form submission for staff loan request
  $('#dynamic__load-dashboard')
    .on('submit', '#staff__loan-requestForm', function(e) {
      e.preventDefault();

      $('#staff__loan-proceed--btn').prop('disable', true);
      const $formSelector = $(this);

      // Validate form data and show error messages
      if (!validateForm($formSelector)) {
        showNotification('Please fill out all required fields.', true);
        return;
      }
      const amount = $('#loan-amount').val();
      const due_month = $('#loan-term').val();
      const repayment_mode = $('#repayment-mode').val();
      const bank_name = $('#bank-name').val();
      const account_number = $('#account-number').val();
      const account_name = $('#account-holder').val();

      const data = {
        amount, due_month, repayment_mode,
        bank_name, account_name, account_number
      };

      // Load confirmation modal
      const headingText = 'Confirm Loan Request';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'staff__loan-confirmBtn';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard').off('click', '.staff__loan-confirmBtn')
        .on('click', '.staff__loan-confirmBtn', function() {
          const loanRequestUrl = API_BASE_URL + '/request-loan';
          ajaxRequest(loanRequestUrl, 'POST', JSON.stringify(data),
            (response) => {
              $('#staff__loan-proceed--btn').prop('disable', false);
              $('#order__confirmation-modal').empty();
              showNotification('Loan Request Sent Successfully !');
              $('#staff__loan-requestForm').trigger('reset');
            },
            (error) => {
              $('#staff__loan-proceed--btn').prop('disable', false);
              $('#order__confirmation-modal').empty();
              showNotification('Loan Request Fail. Try Again !', true);
              console.log(error.responseJSON.error);
            }
          );
        });
    });

  // Approve loan request.
  $('#dynamic__load-dashboard')
    .off('click', '#staff__loan-table--body .approveLoan')
    .on('click', '#staff__loan-table--body .approveLoan', function() {
      const $clickItem = $(this);
      const loanId = $clickItem.data('id');

      togleTableMenuIcon();

      // Load confirmation modal
      const headingText = 'Confirm Loan Approval';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'approve__loan-confirm--btn';

      confirmationModal(headingText, descriptionText, confirmBtCls);
      togleTableMenuIcon();

      // Handle approval of leave request.
      $('#dynamic__load-dashboard')
        .off('click', '.approve__loan-confirm--btn')
        .on('click', '.approve__loan-confirm--btn', function() {
          const approveLoanUrl = (
            API_BASE_URL + `/loans/${loanId}/approve`
          );
          closeConfirmationModal();

          ajaxRequest(approveLoanUrl, 'PUT', null,
            (response) =>  {
              showNotification('Loan Request Approved Successfully !');
            },
            (error) => {
              showNotification('Oops! An error occured, Try Again !', true);
            }
          );
        });
    });

  // Handle rejection of leave request.
  $('#dynamic__load-dashboard')
    .off('click', '#staff__loan-table--body .rejectLoan')
    .on('click', '#staff__loan-table--body .rejectLoan', function() {
      const loanId = $(this).data('id');

      togleTableMenuIcon();

      // Load confirmation modal
      $('#loan__rejection-reason').css('display', 'flex');


      const $textarea = $('.rejection__reason-textarea');

      $textarea.focus();  // Focus the cursor on the input field.

      // Handle rejection of leave request.
      $('#dynamic__load-dashboard')
        .off('submit', '#loan__rejection-form')
        .on('submit', '#loan__rejection-form', function(e) {
          e.preventDefault();

          const data = JSON.stringify({
            description: $('#loan__rejection-reason--val').val()
          });
          const approveLeaveUrl = (
            API_BASE_URL + `/loans/${loanId}/reject`
          );

          $('#loan__rejection-reason').hide();
          ajaxRequest(approveLeaveUrl, 'PUT', data,
            (response) =>  {
              $('#loan__rejection-form').trigger('reset');
              showNotification('Loan Request Rejected Successfully !');
            },
            (error) => {
              showNotification('Oops! An error occured, Try Again !', true);
            }
          );
        });
    });
});
