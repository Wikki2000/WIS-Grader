import {
  ajaxRequest, fetchData, compareDate,
  getFormattedDate, validateForm, updateElementCount,
  showNotification, getBaseUrl, displayMenuList
} from '../global/utils.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  const userUrl = API_BASE_URL + '/users';

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
});
