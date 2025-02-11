import {
  ajaxRequest, fetchData, compareDate, britishDateFormat, getFormattedDate,
  validateForm, updateElementCount,showNotification, getBaseUrl,
  displayMenuList, 
} from '../global/utils.js';
import { courseListTableTemplate } from '../global/templates.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

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
      data.forEach((course, index) => {
        const date = britishDateFormat(course.created_at);
        $('#main__course-table--body').append(
          courseListTableTemplate(course, date)
        );
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
