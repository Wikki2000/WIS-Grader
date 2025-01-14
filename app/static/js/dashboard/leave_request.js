import {
  getBaseUrl, confirmationModal, validateForm, getFormDataAsDict,
  showNotification, ajaxRequest, fetchData, britishDateFormat,
  closeConfirmationModal, hideTableMenu, togleTableMenuIcon
} from '../global/utils.js';
import { leaveListTableTemplate  } from '../global/templates.js';

function statusColor(leaveStatus) {
  if (leaveStatus === 'pending') {
    return 'blue';
  } else if (leaveStatus === 'approved') {
    return 'green';
  } else if (leaveStatus === 'rejected') {
    return 'red';
  }
}

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const USER_ID = localStorage.getItem('userId');

  // Display leaves details
  $('#dynamic__load-dashboard')
    .on('click', '.leaveDetails', function() {
      const leaveId = $(this).data('id');

      // Toggle table menu icon for leave_request.html & staff_managment.html
      $('#leave__table-body tr .fa-ellipsis-v').show();
      $('#staff__leave-table--body tr .fa-ellipsis-v').show(); 

      $('#leave__table-body tr .fa-times').hide();
      $('#staff__leave-table--body tr .fa-times').hide();

      $('.staff__management-leave--menu').hide(); // Hide table menu

      const getLeaveUrl = API_BASE_URL + `/leaves/${leaveId}`;
      fetchData(getLeaveUrl)
        .then((data) => {
          const managerTextColor = statusColor(data.manager_approval_status);
          const ceoTextColor = statusColor(data.ceo_approval_status);

          $('#leave__date-type').empty();
          $('#leave__reason').empty();

          $('#leave__date-type').append(
            `<p>${data.leave_type}</p>
            <p>From - ${britishDateFormat(data.start_date)}</p>
            <p class="bottom_margin">To - ${britishDateFormat(data.end_date)}</p>
        `
          );
          $('#leave__reason').append(
            `<h4>Reason For Leave</h4>
             <p>${data.description}</p>
            `
          );

          // Handle display for ceo status on leave
          $('#leave__manager-status').text(data.manager_approval_status);
          $('#leave__manager-status').css('color', managerTextColor);

          // Handle display for manager status on leave
          $('#leave__ceo-status').text(data.ceo_approval_status);
          $('#leave__ceo-status').css('color', ceoTextColor);

        })
        .catch((error) => {
          console.log(error);
        });
      $('#leave__popupModal').css('display', 'flex');
    });

  // Switch dashboard section b/w leaves request and leaves history
  $('#dynamic__load-dashboard')
    .on('click', '#apply__leave-btn, #track__leave-btn', function() {
      const $clickItem = $(this);
      const clickItemId = $clickItem.attr('id');

      $clickItem.addClass('highlight-btn');
      $clickItem.siblings().removeClass('highlight-btn');

      // Hide the two section
      $('#request__leave').hide();
      $('#leave__list').hide();

      if (clickItemId === 'track__leave-btn') {
        $('#leave__table-body').empty(); // First empty the table
        const getLeaveUrl = API_BASE_URL + `/members/${USER_ID}/leaves`;
        fetchData(getLeaveUrl)
          .then((data) => {
            data.forEach((data) => {
              const startDate = britishDateFormat(data.start_date);
              const endDate = britishDateFormat(data.end_date);
              const date = { startDate, endDate  }
              $('#leave__table-body').append(leaveListTableTemplate(data, date));
            });
            // Hide the following section if leave history is not view,
            // from 'Staff Management' section.
            $('#leave__table-body .name').hide();
            $('#leave__table-body .approveLeave').hide();
            $('#leave__table-body .rejectLeave').hide();
          })
          .catch((error) => {
            console.log(error);
          });
        $('#leave__list').show();
      } else if (clickItemId === 'apply__leave-btn') {
        $('#request__leave').show();
      }
    });

  // Load the leave request page
  $('#side__bar-leaveRequest').click(function() {
    $('.notifications-dropdown').addClass('hidden');
    const leaveUrl = APP_BASE_URL + '/pages/leave_request';
    $('#dynamic__load-dashboard').load(leaveUrl);
  });

  // Show drop down menu of leave type
  $('#dynamic__load-dashboard')
    .on('click', '#leave__request-menu', function() {
      $('#staff__leave-dropdown').show();

      $('#dynamic__load-dashboard').off('click', '.leave__type-dropdown')
        .on('click', '.leave__type-dropdown', function() {
          const selectedOption = $(this).text();
          $('#staff__leave-dropdown').hide();
          $('#leave__request-menu span').text(selectedOption);
          $('#leave__type-val').val(selectedOption);
        });
    });

  // Handle submission of form for leaves request.
  $('#dynamic__load-dashboard')
    .on('submit', '#leave__request-form', function(e) {
      e.preventDefault();
      const leaveUrl = API_BASE_URL + '/request-leave';
      const $form = $(this);
      const data = getFormDataAsDict($form);

      // Validate form data and show error messages
      if (!validateForm($form)) {
        showNotification('Please fill out all required fields.', true);
        return;
      }

      // Load confirmation modal
      const headingText = 'Confirm Leave Request';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'staff__leave-confirmBtn';
      confirmationModal(headingText, descriptionText, confirmBtCls);

      $('#dynamic__load-dashboard').off('click', '.staff__leave-confirmBtn')
        .on('click', '.staff__leave-confirmBtn', function() {
          const $clickItem = $(this);
          $clickItem.prop('disable', true);
          confirmationModal(headingText, descriptionText, confirmBtCls);
          ajaxRequest(leaveUrl, 'POST', JSON.stringify(data),
            (response) => {
              $('#order__confirmation-modal').empty();
              $clickItem.prop('disable', false);
              showNotification('Leave request sent successfull !');
            },
            (error) => {
              $('#order__confirmation-modal').empty();
              $clickItem.prop('disable', false);
              showNotification('Error: Try Again!', true);
            }
          );
        });
    });


  // Approve leave request.
  $('#dynamic__load-dashboard')
    .off('click', '#staff__leave-table--body .approveLeave')
    .on('click', '#staff__leave-table--body .approveLeave', function() {
      const $clickItem = $(this);
      const leaveId = $clickItem.data('id');

      togleTableMenuIcon();

      // Load confirmation modal
      const headingText = 'Confirm Leave Approvael';
      const descriptionText = 'This action cannot be undone !'
      const confirmBtCls = 'approve__leave-confirm--btn';

      confirmationModal(headingText, descriptionText, confirmBtCls);

      // Handle approval of leave request.
      $('#dynamic__load-dashboard')
        .off('click', '.approve__leave-confirm--btn')
        .on('click', '.approve__leave-confirm--btn', function() {
          const approveLeaveUrl = (
            API_BASE_URL + `/leaves/${leaveId}/approve`
          );
          closeConfirmationModal();

          ajaxRequest(approveLeaveUrl, 'PUT', null,
            (response) =>  {
              showNotification('Leave Request Approved Successfully !');
            },
            (error) => {
              showNotification('Oops! An error occured, Try Again !', true);
            }
          );
        });
    });

  // Handle rejection of leave request.
  $('#dynamic__load-dashboard')
    .off('click', '#staff__leave-table--body .rejectLeave')
    .on('click', '#staff__leave-table--body .rejectLeave', function() {
      const leaveId = $(this).data('id');

      togleTableMenuIcon();

      // Load confirmation modal
      $('#leave__rejection-reason').css('display', 'flex');


      const $textarea = $('.rejection__reason-textarea');

      $textarea.focus();  // Focus the cursor on the input field.

      // Handle rejection of leave request.
      $('#dynamic__load-dashboard')
        .off('submit', '#leave__rejection-form')
        .on('submit', '#leave__rejection-form', function(e) {
          e.preventDefault();

          const data = JSON.stringify({
            description: $('#leave__rejection-reason--val').val()
          });
          const approveLeaveUrl = (
            API_BASE_URL + `/leaves/${leaveId}/reject`
          );

          $('#leave__rejection-reason').hide();
          ajaxRequest(approveLeaveUrl, 'PUT', data,
            (response) =>  {
              $('#leave__rejection-form').trigger('reset');
              showNotification('Leave Request Rejected Successfully !');
            },
            (error) => {
              showNotification('Oops! An error occured, Try Again !', true);
            }
          );
        });
    });
});
