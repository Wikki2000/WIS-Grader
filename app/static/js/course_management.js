import { ajaxRequest } from './utils.js';

$(document).ready(function () {

  // Define course managemnt API globally
  const courseEndpoint = '/courses';

  /* =============== GET REQUEST ================*/
  $.get(courseEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        const courses = response.courses;
        $.each(courses, (index, course) => {
          const newCourse = `<tr id="course_${course.course_code}">
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${course.course_code}</td>
            <td>${course.course_title}</td>
            <td>${course.credit_load}</td>
            <td>50 (dummy data for now)</td>
            <td><button class="edit-btn" data-id="${course.id}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button></td>
            <td><button class="delete-btn" data-id="${course.id}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
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
  $('.course__management__form').submit(function (event) {

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
            <td>50 (dummy data for now)</td>
            <td><button class="edit-btn" data-id="${response.course.id}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button></td>
            <td><button class="delete-btn" data-id="${response.course.id}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
          </tr>`
          $('table tbody').append(newCourse);

          alert("Courses Create Successfully");
          $('.course__modal').hide();
          $('.course__management__form')[0].reset();
        }
      },
      (error) => {
        alert("Alert Courses exist already");
        console.log(error);
        $('.course__modal').hide();
      }
    );
  });


  /* =============== DELETE REQUEST ================*/
  $('tbody').on('click', '.delete-btn', function () {
    const course_id = $('.delete-btn').data('id');
    ajaxRequest(`${courseEndpoint}/${course_id}`, "DELETE", null,
      (response) => {
        alert(`#course_${course_id}`);
        $(`#course_${course_id}`).remove();
        alert("deleted successfully");
      },
      (error) => {
        console.log(error);
      }
    );
  });


  /* =============== PUT REQUEST ================*/


  /* =============== Program Functionality ================*/
  $('.cancel').click(function () {
    $('.course__modal').hide();
  });

  // Display pop up form on click
  $('.add__course').click(function () {
    $('.course__modal').show();
  })
});
