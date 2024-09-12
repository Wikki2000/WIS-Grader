import { ajaxRequest } from './utils.js';

$(document).ready(function () {
  const getCourseEndpoint = '/courses';

  $.get(getCourseEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        alert(JSON.stringify(response.courses));
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log('Error status:', jqXHR.status);
      console.log('Error text:', textStatus);
      console.log('Error thrown:', errorThrown);
    });
});

