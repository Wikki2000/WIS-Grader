import { ajaxRequest } from './utils.js';

$(document).ready(function () {
  const courseEndpoint = '/courses';

  /* =============== GET REQUEST ================*/
  $.get(courseEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        const courses = response.courses;
        $.each(courses, (index, course) => {
          const row = `<tr>
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${course.course_code}</td>
            <td>${course.course_title}</td>
            <td>${course.credit_load}</td>
            <td>50 (dummy data for now)</td>
            <td><button class="edit-btn" data-id="${course.id}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button></td>
            <td><button class="delete-btn" data-id="${course.id}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
          </tr>`
          $('table tbody').append(row);
        });
      }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log('Error status:', jqXHR.status);
      console.log('Error text:', textStatus);
      console.log('Error thrown:', errorThrown);
    });


  /* =============== POST REQUEST ================*/
  $('.add__course').click(function () {
    $('.course__modal').show();
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
      alert(data);

      ajaxRequest(courseEndpoint, 'POST', data,
        (response) => {
          if (response.status === 'Success') {
            alert("Courses Create Successfully");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
  });


  /* =============== DELETE REQUEST ================*/
  $('tbody').on('click', '.delete-btn', function () {
    const course_id = $('.delete-btn').data('id');
    alert("Delete Button Click");
    alert(course_id);
  });


  /* =============== PUT REQUEST ================*/
  

  /* =============== Program Functionality ================*/
  $('.cancel').click(function () {
    $('.course__modal').hide();
  });
});
