import {
    britishDateFormat, getFormattedDate, fetchData, ajaxRequest, getBaseUrl, 
} from '../global/utils.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  $('#popup__modal').on('click', '.common__cancel-btn', function() {
    $('#popup__modal').empty();
  });
});
