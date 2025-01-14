$(document).ready(function() {
  // Hide dropdown menus when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown').length) {
      $('.dropdown-menu').hide();
    }
  });

  // cancel confirmation modal
  $('#dynamic__load-dashboard').on('click', '#order__cancel-btn, .closePopupModal', function(){
    $('#order__popup-modal').hide();
    $('.popup-modal').hide();
  });

  // Display Table menu
  $('#dynamic__load-dashboard').on('click', '.fa-ellipsis-v', function() {
    const $clickItem = $(this);

    $clickItem.closest('td').siblings('.manage').show(); // Show table menu

    // Toggle visibility of icon to show and cancel table menu
    $clickItem.hide();
    $clickItem.closest('td').find('.fa.fa-times').show();
  });

  // Cancel table menu
  $('#dynamic__load-dashboard').on('click', '.fa.fa-times', function () {
    const $clickItem = $(this);
    $clickItem.hide();
    $clickItem.closest('td').find('.fa.fa-ellipsis-v').show();
    $clickItem.closest('td').siblings('.manage').hide();
  });
});
