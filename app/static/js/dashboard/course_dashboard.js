import { ajaxRequest, alertBox, deleteEntity } from '../global/utils.js';

/**
 * Create Course Template
 *
 * @param {string} response - Response object from API
 */
function courseTableTemplate(response) {
  return `<tr id="course_${response.id}">
    <td><input type="checkbox" class="dashboard__table-th--checkbox"></td>
    <td><i class="fa fa-book" aria-hidden="true"></i></td>
    <td>${response.course_code}</td>
    <td>${response.course_title}</td>
    <td>${response.credit_load}</td>
    <td>${response.student_count}</td>
    <td>
      <i class="fa fa-ellipsis-v"></i>
      <span class="dashboard__table-close-icon">&times;</span>
    </td>
    <td>
    <td class="manage">
        <nav class="manage__nav">
          <ul class="manage__list">
            <li class="manage__item manage__item--border edit"><i class="fa fa-pencil"></i>Edit</li>
            <li class="manage__item manage__item--border delete"><i class="fa fa-trash"></i>Delete</li>
            <li class="manage__item manage__item--border"><i class="fa fa-clone"></i>Copy course link</li>
          </ul>
        </nav>
      </td>
    </tr>
  `
}

$(document).ready(function () {

  // The Course Management to indicate the active dashboard section
  $('#manage__course-click').addClass('dashboard__nav--top-outline');

  // Define course managemnt API globally
  const courseEndpoint = '/courses';

  $('#course__nav-item').addClass('dashboard__nav-item-highlight');

  /* =============== GET REQUEST ================*/
  $.get(courseEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        const courses = response.courses;
        $.each(courses, (index, course) => {
          $('table tbody').append(courseTableTemplate(course));
        });
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log('Error status:', jqXHR.status);
      console.log('Error text:', textStatus);
      console.log('Error thrown:', errorThrown);
    });


  /* =============== Handle PUT $ POST REQUEST ================*/
  $('#popup__modal').on('submit', '#course-management', function (event) {

    event.preventDefault();

    const course_title = $('#course__name').val();
    const course_code = $('#course__code').val();
    const credit_load = parseInt($('#credit__load').val());
    const description = $('#course__description').val();

    // Retreive method and id set in hidden input during loading of form
    const method = $('#method').val();
    const courseId = $('#entity__id').val();
    const url = method == 'POST' ? courseEndpoint : `${courseEndpoint}/${courseId}`;

    const data = JSON.stringify({
      course_title: course_title, course_code: course_code,
      credit_load: credit_load, description: description
    });

    ajaxRequest(url, method, data,
      (response) => {
        if (response.status === 'Success') {
          const course = response.course;
          
          if (method === 'POST') {
            $('#popup__modal').load('/static/modal-course-added-success', function () {
              $('table tbody').append(courseTableTemplate(course));
              $('.fa-times').click(function () {
                $('#popup__modal').empty();
              });
            });
          } else {
            window.location.reload();
          }

          $('#course__modal').remove();
        }
      },
      (error) => {
        alert("Alert Courses exist already");
        console.log(error);
        $('#course__modal').hide();
      }
    );
  });


  /* =============== DELETE REQUEST ================*/
  $('body').on('click', '.delete', function () {
    const tagContent = {
      modal__title: 'Are you sure, you want to delete this item?',
      modal__subtitle: '<p>Deleted items from your directory cannot be undone! <br> This action will remove this course for all enrolled students.'
    }
    const $row = $(this).closest('tr');
    const courseId = $row.attr('id').split('_')[1];
    deleteEntity('course', courseEndpoint, courseId, tagContent);
  });

 /* =============== Load Form for PUT Request ================*/
  $('body').on('click', '#add__course, .edit', function () {

    const $clickedBtn = $(this);

    $('#popup__modal').load('/static/modal-course-form', function () {

      // Update input field with value when Edit btn is pressed.
      if ($clickedBtn.hasClass('edit')) {
        const $row = $clickedBtn.closest('tr');
        const courseId = $row.attr('id').split('_')[1];
        $.get(`${courseEndpoint}/${courseId}`)
          .done(response => {
            $('#course__code').val(response.course_code);
            $('#course__name').val(response.course_title);
            $('#credit__load').val(response.credit_load);
            $('#course__description').val(response.description);

            // hide id and HTTP request in input field
            $('#method').val('PUT');
            $('#entity__id').val(courseId);


            console.log(response);
          })
          .fail((jqXHR, textStatus, errorThrown) => {
            console.log('Error status:', jqXHR.status);
            console.log('Error thrown:', errorThrown);
            console.log('Error text:', textStatus);
          });
      } else {
        // Store method (POST) to be use in form submission
        $('#method').val('POST');
      }

      $('#close-icon').click(function () {
        $('#course__modal').remove();
      });

    });
  });
});
