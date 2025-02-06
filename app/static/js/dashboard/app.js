import {
  britishDateFormat, compareDate, getFormattedDate, fetchData, ajaxRequest,
  getBaseUrl, highLightOrderBtn, cartItemsTotalAmount
} from '../global/utils.js';

$(document).ready(function() {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  $('.sidebar__nav-icon').click(function() {
    const $clickItem = $(this);
    const clickId = $clickItem.attr('id');

    /*
    $clickItem.siblings().removeClass('highlight-sidebar');
    $clickItem.addClass('highlight-sidebar');
    */


    $('#dynamic__load-dashboard').empty(); // Empty to load a new section.


    switch(clickId) {
      case 'sidebar__main': {
        alert(clickId);

        /*
        const staffUrl = APP_BASE_URL + '/pages/main_dashboard';
        $('#dynamic__load-dashboard').load(staffUrl, function() {
          const roomUrl = API_BASE_URL + '/rooms';
        });
        */
        break;
      }
      case 'sidebar__course': {
        alert(clickId);
        /*
        const url = APP_BASE_URL + '/pages/room_service';
        $('#dynamic__load-dashboard').load(url, function() {
        });
        */
        break;
      }
      case 'sidebar__grade': {
        alert(clickId);
        /*
        const url = APP_BASE_URL + '/pages/guest_list';
        $('#dynamic__load-dashboard').load(url, function() {
          const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
        });
        */
        break;
      }
      case 'sidebar__setting' : {
        alert(clickId);
        /*
        const url = APP_BASE_URL + '/pages/restaurant';
        $('#dynamic__load-dashboard').load(url, function() {
        });
        */
        break;
      }
      case 'sidebar__help': {
        alert(clickId);
        /*
        const url = APP_BASE_URL + '/pages/order';
        $('#dynamic__load-dashboard').load(url, function() {
        });
        */
        break;
      }
      case 'sidebar__logout': {
        alert(clickId);
        break;
      }
    }
  });
});
