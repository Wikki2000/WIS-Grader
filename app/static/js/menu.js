/**
 * This JavaScript file handles the main interactions on the dashboard.
 * When the user clicks an item in the sidebar, the corresponding section
 * of the dashboard is loaded.
 */
$(document).ready(function () {
  $('.dashboard__nav-item').click(function () {
    // Track exact navbar click by retrieving it ID
    const $navItem = $(this);

    /* ================ Sidebar Navigation =============== */
    $('.dashboard__nav-item').removeClass('dashboard__nav-item-highlight');
    if ($navItem.attr('id') === 'main__nav-item') {
      $('#main__nav-item').addClass('dashboard__nav-item-highlight');
      window.location.href = '/dashboard';
    } else if ($navItem.attr('id') === 'course__nav-item') {
      $('#course__nav-item').addClass('dashboard__nav-item-highlight');
      window.location.href = '/dashboard/course-management';
    } else if ($navItem.attr('id') === 'grade__nav-item') {
      $('#grade__nav-item').addClass('dashboard__nav-item-highlight');
    } else if ($navItem.attr('id') === 'setting__nav-item') {
      $('#setting__nav-item').addClass('dashboard__nav-item-highlight');
    } else if ($navItem.attr('id') === 'help__nav-item') {
      $('#help__nav-item').addClass('dashboard__nav-item-highlight');
    } else if ($navItem.attr('id') === 'logout') {
      $('#logout').addClass('dashboard__nav-item-highlight');
      window.location.href = ('/account/logout');
    }
  });

  /* ===========Toggle Dropdown Menu for Table Operation =============*/
  $('table tbody').on('click', '.fa-ellipsis-v, .dashboard__table-close-icon', function () {

    if ($(this).hasClass('fa-ellipsis-v')) {
      $(this).hide();
      $(this).siblings('.dashboard__table-close-icon').show();
      $(this).closest('tr').find('.manage').show();

    } else if ($(this).hasClass('dashboard__table-close-icon')) {
      $(this).hide();
      $(this).siblings('.fa-ellipsis-v').show();
      $(this).closest('tr').find('.manage').hide();
    }
  });

  /* =========== Swithch Dashboard Section =============*/
  $('#manage__student-click').click(function () {
    window.location.href = '/dashboard/student-management';
  });
  $('#manage__course-click').click(function () {
    window.location.href = '/dashboard/course-management';
  });
});
