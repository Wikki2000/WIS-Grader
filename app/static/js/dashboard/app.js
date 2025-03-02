import {
  britishDateFormat, compareDate, getFormattedDate, fetchData, ajaxRequest,
  getBaseUrl, highLightOrderBtn, cartItemsTotalAmount
} from '../global/utils.js';
import { courseListTableTemplate } from '../global/templates.js';

$(document).ready(function() {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  $('.sidebar__nav-icon').click(function() {
    const $clickItem = $(this);
    const clickId = $clickItem.attr('id');

    $clickItem.siblings().find('a').removeClass('highlight__sidebar');
    $clickItem.find('a').addClass('highlight__sidebar');


    $('#dynamic__load-dashboard').empty(); // Empty to load a new section.


    switch(clickId) {
      case 'sidebar__main': {

        const staffUrl = APP_BASE_URL + '/pages/main_dashboard';
        $('#dynamic__load-dashboard').load(staffUrl, function() {
          const userUrl = API_BASE_URL + '/users';
          const courseUrl = API_BASE_URL + '/courses';

          fetchData(userUrl)
            .then((data) => {
              $('#main__user-welcome--text').text(`Hello ${data.last_name}`);
              $('#dashboard__user-name')
                .text(data.first_name + " " + data.last_name);
              $('#dashboard__user-email').text(data.email);
            })
            .catch((error) => {
              console.log(error);
            });

          fetchData(courseUrl)
            .then((data) => {
              data.forEach((course) => {
                const date = britishDateFormat(course.created_at);
                $('#main__course-table--body').append(
                  courseListTableTemplate(course, date)
                );
              });
              // Hide delete fro course table menu in main dashboard.
              if ($('#main__data-storage').data('main-dashboard') === 'yes') {
                $('#main__course-table--body .course__delete').hide();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
        break;
      }
      case 'sidebar__course': {
        const url = APP_BASE_URL + '/pages/course_management';
        $('#dynamic__load-dashboard').load(url, function() {
          const courseUrl = API_BASE_URL + '/courses';
          fetchData(courseUrl)
            .then((data) => {
              data.forEach((course) => {
                const date = britishDateFormat(course.created_at);
                $('#main__course-table--body').append(
                  courseListTableTemplate(course, date)
                );
              });
              // Hide delete fro course table menu in main dashboard.
              if ($('#main__data-storage').data('main-dashboard') === 'yes') {
                $('#main__course-table--body .course__delete').hide();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
        break;
      }
      case 'sidebar__grade': {
        /*
        const url = APP_BASE_URL + '/pages/guest_list';
        $('#dynamic__load-dashboard').load(url, function() {
          const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
        });
        */
        break;
      }
      case 'sidebar__setting' : {
        /*
                                const url = APP_BASE_URL + '/pages/restaurant';
                                $('#dynamic__load-dashboard').load(url, function() {
                                });
                                */
        break;
      }
      case 'sidebar__help': {
        /*
                                const url = APP_BASE_URL + '/pages/order';
                                $('#dynamic__load-dashboard').load(url, function() {
                                });
                                */
        break;
      }
      case 'sidebar__logout': {
        break;
      }
    }
  });
});
