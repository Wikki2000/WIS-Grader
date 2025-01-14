import {
  updateElementCount, getBaseUrl, confirmationModal, fetchData,
  getFormDataAsDict, previewImageAndReurnBase64, validateForm,
  showNotification, ajaxRequest, canadianDateFormat
} from '../global/utils.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  $('#sidebar__profile').click(function() {
    const profileUrl = APP_BASE_URL + '/pages/profile';

    $('.notifications-dropdown').addClass('hidden');  // Hide menu when select optio

    // Load the profile dashboard section
    $('#dynamic__load-dashboard').load(profileUrl, function() {

      // Populate the input field
      const userId = localStorage.getItem('userId');
      const staffUrl = API_BASE_URL + `/members/${userId}`;
      fetchData(staffUrl)
        .then((response) => {
          const photoSrc = (
            response.profile_photo ?
            `data:image/;base64, ${response.profile_photo}` :
            '/static/images/public/profile_photo_placeholder.png'
          );
          $('#edit-fname').val(response.first_name);
          $('#edit-mname').val(response.middle_name);
          $('#edit-lname').val(response.last_name);
          $('#edit-username').val(response.username);
          $('#edit-gender').val(response.gender);
          $('#edit-email').val(response.email);
          $('#edit-title').val(response.title);
          $('#edit-address').val(response.address);
          $('#edit-phone').val(response.number);
          $('#edit-state').val(response.state);
          $('#edit-religion').val(response.religion);
          $('input[name="profile_photo"]').val(
            `data:image/;base64, ${response.profile_photo}`
          );
	  $('#edit-dob').val(canadianDateFormat(response.dob));
	  $('#edit-nok-name').val(response.nok);
	  $('#edit__nok-phone').val(response.nok_number);
	  $('#edit__role').val(response.portfolio);
          $('#profile__photo').attr('src', photoSrc);
        })
        .catch((error) => {
          console.log(error);
        });

      // Trigger file input when image is clicked.
      $('#dynamic__load-dashboard').off('click', '#profile__photo')
        .on('click', '#profile__photo', function() {
          $('#profile__image-fileInput').click();
        });

      // Function triggered when profile images is click.
      const $fileInputSelector = $('#profile__image-fileInput');
      const $imgSelector = $('#profile__photo');
      previewImageAndReurnBase64($fileInputSelector, $imgSelector)
        .then((Base64String) => {
          $('input[name="profile_photo"]').val(Base64String);
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    });
  });

  // Handle form submission for editing profile
  $('#dynamic__load-dashboard').on('submit', '#staff__profile-form', function(e) {
    e.preventDefault();

    const $formSelector = $(this);
    if (!validateForm($formSelector)) {
      showNotification('Please fill all requires field');
      return;
    }

    $('#save-changes').prop('disable', true);
    const data = getFormDataAsDict($formSelector);
    const userId = localStorage.getItem('userId');
    const editUrl = API_BASE_URL + `/members/${userId}/update`;
    ajaxRequest(editUrl, 'PUT', JSON.stringify(data),
      (response) => {
        $('#save-changes').prop('disable', false);
        showNotification('Profile updated successfully !');

        $('.sidebar__profile-image').attr(
          'src', $('input[name="profile_photo"]').val()
        );
        $('#sidebar__name').text(`${data.first_name} ${data.last_name}`);
        $('#sidebar__email').text(data.email);
        $('#main__username').text(data.username);
      },
      (error) => {
        $('#save-changes').prop('disable', false);
        showNotification('An error occured. Try again !', true);
        console.log(error);
      }
    );
  });
});
