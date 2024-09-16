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
          const newCourse = `<tr id="course_${course.id}">
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${course.course_code}</td>
            <td>${course.course_title}</td>
            <td>${course.credit_load}</td>
            <td>${course.student_count}</td>
            <td><button class="edit__btn" data-id="${course.id}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button></td>
            <td><button class="delete__btn" data-id="${course.id}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
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


  /* =============== Handle PUT $ POST REQUEST ================*/
  $('#popup__modal').on('submit', '#course-management', function (event) {

    event.preventDefault();

    // Retrieve form data
    const course_title = $('#course__name').val();
    const course_code = $('#course__code').val();
    const credit_load = parseInt($('#credit__load').val());
    const description = $('#course__description').val();

    // Retreive method and id set in hidden input during loading of form
    const method = $('#method').val();
    const courseId = $('#course__id').val();
    const url = method == 'POST' ? courseEndpoint : `${courseEndpoint}/${courseId}`;

    const data = JSON.stringify({
      course_title: course_title, course_code: course_code,
      credit_load: credit_load, description: description
    });

    ajaxRequest(url, method, data,
      (response) => {
        if (response.status === 'Success') {
          const newCourse = `<tr id="course_${response.course.id}">
            <td><i class="fa fa-book" aria-hidden="true"></i></td>
            <td>${response.course.course_code}</td>
            <td>${response.course.course_name}</td>
            <td>${response.course.credit_load}</td>
            <td>${response.course.student_count}</td>
            <td><button class="edit__btn" data-id="${response.course.id}"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button></td>
            <td><button class="delete__btn" data-id="${response.course.id}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
          </tr>`

          if (method === 'POST') {
            $('table tbody').append(newCourse);
            $('#popup__modal').load('/static/modal-course-added-success', function () {
              $('.fa-times').click(function () {
                $('#popup__modal').empty();
              });
            });
          } else {
            window.location.reload(); // Refresh to get the update from Database
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
  $('tbody').on('click', '.delete__btn', function () {
    const courseId = $(this).data('id');

    $('#popup__modal').load('/static/modal-confirm-delete', function () {

      // Send request to delete after clicking delete button
      $('.button--delete').click(function () {
        ajaxRequest(`${courseEndpoint}/${courseId}`, 'DELETE', null,
          (response) => {
            if (response.status == 'Success') {

              $('#popup__modal').load('/static/modal-success', function () {
                const $popupModal = $(this);

                $('P.modal__subtitle').append('Item deleted successfully!');

                $('body').on('click', 'button.button--continue', function () {
                  $popupModal.empty();
                  $(`#course_${courseId}`).remove();
                });

              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });

      $('.button--cancel, .fa-times').click(function () {
        $('.modal--delete').remove();
      });

    });
  });


  /* =============== Load Form for PUT or POST Request ================*/
  $('body').on('click', '#add__course, .edit__btn', function () {

    const $clickedBtn = $(this);
    const courseId = $(this).data('id');

    $('#popup__modal').load('/static/modal-course-form', function () {

      // Update input field with value when Edit btn is pressed.
      if ($clickedBtn.hasClass('edit__btn')) {
        const courseId = $clickedBtn.data('id');
        $.get(`${courseEndpoint}/${courseId}`)
          .done(response => {
            $('#course__code').val(response.course_code);
            $('#course__name').val(response.course_title);
            $('#credit__load').val(response.credit_load);
            $('#course__description').val(response.description);

            // hide id and HTTP request in input field
            $('#method').val('PUT');
            $('#course__id').val(courseId);


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
