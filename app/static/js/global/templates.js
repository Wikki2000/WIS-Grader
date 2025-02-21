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
  const [code, year] = data.code.split('_');
  const row = `<tr data-id="${data.id}">
    <td class="course_name">
      <p class="name">${data.name}</p>
    </td>
    <td class="">
        <p class="code">${code}</p>
      </div>
    </td>
    <td class="">
      <p>${year}</p>
    </td>
    <td class="">
      <p class="">50</p>
    </td>
    <td class="menu_cell">
      <button class="menu_toggle">⋮</button>
      <ul class="menu_list">
        <li data-id="${data.id}" class="menu_item course__table-menu course__details">
          <i class="fa fa-eye"></i>Details
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu course__edit">
          <i class="fa fa-edit"></i>Edit
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu">
          <i class="fa fa-share"></i>Share Link
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu">
          <i class="fa fa-user-plus"></i>Enroll Student
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu">
          <i class="fa fa-ban"></i>Stop Registration
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu">
          <i class="fa fa-tasks"></i>Allow Registration
        </li>
        <li data-id="${data.id}" class="menu_item course__table-menu course__delete">
          <i class="fa fa-trash"></i>Delete
        </li>
      </ul>
    </td>
  </tr>`;
  return row;
}
