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
  const row = `<tr>
    <td class="">
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
    <td>
      <p><i class="fa fa-ellipsis-v"></i></p>
      <p><i style="display: none;" class="fa fa-times"></i></p>
    </td>
    <td class="manage">
      <nav class="manage__nav">
        <ul class="manage__list">
          <li data-id="${data.id}" class="manage__item guest__list-bookDetail guest__listMenu">
            <i class="fa fa-eye"></i>Details
          </li>
          <li data-id="${data.id}" class="manage__item guest__listEdit  guest__listMenu">
            <i class="fa fa-edit"></i>Edit
          </li>
          <li data-id="${data.id}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-share"></i>Share Link
          </li>
          <li data-id="${data.id}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-user-plus"></i>Enroll Student
          </li>
          <li data-id="${data.id}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-ban"></i>Stop Registration
          </li>
          <li data-id="${data.id}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-tasks"></i>Allow Registration
          </li>
          <li data-id="${data.id}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-trash"></i>Delete
          </li>
        </ul>
      </nav>
    </td>
  </tr>`;
  return row;
}
