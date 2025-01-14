import {
  britishDateFormat, compareDate, getFormattedDate, fetchData, ajaxRequest,
  getBaseUrl, highLightOrderBtn, cartItemsTotalAmount
} from '../global/utils.js';
import  {
  displayFoodDrink, displayRoomData, guestListTableTemplate,
  roomTableTemplate, orderItemsTempleate, staffListTemplate
} from '../global/templates.js';
import { displayMaintenance, staffManagementCommonCart } from '../global/templates1.js';

$(document).ready(function() {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];
  const USER_ROLE = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  // Display basic info in sidebar
  const userUrl = API_BASE_URL + `/members/${userId}`;
  fetchData(userUrl)
    .then(({ first_name, last_name, email, username, profile_photo, performance }) => {
      const photoSrc = (
        profile_photo ? `data:image/;base64, ${profile_photo}` :
        '/static/images/public/profile_photo_placeholder.png'
      );
      const displayEmail = (
        email.length > 23 ? email.slice(0, 23) + '...' : email
      );

      $('#sidebar__email').attr('title', email);

      $('#sidebar__name').text(`${first_name} ${last_name}`);
      $('#sidebar__email').text(displayEmail);
      $('.sidebar__profile-image').attr('src', photoSrc);
      $('#main__username').text(username);

      const staffPerformanceColor = (
        performance < 50 ? 'red' : 'green'
      );
      $('#staff_performance-indexing')
        .text(String(performance) + '%');
      $('#staff_performance-indexing')
        .css('color', staffPerformanceColor);
    })
    .catch((error) => {
      console.log(error);
    });

  // Handle side nav bar menu click
  $('#sidebar__staff--profile-btn').click(function() {

    const $clickItem =$(this);
    $('.sidebar__nav-icon').removeClass('highlight-sidebar');
    $('.sidebar__profile-row').addClass('highlight-sidebar');
    $clickItem.css('color', 'white');
    $('.notifications-dropdown').removeClass('hidden');
  });
  $('.sidebar__nav-icon').click(function() {
    const $clickItem = $(this);
    const clickId = $clickItem.attr('id');

    // The default search bar placeholder
    $('input[name="Search Input"]').attr('placeholder', 'Search');
    $('input[name="Search Input"]').val('');

    // Remove stored items for dashboard section(s)
    localStorage.removeItem('restaurant');


    $clickItem.siblings().removeClass('highlight-sidebar');
    $clickItem.addClass('highlight-sidebar');

    // Handle behavior when ellipsis icon is click.
    $('.sidebar__profile-row').removeClass('highlight-sidebar');
    $('#sidebar__staff--profile-btn').css('color', 'black');
    $('.notifications-dropdown').addClass('hidden');

    $('#dynamic__load-dashboard').empty(); // Empty to load a new section.


    switch(clickId) {
      case 'sidebar__main': {

        const staffUrl = APP_BASE_URL + '/pages/main_dashboard';
        $('#dynamic__load-dashboard').load(staffUrl, function() {
          const roomUrl = API_BASE_URL + '/rooms';
          const bookingUrl = API_BASE_URL + '/bookings';

          const performanceStatus = localStorage.getItem('performance');
          const staffPerformanceColor = (
            performanceStatus < 50 ? 'red' : 'green'
          );

          const username = localStorage.getItem('userName');
          $('#main__username').text(username);

          $('#staff_performance-indexing')
            .text(String(performanceStatus) + '%');
          $('#staff_performance-indexing')
            .css('color', staffPerformanceColor);

          fetchData(roomUrl)
            .then((data) => {
              const roomCounts = data.rooms_count;
              $('#main__room-available').text(roomCounts.total_available_room);
              $('#main__room-reserved').text(roomCounts.total_reserved_room);
            })
            .catch((error) => {
              console.error('Failed to fetch room data:', error);
            });
          $('#main__username').text(localStorage.getItem('userName'));
          $('#main__date').text(getFormattedDate());

          // Handle display of common cart in main dashboard
          const greenClass = 'green';
          const orangeClass = 'orange';
          if (USER_ROLE === 'staff') {
            // First CART Staff
            const btn = {
              content: "View Details",
              id: "main__checkin-view--btn"
            };
            const cartTitle = 'Today CheckIn';
            const icon = 'fa-calendar';
            $('#main__common-cart--staffManagement')
              .append(staffManagementCommonCart(cartTitle, btn, USER_ROLE, icon, greenClass));

            // Second CART Staff
            const btn2 = {
              content: 'View Orders',
              id: 'main__today-order'
            }
            const icon2 = 'fa-shopping-cart';
             const cartTitle2 = 'Today Order\'s'
            $('#main__cart-loaded')
              .append(staffManagementCommonCart(cartTitle2, btn2, USER_ROLE,icon2, orangeClass));
          } else {
            // First CART for management
            const btn = {
              content: "View Details",
              id: "main__vat-view--btn"
            };
            const icon = 'fa-calculator';
            const cartTitle = 'Monthly VAT';
            $('#main__common-cart--staffManagement')
              .append(staffManagementCommonCart(cartTitle, btn, USER_ROLE, icon, greenClass));

            // Second CART for management
            const btn2 = {
              content: 'View Details',
              id: 'main__cat-view--btn'
            };
            const icon2 = 'fa-calculator';
            const cartTitle2 = 'Monthly CAT';
            $('#main__cart-loaded')
              .append(staffManagementCommonCart(cartTitle2, btn2, USER_ROLE, icon2, orangeClass));
          }

          /*
            fetchData(bookingUrl)
              .then((data) => {
                const todayBookingCount = data.filter(
                  (data) => compareDate(data.created_at)
                ).length;
                $('#main__today-check--in').text(todayBookingCount);
              })
              .catch((error) => {
                console.error('Failed to fetch room data:', error);
              });*/
        });
        break;
      }
      case 'sidebar__Room-service': {
        const url = APP_BASE_URL + '/pages/room_service';
        $('#dynamic__load-dashboard').load(url, function() {
          $('#rooms').addClass('highlight-btn');
          const roomUrl =  API_BASE_URL + '/rooms'
          fetchData(roomUrl)
            .then((response) => {
              // Display btn to add and edit room if login user is not a staff
              if (USER_ROLE === 'staff') {
                displayRoomData(response.rooms, true);
              } else {
                displayRoomData(response.rooms);
                $('#add-room').show();  // Show add room btn to manager aand CEO
              }
            })
            .catch((error) => {
              console.error('Failed to fetch room data:', error);
            });
        });
        break;
      }
      case 'sidebar__guest': {
        const url = APP_BASE_URL + '/pages/guest_list';
        $('#dynamic__load-dashboard').load(url, function() {
          const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
          const bookingUrl = API_BASE_URL + '/bookings';
          const $tableBody = $(".guest-table-body");

          $('#rooms').addClass('highlight-btn');
          fetchData(bookingUrl)
            .then((response) => {
              // Filter rooms currently lodge by a guest.
              const bookingStillInUse = response.filter(
                (data) => data.booking.is_use
              );
              bookingStillInUse.forEach(({ guest, booking, room }) => {
                const checkInDate = britishDateFormat(booking.checkin);
                const checkoutDate = britishDateFormat(booking.checkout);
                const date = { checkInDate, checkoutDate };
                $tableBody.append(
                  guestListTableTemplate(guest, booking, room, date)
                );
              });
            })
            .catch((error) => {
              console.error("Error fetching room data:", error);
            });
        });
        break;
      }
      case 'sidebar__restaurant' : {
        const url = APP_BASE_URL + '/pages/restaurant';
        $('#dynamic__load-dashboard').load(url, function() {
          const foodDrinkUrl = API_BASE_URL + '/foods/drinks';

          $('input[name="Search Input"]')
            .attr('placeholder', 'Search for Foods & Drinks');

          // Search an Item in restaurants
          $('input[name="Search Input"]').on('input', function() {
            const restaurants = JSON.parse(localStorage.getItem('restaurant'));
            const searchKey = $('input[name="Search Input"]')
              .val().trim().toLowerCase();
            $('#restaurant__food--drinks').empty();
            if (searchKey) {
              const searchItems = restaurants.filter(
                item => item.name.toLowerCase().includes(searchKey)
              );
              displayFoodDrink(searchItems);
            } else {
              displayFoodDrink(restaurants);
            }
            highLightOrderBtn(CART); // Highlight btn on chart.
          });

          // Display food and drink once dashboard section is loaded
          fetchData(foodDrinkUrl)
            .then(({ foods, drinks }) => {
              displayFoodDrink(foods, drinks);
              highLightOrderBtn(CART); // Highlight btn of items in cart

              // Store restaurant item once dashboard section loaded.
              localStorage.setItem(
                'restaurant', JSON.stringify([...foods, ...drinks])
              );
            })
            .catch((error) => {
              console.log(error);
            });
        });
        break;
      }
      case 'sidebar__order': {
        const url = APP_BASE_URL + '/pages/order';
        $('#dynamic__load-dashboard').load(url, function() {

          $('.order__empty-cart').hide();
          $('.oder__first-col').hide();

          if (CART.size !== 0) {
            $('.oder__first-col').show();
            CART.forEach((value, key) => {
              $('#oder__first-col').append(orderItemsTempleate(key, value));
            });

            // Auto-fill with total cost
            const totalAmount = cartItemsTotalAmount(CART);
            $('#order__total--amout-cart')
              .val('₦' + totalAmount.toLocaleString());
          } else {
            $('.order__empty-cart').show();
            $('.oder__second-col').hide();
          }
        });
        break;
      }
      case 'sidebar__logout': {
        const url = API_BASE_URL + '/account/logout';
        ajaxRequest(url, "DELETE", null,
          (response) => {
            localStorage.clear();
            window.location.href = APP_BASE_URL + '/account/login';
          },
          (error) => {
            console.log(error);
          }
        );
        break;
      }
      case 'sidebar__staff-management': {
        const url = APP_BASE_URL + '/pages/staff_management';
        $('#dynamic__load-dashboard').load(url, function() {
          const userUrl = API_BASE_URL + '/users';

          fetchData(userUrl)
            .then((response) => {
              response.forEach((data) => {
                $('#staff__list-table--body').append(staffListTemplate(data));
              });

              // Remove button to add staff for manager.
              if (USER_ROLE === 'manager') {
                $('#add__staff-btn').remove();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });

        break;
      }
      case 'sidebar__maintenance': {
        const url = APP_BASE_URL + '/pages/maintenence';
        $('#dynamic__load-dashboard').load(url, function() {

          const maintenanceUrl = API_BASE_URL + '/maintenances';
          fetchData(maintenanceUrl)
            .then((response) => {
              response.forEach((data) => {
                displayMaintenance(data);
              });
            })
            .catch((error) => {
              console.log(error);
            });


        });
        break;
      }
    }
  });
});
