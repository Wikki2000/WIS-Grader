import {
  britishDateFormat,
  getFormattedDate,
  fetchData,
  ajaxRequest,
  getBaseUrl,
  getFormDataAsDict,
  sanitizeInput,
  showNotification,
  updateElementCount,
} from "../global/utils.js";
import { courseListTableTemplate } from "../global/templates.js";

$(document).ready(function () {
  const API_BASE_URL = getBaseUrl()["apiBaseUrl"];
  const APP_BASE_URL = getBaseUrl()["appBaseUrl"];

  const FORM_Url = APP_BASE_URL + "/pages/course_form";
  $("#dynamic__load-dashboard").on("click", "#main__add-course", function () {
    $("#popup__modal").load(FORM_Url, function () {
      $("#method").val("POST");

      // Add form heading
      $("#course__modal").text("Add New Course");
    });
  });

  $("#popup__modal").on("submit", "#course-management", function (e) {
    e.preventDefault();
    const $formElement = $(this);

    const data = sanitizeInput(getFormDataAsDict($formElement));
    const method = $("#method").val();
    const courseId = $("#course__id").val();

    $("#popup__modal").empty();

    const addCouresUrl = API_BASE_URL + "/courses";
    const editCouresUrl = API_BASE_URL + `/courses/${courseId}/edit`;

    const url = method === "POST" ? addCouresUrl : editCouresUrl;

    ajaxRequest(
      url,
      method,
      JSON.stringify(data),
      (data) => {
        if (method === "POST") {
          const date = britishDateFormat(data.created_at);
          const $serialNumber = $("#main__course-table--body td:first-child");
          $("#main__course-table--body").prepend(
            courseListTableTemplate(data, date)
          );
          $formElement.trigger("reset");
          showNotification("Course Added Successfully !");
        } else if (method === "PUT") {
          const [code, year] = data.code.split("_");
          $(`#main__course-table--body tr[data-id="${data.id}"] .name`).text(
            data.name
          );
          $(`#main__course-table--body tr[data-id="${data.id}"] .code`).text(
            code
          );
          $(`#main__course-table--body tr[data-id="${data.id}"] .year`).text(
            year
          );
          showNotification("Course Updated Successfully !");
        }
      },
      (error) => {
        if (error.status === 409) {
          showNotification(error.responseJSON.error, true);
          return;
        }
        console.log(error);
      }
    );
  });

  $("#dynamic__load-dashboard").on(
    "click",
    "#main__course-table--body .course__table-menu",
    function () {
      const $clickItem = $(this);
      const courseId = $clickItem.data("id");

      $("#main__course-table--body .menu_list").hide();

      if ($clickItem.hasClass("course__details")) {
        const courseUrl = API_BASE_URL + `/courses/${courseId}/get`;
        fetchData(courseUrl)
          .then((data) => {
            $("#course__details-modal").css("display", "flex");

            const [courseCode, CourseYear] = data.code.split("_");

            $("#course-title").text(data.name);
            $("#course-code").text(courseCode);
            $("#course-level").text(data.level);
            $("#course-semester").text(`${data.semester} / ${CourseYear}`);
            $("#course-load").text(`${data.load} Unit's`);
          })
          .catch((error) => {
            console.log(error);
          });
      } else if ($clickItem.hasClass("course__edit")) {
        const courseUrl = API_BASE_URL + `/courses/${courseId}/get`;
        fetchData(courseUrl)
          .then((data) => {
            const [courseCode, CourseYear] = data.code.split("_");
            $("#popup__modal").load(FORM_Url, function () {
              $('input[name="name"]').val(data.name);
              $('input[name="code"]').val(courseCode);
              $('select[name="level"]').val(data.level);
              $('select[name="semester"]').val("First Semester");
              $('select[name="load"]').val(data.load);

              $("#course__id").val(data.id);
              $("#method").val("PUT");
              $("#course__modal").text("Edit Course Data");
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  );

  // Handle table row and menu states
  const homeDashboardTable = document.getElementById("home_dashboard_table");
  homeDashboardTable.addEventListener("click", function (event) {
    if (event.target.classList.contains("menu_toggle")) {
      handleTableRowState(event);
      handleTableMenuState(event);
    }
  });

  // Close menu and remove active row highlight when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("menu_toggle")) {
      closeMenu();
      removeActiveRowClass();
    }
  });

  function handleTableRowState(event) {
    let activeRow = event.target.closest("tr");

    if (!activeRow) return;
    if (activeRow.classList.contains("active_row")) return;

    removeActiveRowClass();
    activeRow.classList.add("active_row");
  }

  function handleTableMenuState(event) {
    let menu = event.target.nextElementSibling;
    if (!menu) return;

    let buttonRect = event.target.getBoundingClientRect();
    let parentTd = event.target.closest("td");

    if (!parentTd) return;
    let parentRect = parentTd.getBoundingClientRect();

    closeMenu(menu);

    menu.style.display = "block";
    menu.style.position = "absolute";
    menu.style.visibility = "hidden";

    // Calculate menu position
    let topPosition = buttonRect.bottom - parentRect.top - 20;
    let rightPosition = parentRect.right - buttonRect.right + 50;

    let menuHeight = menu.offsetHeight;
    if (topPosition + menuHeight > parentTd.clientHeight) {
      topPosition = buttonRect.top - parentRect.top - menuHeight + 20; // Move above button
    }

    menu.style.top = `${topPosition}px`;
    menu.style.right = `${rightPosition}px`;
    menu.style.visibility = "visible";
  }

  function removeActiveRowClass() {
    homeDashboardTable.querySelectorAll(".active_row").forEach((row) => {
      row.classList.remove("active_row");
    });
  }

  function closeMenu(activeMenu = null) {
    homeDashboardTable.querySelectorAll(".menu_list").forEach((menu) => {
      if (menu !== activeMenu) {
        menu.style.display = "none";
      }
    });
  }
});
