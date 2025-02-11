import {
  britishDateFormat, getFormattedDate, fetchData, ajaxRequest,
  getBaseUrl, getFormDataAsDict, sanitizeInput, showNotification,
  updateElementCount,
} from '../global/utils.js';
import { courseListTableTemplate } from '../global/templates.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  const formUrl = APP_BASE_URL + '/pages/course_form';
  $('#dynamic__load-dashboard').on('click', '#main__add-course', function() {
    $('#popup__modal').load(formUrl);
  });

  $('#popup__modal').on('submit', '#course-management', function(e) {
    e.preventDefault();
    const $formElement = $(this);

    const data = sanitizeInput(getFormDataAsDict($formElement));

    const addCouresUrl = API_BASE_URL + '/courses';
    $('#popup__modal').empty();
    ajaxRequest(addCouresUrl, 'POST', JSON.stringify(data),
      (data) => {
        const date = britishDateFormat(data.created_at);
        const $serialNumber = $('#main__course-table--body td:first-child');
        $('#main__course-table--body')
          .prepend(courseListTableTemplate(data, date));
        $formElement.trigger('reset');
        showNotification('Course Added Successfully !');
      },
      (error) => {
        if (error.status === 409) {
          showNotification(error.responseJSON.error, true);
          return;
        }
        console.log(error);
      }
    );
  });
});
