import { ajaxRequest, alertBox } from '../global/utils.js';

$(document).ready(function () {


  const courseEndpoint = '/wisgrader/courses';

  // Highlight course navbar upon click
  $('#main__nav-item').addClass('dashboard__nav-item-highlight');

  /* =============== GET REQUEST ================*/
  $.get(courseEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        const courses = response.courses;
        $.each(courses, (index, course) => {
          const newCourse = `<tr id="course_${course.id}">
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${course.course_code}</td>
            <td>${course.course_title}</td>
            <td>${course.credit_load}</td>
            <td>${course.student_count}</td>
          </tr>`
          $('table tbody').append(newCourse);
        });
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log('Error status:', jqXHR.status);
      console.log('Error text:', textStatus);
      console.log('Error thrown:', errorThrown);
    });


  /* =============== POST REQUEST ================*/
  $('#popup__modal').on('submit', '#course-management', function (event) {

    event.preventDefault();

    // Retrieve form data
    const course_title = $('#course__name').val();
    const course_code = $('#course__code').val();
    const credit_load = parseInt($('#credit__load').val());
    const description = $('#course__description').val();

    const data = JSON.stringify({
      course_title: course_title, course_code: course_code,
      credit_load: credit_load, description: description
    });

    ajaxRequest(courseEndpoint, 'POST', data,
      (response) => {
        if (response.status === 'Success') {
          const newCourse = `<tr id="course_${response.course.id}">
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${response.course.course_code}</td>
            <td>${response.course.course_title}</td>
            <td>${response.course.credit_load}</td>
            <td>${response.course.student_count}</td>
          </tr>`

          $('table tbody').append(newCourse);

          $('#popup__modal').load('/web_static/modal-course-added-success.html', function () {

            $('.fa-times').click(function () {
              $('#popup__modal').empty();
            });
          });
        }
      },
      (error) => {
        alert("Alert Courses exist already");
        console.log(error);
        $('#course__modal').hide();
      }
    );
  });


  /* =============== Load Form for POST Request ================*/
  $('body').on('click', '#add__course', function () {

    const $clickedBtn = $(this);

    $('#popup__modal').load('/web_static/modal-course-form.html', function () {
      $('#method').val('POST');

      $('#close-icon').click(function () {
        $('#course__modal').remove();
      });

    });
  });

});
