/*================================================================
        Table Template for Course_dashboard Modules
=================================================================*/
/**
 * Table template for displaying Course List.
 *
 * @param {object} data - Data object.
 * @param {object} date - The course date in british format.
 * @return {String} - The course template.
 */
export function courseListTableTemplate(data, date) {
  const [code, year] = data.code.split("_");
  const row = `<tr>
    <td class="course_name">
      <p>${data.name}</p>
    </td>
    <td class="">
        <p>${code}</p>
      </div>
    </td>
    <td class="">
      <p class="">${year}</p>
    </td>
    <td class="">
      <p class="">50</p>
    </td>
    <td class="menu_cell">
      <button class="menu_toggle">⋮</button>
      <ul class="menu_list">
        <li data-id="${data.id}" class="menu_item guest__list-bookDetail guest__listMenu">
          <i class="fa fa-eye"></i>Details
        </li>
        <li data-id="${data.id}" class="menu_item guest__listEdit  guest__listMenu">
          <i class="fa fa-edit"></i>Edit
        </li>
        <li data-id="${data.id}" class="menu_item guest__listPrint  guest__listMenu">
          <i class="fa fa-share"></i>Share
        </li>
        <li data-id="${data.id}" class="menu_item guest__listPrint  guest__listMenu">
          <i class="fa fa-user-plus"></i>Enroll Student
        </li>
        <li data-id="${data.id}" class="menu_item guest__listPrint  guest__listMenu">
          <i class="fa fa-ban"></i>Stop Registration
        </li>
        <li data-id="${data.id}" class="menu_item guest__listPrint  guest__listMenu">
          <i class="fa fa-tasks"></i>Allow Registration
        </li>
        <li data-id="${data.id}" class="menu_item guest__listPrint  guest__listMenu">
          <i class="fa fa-trash"></i>Delete
        </li>
      </ul>
    </td>
  </tr>`;
  return row;
}

const homeDashboardTable = document.getElementById("home_dashboard_table");

homeDashboardTable.addEventListener("click", function (event) {
  if (event.target.classList.contains("menu_toggle")) {
    let menu = event.target.nextElementSibling;
    let buttonRect = event.target.getBoundingClientRect();

    let parentTd = event.target.closest("td"); // Get table cell
    let parentRect = parentTd.getBoundingClientRect(); // Get table cell position

    // Close any other open menus
    homeDashboardTable.querySelectorAll(".menu_list").forEach((list) => {
      if (list !== menu) {
        list.style.display = "none";
      }
    });

    // Toggle visibility
    if (menu.style.display === "block") {
      menu.style.display = "none";
      return;
    }

    menu.style.display = "block";
    menu.style.position = "absolute";
    menu.style.visibility = "hidden";

    let menuHeight = menu.offsetHeight;
    let menuWidth = menu.offsetWidth;

    // Position menu close to the button
    let topPosition = buttonRect.bottom - parentRect.top - 20;
    let rightPosition = parentRect.right - buttonRect.right + 50;

    // Adjust if the menu overflows the table cell
    if (topPosition + menuHeight > parentTd.clientHeight) {
      topPosition = buttonRect.top - parentRect.top - menuHeight + 20; // Move above button
    }

    /*====== Please dont't remove =======
    if (rightPosition + menuWidth > parentTd.clientWidth) {
      rightPosition = parentTd.clientWidth - menuWidth; // Keep inside the cell
    }
    */

    // Apply positioning
    menu.style.top = `${topPosition}px`;
    menu.style.right = `${rightPosition}px`;
    menu.style.visibility = "visible";
  }
});

// Hide menu when clicking outside
document.addEventListener("click", function (event) {
  document.querySelectorAll(".menu_list").forEach((menu) => {
    if (
      !menu.contains(event.target) &&
      !event.target.classList.contains("menu_toggle")
    ) {
      menu.style.display = "none";
    }
  });
});
