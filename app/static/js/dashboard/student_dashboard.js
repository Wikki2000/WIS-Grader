import { ajaxRequest, alertBox, deleteEntity } from '../global/utils.js';

/**
 * Create Student Template
 *
 * @param {string} response - Response object from API
 * @param {integer} index - Serial number of table
 */
function studentTableTemplate(index, response) {
  const student = response.student;
  const courses = response.courses_enrolled;
  let courseCodeList = [];

  // Iterate through enrolled course list by student.
  // If not empty, store the courseCode in courseCodeList.
  if (courses.length > 0) {
    $.each(courses, (index, course) => {
      courseCodeList[index] = course.course_code;
    });
  }

  const full_name = student.last_name + " " +  student.first_name + " " + student.middle_name;

  return `<tr id="student_${student.id}">
    <td><input type="checkbox" class="dashboard__table-th--checkbox"></td>
    <td>${index}</td>
    <td>${full_name}</td>
    <td class="courses">${courseCodeList}</td>
    <td>${student.reg_number}</td>
    <td>${student.department}</td>
    <td>${student.level}</td>
    <td>
      <i class="fa fa-ellipsis-v"></i>
      <span class="dashboard__table-close-icon">&times;</span>
    </td>
    <td>
    <td class="manage">
        <nav class="manage__nav">
          <ul class="manage__list">
            <li class="manage__item manage__item--border edit"><i class="fa fa-pencil"></i>Edit Student Data</li>
            <li class="manage__item manage__item--border enroll"><i class="fa fa-user-plus"></i>Enroll Student</li>
            <li class="manage__item manage__item--border delete"><i class="fa fa-trash"></i>Remove Student</li>

          </ul>
        </nav>
      </td>
    </tr>
  `
}

$(document).ready(function () {

  // The Course Management to indicate the active dashboard section
  $('#manage__student-click').addClass('dashboard__nav--top-outline');

  // Define course managemnt API globally
  const studentEndpoint = '/wisgrader/students';

  $('#course__nav-item').addClass('dashboard__nav-item-highlight');

  /* =============== GET REQUEST ================*/
  $.get(studentEndpoint)
    .done(response => {
      if (response.status === 'Success') {
        const students = response.students;
        $.each(students, (index, studentData) => {
          $('table tbody').append(studentTableTemplate(index + 1, studentData));
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

    const first_name = $('#first-name').val();
    const middle_name = $('#middle-name').val();
    const last_name = $('#last-name').val();
    const reg_number = $('#student__reg-no').val();
    const department = $('#student-department').val();
    const level = $('input[name="level"]:checked').val();


    // Retreive method and id set in hidden input during loading of form
    const method = $('#method').val();
    const studentId = $('#entity__id').val();
    const $row = $(`#student_${studentId}`); // Retrieved row object
    const url = method == 'POST' ? studentEndpoint : `${studentEndpoint}/${studentId}`;

    const data = JSON.stringify({
      first_name: first_name, middle_name: middle_name,
      last_name: last_name, reg_number: reg_number,
      department: department, level: level
    });

    ajaxRequest(url, method, data,
      (response) => {
        if (response.status === 'Success') {

          if (method === 'POST') {
            // Retrieved the last row number
            let number = parseInt($('table tbody tr:last-child td:nth-child(2)').text());

            // Assign '1' if table is empty or 'last row number + 1'
            number = number ? number + 1 : 1;

            $('#popup__modal').load('/web_static/modal-success.html', function () {
              $('#success__text').append('Student Added Successfully');
              $('table tbody').append(studentTableTemplate(number, response));

              $('#button__confirm-continue').click(function () {
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
    const $row = $(this).closest('tr');
    const studentId = $row.attr('id').split('_')[1];
    const tagContent = {
      modal__title: 'Are you sure, you want to remove this student?',
      modal__subtitle: '<p>Student removed from your course cannot be undone! <br> This action will remove enrolled student course from your course'
    }
    deleteEntity('student', studentEndpoint, studentId, tagContent);
  });

  /* =============== Enrollment of Student ================*/
  $('table tbody').on('click', '.enroll', function () {

    // Retrieved the student id embeded in "tr" tag
    const studentId = $(this).closest('tr').attr('id').split('_')[1];

    const $row = $(this).closest('tr');

    $('#popup__modal').load('/web_static/modal-enrollment-form.html', function () {

      // Click to cancel
      $('#close-icon').click(function () {
        $('#popup__modal').empty();
      });

      // Fill the form field with student data
      const getStudentUrl = studentEndpoint + '/' + studentId;
      $.get(getStudentUrl, function (response) {
        const fullName = `${response.last_name} ${response.first_name} ${response.middle_name}`;
        $('#full-name').val(fullName);
        $('#reg-no').val(response.reg_number);
        $('#dept').val(response.department);
        $(`input[value="${response.level}"]`).prop('checked', true);
      }, 'json');
    });

    // Send request to enrollment API to add a student to course
    const courseCode = $('#course-code').val();

    $('#popup__modal').on('submit', '#enroll-student', function (event) {
      event.preventDefault();

      const enrollStudentUrl = `/wisgrader/course/sudents/${studentId}/enroll-student`;
      const courseCode = $('#course-code').val();
      ajaxRequest(enrollStudentUrl, 'POST', JSON.stringify({course_code: courseCode}),
        (response) => {
          if (response.status === "Success") {
            alert("Enrollment Success");
            $('#popup__modal').empty();
            //$row.find('td.courses').append(courseCode);
            window.location.reload();
          }
        },
        (error) => {
          alert('Student Enrolled Already');
          console.log(error);
        }
      );
    });
  });

  /* =============== Load Form for PUT Request ================*/
  $('body').on('click', '#add__new-item, .edit', function () {

    const $clickedBtn = $(this);

    $('#popup__modal').load('/web_static/modal-student-form.html', function () {

      // Update input field with value when Edit btn is pressed.
      if ($clickedBtn.hasClass('edit')) {
        const $row = $clickedBtn.closest('tr');
        const studentId = $row.attr('id').split('_')[1];
        $.get(`${studentEndpoint}/${studentId}`)
          .done(response => {
            $('#first-name').val(response.first_name);
            $('#middle-name').val(response.middle_name);
            $('#last-name').val(response.last_name);
            $('#student__reg-no').val(response.reg_number);
            $('#student-department').val(response.department);
            $(`input[value="${response.level}"`).prop('checked', true);


            // hide id and HTTP request in input field
            $('#method').val('PUT');
            $('#entity__id').val(studentId);


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
        $('#popup__modal').empty();
      });

    });
  });
});
