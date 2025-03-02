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


  $("#dynamic__load-dashboard").on("click", ".menu_toggle", function (event) {
    handleTableRowState($(this));
    handleTableMenuState($(this));
    event.stopPropagation();
  });

  $(document).on("click", function (event) {
    if (!$(event.target).hasClass("menu_toggle")) {
      closeMenu();
      removeActiveRowClass();
    }
  });

  function handleTableRowState($target) {
    let $activeRow = $target.closest("tr");
    if (!$activeRow.length || $activeRow.hasClass("active_row")) return;
    removeActiveRowClass();
    $activeRow.addClass("active_row");
  }

  function handleTableMenuState($target) {
    let $menu = $target.next(".menu_list");
    if (!$menu.length) return;

    let buttonRect = $target[0].getBoundingClientRect();
    let $parentTd = $target.closest("td");
    if (!$parentTd.length) return;

    let parentRect = $parentTd[0].getBoundingClientRect();
    closeMenu($menu);

    $menu.css({
      display: "block",
      position: "absolute",
      visibility: "hidden",
    });

    let topPosition = buttonRect.bottom - parentRect.top - 20;
    let rightPosition = parentRect.right - buttonRect.right + 50;

    let menuHeight = $menu.outerHeight();
    if (topPosition + menuHeight > $parentTd.height()) {
      topPosition = buttonRect.top - parentRect.top - menuHeight + 20;
    }

    $menu.css({
      top: `${topPosition}px`,
      right: `${rightPosition}px`,
      visibility: "visible",
    });
  }

  function removeActiveRowClass() {
    $("#dynamic__load-dashboard").find(".active_row").removeClass("active_row");
  }

  function closeMenu($activeMenu = null) {
    $("#dynamic__load-dashboard").find(".menu_list").each(function () {
      if (!$activeMenu || !$(this).is($activeMenu)) {
        $(this).hide();
      }
    });
  }

});
