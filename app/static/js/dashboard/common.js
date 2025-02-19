$(document).ready(function() {
  $('#popup__modal').on('click', '.common__cancel-btn', function() {
    $('#popup__modal').empty();
  });

  // Close Popup Modal for Details.
  $('#dynamic__load-dashboard').on('click', '.close-btn.closePopupModal', function() {
    $('.popup-modal').hide();
  });
});
