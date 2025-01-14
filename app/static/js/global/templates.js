/*================================================================
        Table Template for staff_dashboard Modules
=================================================================*/
/**
 * Template for rooms list table
 * @room {object} - The response object from database
 * @statusClass {string} - Class for status of room e.g., reserved, available or occupied.
 * @param {isStaff} [isStaff = false] - Check the role of login user.
 *
 * @return {string} - The table and contents
 */
export function roomTableTemplate(room, statusClass, isStaff = false) {
  // Create the table row HTML
  const defaultRoomImage = '/static/images/public/default_room_img.png';
  const image = (
    room.image ? 'data:image/;base64, ' + room.image : defaultRoomImage
  );
  const hideClass = isStaff ? 'hide' : '';
  const row = `<tr data-id="${room.id}">
    <td>
      <div class="featured">
        <img src="${image}" alt="Featured Image" class="room-image" />
      </div>
    </td>

    <td>
      <div class="room-info">
        <p class="ui text size-textmd">${room.name}</p>
        <p class="room-number-1 ui heading size-textlg">#${room.number}</p>
      </div>
    </td>

    <td>
      <p class="ui text size-textmd">₦${room.amount.toLocaleString()}</p>
    </td>

    <td>
      <p class="${statusClass} ui text size-textmd">${room.status}</p>
    </td>
    <td class="${hideClass}">
      <p class="ui text size-textmd editRoomIcon" data-id="${room.id}">
        <i class="fa fa-edit"></i>
      </p>
    </td>
    <td class="${hideClass}">
      <p class="ui text size-textmd deleteRoomIcon" data-id="${room.id}">
        <i class="fa fa-trash"></i>
      </p>
    </td>
  </tr>`;
  return row;
}

/**
 * Display rooms and it's details
 *
 * @param {object} data - The JSON response of all rooms
 * @param {isStaff} isStaff - Check if login user role is a staff.
 */
export function displayRoomData(data, isStaff) {
  try {
    const $tableBody = $(".room-table-body");
    // Iterate over the fetched data
    data.forEach((room) => {
      let statusClass = "";
      if (room.status === "available") {
        statusClass = "room-status-4";
      } else if (room.status === "reserved") {
        statusClass = "room-status-3";
      } else if (room.status === "occupied") {
        statusClass = "room-status";
      }

      // Append the row to the table body
      $tableBody.append(roomTableTemplate(room, statusClass, isStaff));
    });
  } catch (error) {
    console.error("Error fetching room data:", error);
  }
}

/**
 * HTML templates for food and drinks
 *
 * @param {string} id - The ID of the drink/food
 * @param {string} name - The name of food/drink.
 * @param {string} type - The type of entity e.g., food or drink
 * @param {string} amount - The cost of food/drink.
 *
 * @param {string} - The HTML templates of food/drink item.
 */
export function foodDrinkTemplate(id, name, type, amount) { 
  const row = `<div class="food-item">
    <img src="/static/images/public/hotel_logo.png" alt="Food Image" class="food-img" />
    <h3 class="food-title">${name}</h3>
    <p>Price: ₦${amount.toLocaleString()}</p>
    <button data-id="${id}" data-name="${name}"
      data-amount="${amount.toLocaleString()}" 
      data-type="${type}" class="order-btn"
    >Order
    </button>
  </div>`;
  return row;
}

/**
 * Display the food/drink in the UI
 *
 * @param {object} foodData - The food response data from server.
 * @param {object} drinkData - The drink response data from server.
 */
export function displayFoodDrink(foodData, drinkData) {

  // Display available dishes in the UI
  if (foodData) {
    foodData.forEach((data) => {
      $('#restaurant__food--drinks').append(
        foodDrinkTemplate(data.id, data.name, "food", data.amount)
      );
    });
  }

  // Display available drinks in the UI
  if (drinkData) {
    drinkData.forEach((data) => {
      $('#restaurant__food--drinks').append(
        foodDrinkTemplate(data.id, data.name, "drink", data.amount)
      );
    });
  }
}

/**
 * HTML temlplates for displaying items in order in cart.
 *
 * @param {itemId} itemId - The ID of an item in cart.
 * @param {object} itemDataObject - The details of item ordered.
 * @param {string} - The HTML templates of an items oredered.
 */
export function orderItemsTempleate(itemId, itemDataObject) {

  const paddingSpaceString = itemDataObject.itemName.length >= 12 ? '...' : '';
  const content = `<div class="order__items--list-content">
    <img
      src="/static/images/public/hotel_logo.png"
      alt="Image of CART Item" class="order__items-img"
    />
   <div>
     <h3 class="order__item-title" title="${itemDataObject.itemName}">
       ${itemDataObject.itemName.slice(0, 12)}${paddingSpaceString}
     </h3>
     <p class="order__item-price">Price: ₦${itemDataObject.itemAmount}</p>
      <p>Total:
        <span class="order__item-amount"> ₦${itemDataObject.itemAmount}</span>
      </p>

     <div class="order__action-icon">
       <p class="order__delete-item" data-id="${itemId}">
         <i class="fa fa-trash"></i>
       </p>

       <div class="order__counter">
         <button data-id="${itemId}" data-price="${itemDataObject.itemAmount}" class="order__count-btn">-</button>
         <span class="order__counter-value">1</span>
         <button data-id="${itemId}" data-price="${itemDataObject.itemAmount}" class="order__count-btn order__btn-increase">+</button>
       </div>
     </div>
   </div>
  </div>`;
  return content;
}

/**
 * Table template for list of Leaves apply by staff.
 *
 * @param {object} data - Object holding leaves data.
 * @param {object} date - The start and end date of leaves in british format. 
 * @param {string} - The HTML templates of leaves list.
 */
export function leaveListTableTemplate(data, date) {
  let textColor;
  let text;
  if (data.manager_approval_status === 'rejected' && data.ceo_approval_status === 'rejected') {
    textColor = 'red';
    text = 'Rejected';
  } else if(data.manager_approval_status === 'approved' && data.ceo_approval_status === 'approved') {
    textColor = 'green';
    text = 'Approved';
  } else {
    textColor = 'blue';
    text = 'Pending';
  }
  const userRole = localStorage.getItem('role');
  const hideFromStaff = userRole === 'staff' ? 'hide': '';
  const row = `<tr>
    <td class="${hideFromStaff} name">
      <p class="ui text size-textmd">${data.first_name}</p>
      <p class="ui text size-textmd">${data.last_name}</p>
    </td>
    <td class="">
      <p class="ui text size-textmd">${date.startDate}</p>
    </td>
    <td class="">
      <p class="ui text size-textmd">${date.endDate}</p>
    </td>
    <td class="">
      <p class="ui text size-textmd" style="color: ${textColor}">${text}</p>
    </td>

    <td class="">
      <p><i class="fa fa-ellipsis-v"></i></p>
      <p><i style="display: none;" class="fa fa-times"></i></p>
    </td>

    <td class="manage staff__management-leave--menu">
      <nav class="manage__nav">
        <ul class="manage__list">
          <li data-id="${data.id}" class="manage__item leaveDetails">
            <i class="fa fa-eye"></i>Details
          </li>

          <li data-id="${data.id}" class="manage__item approveLeave ${hideFromStaff}">
            <i class="fa fa-thumbs-up"></i>Approve
          </li>
	  <li data-id="${data.id}" class="manage__item rejectLeave ${hideFromStaff}">
	    <i class="fa fa-thumbs-down"></i>Reject
	  </li>
        </ul>
      </nav>
    </td>
  </tr>`;
  return row;
}

/**
 * Table template for display Guest List.
 *
 * @param {object} guest - Guest object.
 * @param {object} booking - Object holding booking data.
 * @param {object} room - Object holding room data that was book.
 * @param {object} date - The checkin and checkout date in british format.
 */
export function guestListTableTemplate(guest, booking, room, date) {
  const row = `<tr>
    <td class="guest-name">
      <div class="featured">
        <p>${guest.name}</p>
      </div>
    </td>
    <td class="">
      <div class="room-info">
        <p class="ui text size-textmd">${room.name}</p>
        <p class="room-number-1 ui heading size-textlg">#${room.number}</p>
      </div>
    </td>
    <td class="">
      <p class="ui text size-textmd">${booking.duration} Night(s)</p>
    </td>
    <td class="">
      <p class="ui text size-textmd">${date.checkInDate}</p>
    </td>
    <td class="">
      <p class="ui text size-textmd">${date.checkoutDate}</p>
    </td>
    <td class="">
      <p class="ui text size-textmd">₦${room.amount.toLocaleString()}</p>
    </td>
    <td>
      <p><i class="fa fa-ellipsis-v"></i></p>
      <p><i style="display: none;" class="fa fa-times"></i></p>
    </td>
    <td class="manage">
      <nav class="manage__nav">
        <ul class="manage__list">
          <li data-id="${room.number}" class="manage__item guest__list-bookDetail guest__listMenu">
            <i class="fa fa-eye"></i>Booking Details
          </li>
          <li data-id="${room.number}" class="manage__item guest__listEdit  guest__listMenu">
            <i class="fa fa-edit"></i>Edit Data
          </li>
          <li data-id="${room.number}" class="manage__item guest__listPrint  guest__listMenu">
            <i class="fa fa-print"></i>Print Receipt
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

/**
 */

export function loanDetailTemplate(data) {
  function statusColor(leaveStatus) {
    if (leaveStatus === 'pending') {
      return 'blue';
    } else if (leaveStatus === 'approved') {
      return 'green';
    } else if (leaveStatus === 'rejected') {
      return 'red';
    }
  }
  const managerTextColor = statusColor(data.manager_approval_status);
  const ceoTextColor = statusColor(data.ceo_approval_status);

  $('#loan__details-description').empty();
  $('#loan__acount-description').empty();

  $('#loan__details-description').append(
    `<p class="">Loan Amount - ₦${data.amount.toLocaleString()}</p>
            <p class="">Loan Amount - ${data.due_month} Month(s) </p>
            <p class="">
              Repayment Mode - ${data.repayment_mode.toLocaleString()}
            </p><br />
        `
  );
  $('#loan__acount-description').append(
    `<p>Account Name - ${data.account_name}</p>
             <p>Account Number - ${data.account_number}</p>
             <p>Bank Name - ${data.bank_name}</p>
            `
  );

  // Handle display for ceo status on leave
  $('#loan__manager-status').text(data.manager_approval_status);
  $('#loan__manager-status').css('color', managerTextColor);

  // Handle display for manager status on leave
  $('#loan__ceo-status').text(data.ceo_approval_status);
  $('#loan__ceo-status').css('color', ceoTextColor);
}
