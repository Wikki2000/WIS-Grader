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

/**
 * Table template for list of Loan apply by staff.
 *
 * @param {object} data - Object holding leaves data.
 * @param {string} - The HTML templates of loans list.
 */
export function loanListTableTemplate(data, userRole) {
  // Hide the cell for name if role of logged-in user is staff
  const hideFromStaff = userRole === 'staff' ? 'hide': '';

  let textColor;
  let text;

  if (data.is_approved_by_manager === 'rejected' && data.is_approved_by_ceo === 'rejected') {
    textColor = 'red';
    text = 'Rejected';
  } else if(data.is_approved_by_manager === 'approved' && data.is_approved_by_ceo === 'approved') {
    textColor = 'green';
    text = 'Approved';
  } else {
    textColor = 'blue';
    text = 'Pending';
  }


  const row = `<tr>
      <td class="${hideFromStaff} name">
        <p class="ui text size-textmd left-margin">${data.first_name}</p>
        <p class="ui text size-textmd left-margin">${data.last_name}</p>
      </td>
      <td class="">
        <p class="ui text size-textmd left-margin">₦${data.amount.toLocaleString()}</p>
      </td>
      <td class="">
        <p class="ui text size-textmd">${data.due_month} Month(s)</p>
      </td>
      <td class="">
        <p class="ui text size-textmd left-margin">${data.repayment_mode}</p>
      </td>
      <td class="">
        <p class="ui text size-textmd left-margin" style="color: ${textColor}">${text}</p>
      </td>
      <td class="">
        <p><i class="fa fa-ellipsis-v"></i></p>
        <p><i style="display: none;" class="fa fa-times"></i></p>
      </td>

      <td class="manage staff__management-loan--menu">
        <nav class="manage__nav">
          <ul class="manage__list">
            <li data-id="${data.id}" class="manage__item loanDetails">
              <i class="fa fa-eye"></i>Details
            </li>

	    <li data-id="${data.id}" class="manage__item approveLoan ${hideFromStaff}">
	      <i class="fa fa-thumbs-up"></i>Approve
	    </li>

	    <li data-id="${data.id}" class="manage__item rejectLoan ${hideFromStaff}">
	      <i class="fa fa-thumbs-down"></i>Reject
	    </li>

          </ul>
        </nav>
      </td>
    </tr>`;
  return row;
}

export function userGroup(
  name, id, photo, chatType, isActive = true, unreadMsg = 0
) {
  const statusClass = isActive ? 'active' : '';
  return `<li class="chat__list" data-type="${chatType}" data-id="${id}">
    <div class="profile">
      <img src="${photo}" alt="Profile Photo">
      <span class="status ${statusClass}"></span>
    </div>

    <div class="info">
      <span class="name">${name}</span>
    </div>
  </li>`
}

/**
 * Template for displaying user message
 * @param {string} message - The chat of user.
 * @param {string} photoSrc - Base64 string of user images.
 * @param {string} receiverName - The receiever name.
 *
 * @return {string} - The template of the message.
 */
export function messageTemplate(message, photoSrc, receiverName = '') {

  let isSend;
  let nameTemplate;
  if (receiverName.length > 0) {
    isSend = 'sent';
    nameTemplate = `<em class="chat__username"><b>${receiverName}</b></em><br><br>`;
  } else {
    isSend = '';
    nameTemplate = '';
  }

  return  `<div class="message ${isSend}">
    <div class="profile">
      <img src="${photoSrc}" alt="Photo">
    </div>

    <div class="text">
      ${nameTemplate}
      ${message}
    </div>
  </div>`
}

/**
 * Template for table row in staff list table
 *
 * @param {object} data - The response from server of staff information
 * @param {object} date - The date a staff resume work.
 *
 * @return {string} - The records of  staff.
 */
export function staffListTemplate(data) {
  const USER_ROLE = localStorage.getItem('role');
  const hideFromManager = USER_ROLE === 'admin' ? '' : 'hide';
  const salary = data.salary ? `₦${data.salary.toLocaleString()}` : '';
  const performanceColor = data.performance < 50 ? 'red': 'green';
  const row = `<tr data-id="${data.id}">
    <td class="">
      <p class="ui text size-textmd left-margin first_name">${data.first_name}</p>
      <p class="ui text size-textmd left-margin last_name">${data.last_name}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin performance" style="color: ${performanceColor}";>${data.performance}%</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin salary">${salary}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin number">${data.number}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin portfolio">${data.portfolio}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd staff__management-table--menu staff__management-view--profile" data-id="${data.id}">
        <i class="fa fa-edit"></i>
      </p>
    </td>

    <td class="">
      <p class="ui text size-textmd staff__management-table--menu staff__management-remove--user" data-id="${data.id}">
        <i class="fa fa-trash ${hideFromManager}"></i>
      </p>
    </td>
   </tr>`;
  return row;
}
