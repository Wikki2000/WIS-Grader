/*
 * Table template for displaying list of vendors.
 *
 * @param {object} data - The response from server of vendor data.
 * @param {string} - The template for vendor list.
 */
export function vatListTemplate(data) {
  const paymentStatus = data.is_paid ? 'Paid' : 'Pending';
  const paymentStatusColor = data.is_paid ? 'green' : 'red';
  const row = `<tr data-id="${data.id}">
    <td class="">
      <p class="ui text size-textmd left-margin month">${data.month}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin amount">₦${data.amount.toLocaleString()}</p>
    </td>

    <td class="">
      <p style="color: ${paymentStatusColor}" class="ui text size-textmd left-margin status">${paymentStatus}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd">
        <i class= fa fa-edit" data-id="${data.id}"></i>
      </p>
    </td>

      <td class="">
        <p><i class="fa fa-ellipsis-v"></i></p>
        <p><i style="display: none;" class="fa fa-times"></i></p>
      </td>

      <td class="manage">
        <nav class="manage__nav">
          <ul class="manage__list">
            <li data-id="${data.id}" class="manage__item vatcat__payment-status">
              <i class="fa fa-thumbs-up"></i>Paid
            </li>

          </ul>
        </nav>
      </td>

   </tr>`;
  return row;
}

/*
 * Table template for displaying list of vendors.
 *
 * @param {object} data - The response from server of vendor data.
 * @param {string} - The template for vendor list.
 */
export function vendorListTemplate(data) {
  const USER_ROLE = localStorage.getItem('role');
  const hideFromStaff = USER_ROLE === 'staff' ? 'hide' : '';
  const row = `<tr data-id="${data.id}">
    <td class="">
      <p class="ui text size-textmd left-margin name">${data.name}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin number">${data.number}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd left-margin portfolio">${data.portfolio}</p>
    </td>

    <td class="">
      <p class="ui text size-textmd">
        <i class="${hideFromStaff} fa fa-edit" data-id="${data.id}"></i>
      </p>
    </td>

    <td class="">
      <p class="ui text size-textmd">
        <i class="fa fa-trash ${hideFromStaff}" data-id="${data.id}"></i>
      </p>
    </td>
   </tr>`;
  return row;
}

/**
 * Display list of maintenance in the databases.
 *
 * @param {object} data - The maintenance/fault retrieve from databases.
 */
export function displayMaintenance(data) {
  const tableBody = $(".room-facility-body");

  const userRole = localStorage.getItem('role');
  const hideFromStaff = userRole === 'staff' ? 'hide': '';

  const photoSrc = (
    data.image ?
    `data:image/;base64, ${data.image}` :
    '/static/images/public/profile_photo_placeholder.png'
  );


  let reportStatusColor = '';
  let reportStatusText = '';
  if (!data.status) {
    reportStatusColor = 'red';
    reportStatusText = 'Pending';
  } else if (data.status) {
    reportStatusColor = 'green';
    reportStatusText = 'Fixed';
  }
  const row = `
    <tr data-id="${data.id}">
      <td>
        <div class="room-info">
          <p>${data.room_name}</p>
          <p>#${data.room_number}</p>
        </div>
     </td>
          <td>${data.fault}</td>
          <td class="maintenance__report-status" style="color: ${reportStatusColor}">${reportStatusText}</td>
          <td><img src="${photoSrc}" alt="Fault Image" style="width: 100px; height: 50px;" /></td>
          <td>
              <button class="options-button">⋮</button>
              <div class="options-menu">
                  <p class="maintenance__details" data-id="${data.id}"><i class="fa fa-eye"></i>&nbsp;&nbsp;Details</p>
                  <p class=" {hideFromStaff} delete__maintenance-option" data-id="${data.id}"><i class="fa fa-trash"></i>&nbsp;&nbsp;Delete</p>
              </div>
          </td>
          </tr>
      `;
  tableBody.append(row);
}

/**
 * Display the cart different from management & staff main dashboard
 *
 * @param {string} title - The title of the cart
 * @param {object} btn - An object of button ID and content.
 * @param {string} icon - Font is awesome of the cart icon.
 *
 * @return {string} - The cart template string.
 */
export function staffManagementCommonCart(title, btn, userRole, icon, cartColor) {
  const hideClass = userRole === 'staff' ? '' : 'hidden';
  console.log(userRole === 'staff');
  return `
    <div>
      <div class="main__row-1 ${cartColor}">
        <i class="fas ${icon}"></i>
      </div>
      <p>${title}</p>
    </div>
    <div class="main__row-2">
      <button id="${btn.id}" class="highlight-btn">${btn.content}</button>
      <h1 style="visibility: ${hideClass}"><em id="main__today-check--in">0</em></h1>
    </div>
  `
}
