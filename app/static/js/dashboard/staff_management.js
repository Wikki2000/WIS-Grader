/* NOTE: This pages does not handle loans/leaves action,
 * it only display loans & Leave applied by staff.
 * Refer to loan_request.js & leave_request.js,
 * for other action on loan/leave request by staff.
 */

import {
  fetchData, getFormDataAsDict, showNotification, confirmationModal,
  validateForm, britishDateFormat, getBaseUrl, ajaxRequest, sanitizeInput,
  canadianDateFormat, hideAllStaffManagmentDashboard
} from '../global/utils.js';
import  {
  loanListTableTemplate, staffListTemplate,
  leaveListTableTemplate
} from '../global/templates.js';

function removeBtnHighlight() {
  $('#staff__performance-btn').removeClass('highlight-btn');
  $('#add__staff-btn').removeClass('highlight-btn');
  $('#staff__list-btn').removeClass('highlight-btn');
  $('.staff__management-loan--history').removeClass('highlight-btn');
  $('.staff__management-leave-history').removeClass('highlight-btn');
}

$(document).ready(function() {

  const USER_ROLE = localStorage.getItem('role');
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const userUrl = API_BASE_URL + '/users';

  fetchData(userUrl)
    .then((response) => {
      response.forEach((data) => {
        $('#staff__list-table--body').append(staffListTemplate(data));
      });
    })
    .catch((error) => {
      console.log(error);
    });

  // Show drop dwon menu for user role
  $('#dynamic__load-dashboard').off('click', '.profile__dropdown-btn')
    .on('click', '.profile__dropdown-btn', function() {
      $('#profile__role-dropdown').show();
    });

  // Collect the selected option and store in hidden input field
  $('#dynamic__load-dashboard').off('click', '.profile__dropdown-selector')
    .on('click', '.profile__dropdown-selector', function() {
      const selectedOption = $(this).text();
      $('.profile__dropdown-btn p').text(selectedOption);
      $('#profile__role-dropdown').hide();
      $('input[name="role"]').val(selectedOption);
    });

  // Submission of form for Edit/Add staff
  $('#dynamic__load-dashboard')
    .on('submit', '#staff__management-form', function(e) {
      e.preventDefault();
      const $formElement = $(this);
      const data = sanitizeInput(getFormDataAsDict($formElement));

      const userId = $('input[name="id"]').val();
      delete data.id;  // Remove id from form field use during PUT

      const addMsg = 'Staff Added successfully !'
      const editMsg = 'Staff Profile Updated successfully !'

      const addUrl = API_BASE_URL + '/users';
      const editUrl = API_BASE_URL + `/members/${userId}/update`;

      const method = $formElement.hasClass('add-staff') ? 'POST' : 'PUT';
      const url = $formElement.hasClass('add-staff') ? addUrl : editUrl;
      const msg = $formElement.hasClass('add-staff') ? addMsg : editMsg;

      if (!validateForm($formElement)) {
        showNotification('Please fill all requires field', true);
        return;
      }

      $('.profile__save-changes').prop('disable', true);

      ajaxRequest(url, method, JSON.stringify(data),
        (response) => {
          $('.profile__save-changes').prop('disable', false);

          $formElement.removeClass('add-staff'); // Remove the temp class for POST request

          if (method === 'POST') {
            const date = britishDateFormat(response.start_date);
            $('#staff__list-table--body')
              .prepend(staffListTemplate(response, date));
          } else {

            const performanceColor = response.performance < 50 ? 'red' : 'green';
            $(`#staff__list-table--body tr[data-id="${userId}"] .first_name`).text(response.first_name);
            $(`#staff__list-table--body tr[data-id="${userId}"] .last_name`).text(response.last_name);
            $(`#staff__list-table--body tr[data-id="${userId}"] .salary`).text(`₦${response.salary}`);
            $(`#staff__list-table--body tr[data-id="${userId}"] .number`).text(response.number);
            $(`#staff__list-table--body tr[data-id="${userId}"] .portfolio`).text(response.portfolio);
            $(`#staff__list-table--body tr[data-id="${userId}"] .performance`).text(String(response.performance) + '%');
            $(`#staff__list-table--body tr[data-id="${userId}"] .performance`).css('color', performanceColor );
          }
          showNotification(msg);

          // Show Staff List after update or adding new staff.
	  hideAllStaffManagmentDashboard();
          $('#staff__list').show();

          $('#staff__list-btn').addClass('highlight-btn');
          $('#add__staff-btn').removeClass('highlight-btn');

          // Reset form
          $formElement.trigger('reset');
          $('.profile__dropdown-btn p').text('Select');
        },
        (error) => {
          $('.profile__save-changes').prop('disable', false);
          $formElement.removeClass('add-staff'); // Remove the temp class for POST request
          if (error.status === 409) {
            showNotification('User Exist\'s Already', true)
            return;
          }
          showNotification('An error occured. Try again !', true);
          console.log(error);
          $formElement.trigger('reset');
          $('.profile__dropdown-btn p').text('Select'); 
        }
      );
    });

  $('#dynamic__load-dashboard')
    .off('click', '#staff__performance-btn, #add__staff-btn, #staff__list-btn')
    .on('click', '#staff__performance-btn, #add__staff-btn, #staff__list-btn',
      function() {
        const $clickItem = $(this);
        const clickId = $clickItem.attr('id');

        removeBtnHighlight();

        $clickItem.addClass('highlight-btn');

        // Hide other dashboard sections
	hideAllStaffManagmentDashboard();

        switch(clickId) {
          case 'staff__performance-btn': {
            break;
          }
          case 'add__staff-btn': {
            $('#staff__profile').show();
            $('#staff__management-form').addClass('add-staff');

            $('.staff-profile-heading h1').text('Add New Staff');

            // Reset the form to add new staff
            $('#staff__management-form').trigger('reset');
            $('.profile__dropdown-btn p').text('Select');
            $('#profile__photo').attr(
              'src', '/static/images/public/profile_photo_placeholder.png'
            );
            break;
          }
          case 'staff__list-btn': {
            $('#staff__list').show();
            break;
          }
        }
      });

  // Load pages for Loans, Delete, staff profile and Leaves
  $('#dynamic__load-dashboard').off('click', '.staff__management-table--menu')
    .on('click', '.staff__management-table--menu', function() {
      $('.staff__management-request').hide();
      const $clickItem = $(this);
      const userId = $clickItem.data('id');

      removeBtnHighlight();
      hideAllStaffManagmentDashboard();

      if($clickItem.hasClass('staff__management-view--profile')) {
        const staffUrl = API_BASE_URL + `/members/${userId}`;

        $('#staff__profile').show();
        $('.staff-profile-heading h1').text('Staff Profile');

        fetchData(staffUrl)
          .then((data) => {
            const photo = (
              data.profile_photo ?
              `data:image/;base64, ${data.profile_photo}` :
              '/static/images/public/profile_photo_placeholder.png'
            );

            $('#profile__photo').attr('src', photo);
            $('input[name="first_name"]').val(data.first_name);
            $('input[name="middle_name"]').val(data.middle_name);
            $('input[name="last_name"]').val(data.last_name);
            $('input[name="salary"]').val(data.salary);
            $('input[name="religion"]').val(data.religion);
            $('input[name="start_date"]')
              .val(canadianDateFormat(data.start_date));
            $('input[name="state"]').val(data.state);
            $('input[name="address"]').val(data.address);
            $('input[name="nok"]').val(data.nok);
            $('input[name="nok_number"]').val(data.nok_number);
            $('input[name="portfolio"]').val(data.portfolio);
            $('input[name="email"]').val(data.email);
            $('input[name="dob"]').val(canadianDateFormat(data.dob));
            $('input[name="gender"]').val(data.gender);
            $('input[name="number"]').val(data.number);
	    $('input[name="performance"]').val(data.performance);
	    $('input[name="username"]').val(data.username);
	    $('input[name="title"]').val(data.title);

            $('input[name="role"]').val(data.role);
            $('.profile__dropdown-btn p').text(data.role);

            $('input[name="id"]').val(data.id);

	    if (USER_ROLE === 'manager') {
	      $('input[name="first_name"]').attr('readonly', true);
	      $('input[name="middle_name"]').attr('readonly', true);
	      $('input[name="last_name"]').attr('readonly', true);
	      $('input[name="salary"]').attr('readonly', true);
	      $('input[name="religion"]').attr('readonly', true);
	      $('input[name="start_date"]').attr('readonly', true);
	      $('input[name="state"]').attr('readonly', true);
	      $('input[name="address"]').attr('readonly', true);
	      $('input[name="nok"]').attr('readonly', true);
	      $('input[name="nok_number"]').attr('readonly', true);
	      $('input[name="portfolio"]').attr('readonly', true);
	      $('input[name="dob"]').attr('readonly', true);
	      $('input[name="gender"]').attr('readonly', true);
	      $('input[name="number"]').attr('readonly', true);
	      $('input[name="email"]').attr('readonly', true);
	      $('input[name="username"]').attr('readonly', true);
	      $('input[name="title"]').attr('readonly', true);
	     
	      $('#profile__role-dropdown').remove();
	    }

          })
          .catch((error) => {
            console.log(error);
          });
      } else if ($clickItem.hasClass('staff__management-remove--user')) {
        const headingText = 'Confirm Removal of Staff';
        const descriptionText = 'This action cannot be undone !'
        const confirmBtCls = 'staff__management-delete--confirmBtn';

        confirmationModal(headingText, descriptionText, confirmBtCls);

      } else if($clickItem.hasClass('staff__management-loan--history')) {
        // Staff Loans Management
        $('.staff__management-loan--history').addClass('highlight-btn');

        $('#staff__loan-table--body').empty();
        const getLoanUrl = API_BASE_URL + '/loans';
        fetchData(getLoanUrl)
          .then((data) => {
            data.forEach((loan) => {
              $('#staff__loan-table--body')
                .append(loanListTableTemplate(loan, USER_ROLE));
            });
          })
          .catch((error) => {
            console.log(error);
          });

        $('#staff__loan-list').show();
      } else if ($clickItem.hasClass('staff__management-leave-history')) {
        $('.staff__management-leave-history').addClass('highlight-btn');
        $('#staff__leave-list').show();

        $('#staff__leave-table--body').empty();

        const getLeaveUrl = API_BASE_URL + `/leaves`;
        fetchData(getLeaveUrl)
          .then((data) => {
            data.forEach((data) => {
              const startDate = britishDateFormat(data.start_date);
              const endDate = britishDateFormat(data.end_date);
              const date = { startDate, endDate  }
              $('#staff__leave-table--body')
                .append(leaveListTableTemplate(data, date));
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // Handle removal of staff
      $('#dynamic__load-dashboard')
        .off('click', '.staff__management-delete--confirmBtn')
        .on('click', '.staff__management-delete--confirmBtn', function() {

          const staffDeleteUrl = API_BASE_URL + `/members/${userId}/delete`;
          ajaxRequest(staffDeleteUrl, 'DELETE', null,
            (response) => {
              $('#order__confirmation-modal').empty();
              $(`#staff__list-table--body tr[data-id="${userId}"]`).remove();
              $('#staff__list').show();
              showNotification('Staff Remove successfully !');
            },
            (error) => {
              $('#order__confirmation-modal').empty();
              console.log(error);
            }
          );
        });
    });
});
