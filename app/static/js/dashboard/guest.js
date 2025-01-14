import {
  ajaxRequest, britishDateFormat, fetchData, getBaseUrl, canadianDateFormat,
  confirmationModal, showNotification, validateForm,
} from '../global/utils.js';
import {  guestListTableTemplate }  from '../global/templates.js';

$(document).ready(() => {

  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];

  const $modal = $("#guestModal");

  $('#dynamic__load-dashboard').on('click', '.guest__listMenu', function() {
    const $clickItem = $(this);
    const clickItemId = $clickItem.data('id');

    // Toggle visibility of icon to show and cancel table menu
    $clickItem.closest('td').siblings().find('.fa.fa-times').hide();
    $clickItem.closest('td').siblings().find('.fa.fa-ellipsis-v').show();

    $clickItem.closest('.manage').hide(); // Hide table menu once selected

    // Show popup for Booking Details
    if ($clickItem.hasClass('guest__list-bookDetail')) {
      $('#guest__popupModal').css('display', 'flex');

      $('#guest__info').empty();
      const bookingUrl = (
        API_BASE_URL +  `/bookings/${clickItemId}/booking-data`
      );
      fetchData(bookingUrl)
        .then(
          ( { booking, customer, room, checkin_by }
          ) => {
            const paymentStatus = (
              booking.is_paid === 'yes' ? { status: 'Paid', color: 'green' } :
              {status: 'Pending', color: 'red' }
            );

            $('#guest__info').append(
              `<h3></h3>
             <p><b>Guest Name</b> ${customer.name}</p>
             <p><b>Guest ID Type</b> ${customer.id_type}</p>
             <p><b>Guest ID Number</b> ${customer.id_number}</p>
             <p><b>Guest Number</b> ${customer.phone}</p>
             <p><b>Guest Address</b> ${customer.address}</p>
             <p><b>Guest Gender</b> ${customer.gender}</p>
             <p><b>Checkin Date</b> ${britishDateFormat(booking.checkin)}</p>
             <p><b>Expiration Duration</b> ${booking.duration}</p>
             <p><b>Check out Date</b> ${britishDateFormat(booking.checkout)}</p>
             <p><b>Payment Status</b> <span style="color: ${paymentStatus.color};">${paymentStatus.status}</span></p>
             <p><b>Room Rate</b> ₦${room.amount.toLocaleString()}</p>
              <p><b>Checkin  By</b> ${checkin_by.first_name} ${checkin_by.last_name} (${checkin_by.portfolio})</p>`
            );
            $('#room__totalAmount')
              .text('₦' + room.amount.toLocaleString());
            $('#booking__print-receipt').attr('data-id', `${room.number}`);
          })
        .catch((error) => {
          console.log(error);
        });

      // Edit Guest details
    } else if ($clickItem.hasClass('guest__listEdit')) {
      const guestEditUrl = APP_BASE_URL + '/pages/guest_input';
      $('#dynamic__load-dashboard').load(guestEditUrl, function() {
        const bookingUrl = (
          API_BASE_URL +  `/bookings/${clickItemId}/booking-data`
        );
        fetchData(bookingUrl)
          .then(({ booking, customer, room }) => {
            $('#guest__checkinDate').val(canadianDateFormat(booking.checkin));
            $('#guest__duration').val(booking.duration);
            $('#guest__checkout').val(canadianDateFormat(booking.checkout));
            $('#guest__roomNumber').val(room.number);
	    $('#guest__roomType').val(room.name);
            $('#guest__roomAmount').val('₦' + room.amount.toLocaleString());
            $('#guest__name').val(customer.name);
            $('#guest__phoneNumber').val(customer.phone);
            $('#guest-idType span').text(customer.id_type);
            $('#guest__idNumber').val(customer.id_number);
            $('#guest-gender span').text(customer.gender);
            $('#guest__numberOccupant').val(booking.guest_number);
            $('#guest__address').val(customer.address);

            $('#guest__genderValue').val(customer.gender);
            $('#guest__idTypeValue').val(customer.id_type);

            $('#guest__booking-id').val(booking.id);
          })
          .catch((error) => {
            console.log(error);
          });
      });

      // Show dropdown menu
      $('#dynamic__load-dashboard')
        .on('click', '#guest-gender, #guest-idType', function() {
          const $clickMenu = $(this);
          const clickMenuId = $clickMenu.attr('id');
          const selectedMenu = $clickMenu.find('span').text();

          // Ensure that only one dropdown menu show at a time
          $('#guest__idType-dropdown, #guest__gender-dropdown').hide();
          switch (clickMenuId) {
            case 'guest-idType':
              $('#guest__idType-dropdown').show();
              break;
            case 'guest-gender':
              $('#guest__gender-dropdown').show();
              break;
          }
        });

      // Get option selected from drop-down menu
      $('#dynamic__load-dashboard').on('click', '.dropdown-item', function() {
        const $clickItem = $(this);
        const selectedMenu = $clickItem.text();
        $('.dropdown-menu').hide(); // Hide dropdown menu once option selected

        if ($clickItem.hasClass('guest__idtype-dropdown')) {
          $('#guest__idTypeValue').val(selectedMenu);
          $('#guest-idType span').text(selectedMenu); // Display option
        } else if ($clickItem.hasClass('guest__age-dropdown')) {
          $('#guest__genderValue').val(selectedMenu);
          $('#guest-gender span').text(selectedMenu); // Display option
        }
      });
    }
  });

  // Handle update of guest data
  $('#dynamic__load-dashboard').off('click', '#guest__input_btn')
    .on('click', '#guest__input_btn', function() {

      const $button = $(this);
      $button.prop('disable', true);
      // Customer data
      const name = $('#guest__name').val();
      const address = $('#guest__address').val();
      const gender = $('#guest__genderValue').val().toLowerCase();
      const phone  = $('#guest__phoneNumber').val();
      const id_type = $('#guest__idTypeValue').val().toLowerCase();
      const id_number = $('#guest__idNumber').val();

      // Booking Data
      const checkin = $('#guest__checkinDate').val();
      const duration = $('#guest__duration').val();
      const checkout =$('#guest__checkout').val();

      const data = {
        customer: { name, address, gender, phone, id_type, id_number },
        booking: { checkin, duration, checkout },
      }

      const bookingId = $('#guest__booking-id').val();
      const editUrl = API_BASE_URL + `/bookings/${bookingId}/edit`;
      ajaxRequest(editUrl, 'PUT', JSON.stringify(data),
        (response) => {
          $button.prop('disable', false);
          showNotification('Updated Successfully !');
        },
        (error) => {
          showNotification('An Error Occured. Try Again !');
          $button.prop('disable', false);
        }
      );
    });

  // Handle printing of booking reciept
  $('#dynamic__load-dashboard')
    .on('click', '.guest__listPrint, #booking__print-receipt',
      function() {
        const roomNumber = $(this).data('id');
        alert(roomNumber);
        const receiptUrl = (
          APP_BASE_URL + `/bookings/print-receipt?room_number=${roomNumber}`
        );
        window.open(receiptUrl, '_blank');
    });
});
