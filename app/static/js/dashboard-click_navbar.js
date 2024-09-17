/**
 * This JavaScript file handles the sidebar interactions on the dashboard.
 * When the user clicks an item in the sidebar, the corresponding section
 * of the dashboard is loaded.
 */
$('.dashboard__nav-item').click(function () {
  const $navItem = $(this)
  $('.dashboard__nav-item').removeClass('dashboard__nav-item-highlight');
  if ($navItem.attr('id') === 'main__nav-item') {
    $('#main__nav-item').addClass('dashboard__nav-item-highlight');
    $('#dashboard__main').show();
  } else if ($navItem.attr('id') === 'course__nav-item') {
    $('#course__nav-item').addClass('dashboard__nav-item-highlight');
    $('#dashboard__main').hide();
    alert('course__nav-item');
  } else if ($navItem.attr('id') === 'grade__nav-item') {
    alert('grade__management-dashboard');
    $('#grade__nav-item').addClass('dashboard__nav-item-highlight');
  } else if ($navItem.attr('id') === 'setting__nav-item') {
    alert('setting__nav-item');
    $('#setting__nav-item').addClass('dashboard__nav-item-highlight');
  } else if ($navItem.attr('id') === 'help__nav-item') {
    alert('help__nav-item');
    $('#help__nav-item').addClass('dashboard__nav-item-highlight');
  } else if ($navItem.attr('id') === 'logout') {
    $('#logout').addClass('dashboard__nav-item-highlight');
    alert('loogout');
  }
});
