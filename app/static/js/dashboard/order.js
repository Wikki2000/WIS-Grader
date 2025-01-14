import {
  updateElementCount, cartItemsTotalAmount, getBaseUrl, confirmationModal,
  validateForm, showNotification, ajaxRequest, fetchData, britishDateFormat
} from '../global/utils.js';

function orderHistoryTableTemplate(order, customer) {
  const paymentStatus = order.is_paid ? 'Paid' : 'Pending';
  const textColor = order.is_paid ? 'green' : 'red';

  const row = `
<tr data-id="${order.id}">
    <td>
      <p class="ui text size-textmd">${customer.name}</p>
    </td>
    <td>
      <p class="ui text size-textmd">${britishDateFormat(order.updated_at)}</p>
    </td>
    <td>
      <p style="color: ${textColor}" class="ui text size-textmd order__bill-status">${paymentStatus}</p>
    </td>
    <td>
      <p class="ui text size-textmd">₦${order.amount.toLocaleString()}</p>
    </td>
    <td>
      <p class="ui text size-textmd">${order.payment_type}</p>
    </td>

    <td>
      <p><i class="fa fa-ellipsis-v"></i></p>
      <p><i style="display: none;" class="fa fa-times"></i></p>
    </td>
    <td class="manage">
      <nav class="manage__nav">
        <ul class="manage__list">
          <li data-id="${order.id}" data-name="${customer.name}" class="manage__item  order__bill order__manageItem">
            <i class="fa fa-money-bill-wave"></i>Clear Bill
          </li>
	  <li data-id="${order.id}" class="manage__item order__manageItem order__showConfirmModal">
	     <i class="fa fa-shopping-cart"></i>Order Details
	   </li>
          <li data-id="${order.id}" class="manage__item order__print order__manageItem">
            <i class="fa fa-print"></i>Print Receipt
          </li>
        </ul>
      </nav>
    </td>
</tr>`;
  return row;

}

$(document).ready(function() {

  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];
  const APP_BASE_URL = getBaseUrl()['appBaseUrl'];

  /*=========== Handle Order history table menu operation. ===========*/
  $('#dynamic__load-dashboard').on('click', '.order__manageItem', function() {
    const $selectedMenu = $(this);
    const clickItemId = $selectedMenu.data('id');
    const name = $selectedMenu.data('name');

    // Toggle visibility of icon to show and cancel table menu
    $selectedMenu.closest('td').siblings().find('.fa.fa-times').hide();
    $selectedMenu.closest('td').siblings().find('.fa.fa-ellipsis-v').show();

    $selectedMenu.closest('.manage').hide(); // Hide table menu once selected.

    if ($selectedMenu.hasClass('order__bill')) {
      // Load confirmation modal
      const confirmBtCls = 'order__confirm-btn';
      const headingText = 'Confirm Bil Payment';
      const descriptionText = 'This action cannot be undone !'

      const data = [{ data: 'id', value: clickItemId }, {data: 'name', value: name }];
      confirmationModal(headingText, descriptionText, confirmBtCls, data);
    } else if ($selectedMenu.hasClass('order__print')) {
      const orderId = $selectedMenu.data('id');
      const receiptUrl = (
	APP_BASE_URL + `/orders/print-receipt?order_id=${orderId}` 
      );
      window.open(receiptUrl, '_blank');
    } else if ($selectedMenu.hasClass('order__showConfirmModal')) {

      const orderUrl = API_BASE_URL +  `/orders/${clickItemId}/order-items`;
      $('#common__popupModal').css('display', 'flex');

      $('#order__info').empty();
      $('#order__itemList').empty();

      fetchData(orderUrl)
        .then(
          ({ order, customer, ordered_by, cleared_by, order_items }
         ) => {
           const guestType = customer.is_guest ? 'Lodged' : 'Walk In';
           const paymentStatus = (
             order.is_paid ? { status: 'Paid', color: 'green' } : 
             {status: 'Pending', color: 'red' }
           );

           // Check if bill has been cleared
           const cleared = (
             cleared_by !== null ? { firstName: cleared_by.first_name, lastName: cleared_by.last_name, role: cleared_by.portfolio  } : 
             { firstName: ordered_by.first_name, lastName: ordered_by.last_name, role: ordered_by.portfolio }
           );
           $('#order__info').append(
             `<h3>Order Info.</h3>
             <p><b>Guest Name</b> - ${customer.name}</p>
             <p><b>Guest Type</b> - ${guestType}</p>
             <p><b>Purchase Date</b> - ${britishDateFormat(order.updated_at)}</p>
             <p><b>Payment Method</b> - ${order.payment_type}</p>
             <p><b>Payment Status</b> - <span style="color: ${paymentStatus.color};">${paymentStatus.status}</span></p><br />
             <p><em><b>Ordered By</b> - ${ordered_by.first_name} ${ordered_by.last_name} (${ordered_by.portfolio})</em></p>
             <p><em><b>Bill Handle By</b> - ${cleared.firstName} ${cleared.lastName} (${cleared.role})</em></p>
             `
           );
           order_items.forEach(({ name, qty, amount }) => {
             $('#order__itemList').append(`<li class="order__item">
               ${name}&nbsp;&nbsp;&nbsp;
               <em>${qty}&nbsp;&nbsp;&nbsp;</em>
               <em>₦${amount.toLocaleString()}</em>
             </li>`);
           });
           $('#order__totalAmount').text('₦' + order.amount.toLocaleString());
           $('#order__print-receipt').attr('data-id', `${order.id}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  // Handle printing of receipt from Order Details section
  $('#dynamic__load-dashboard')
    .on('click', '#order__print-receipt', function() {
      const orderId = $(this).data('id');
      const receiptUrl = (
        APP_BASE_URL + `/orders/print-receipt?order_id=${orderId}`
      );
      window.open(receiptUrl, '_blank');
    });

  // Handle 'CLEAR BILL' option menu
  $('#dynamic__load-dashboard')
    .on('click', '.order__confirm-btn', function() {
      const $clickBtn = $(this);
      const orderId = $('#extraData').data('id');
      const name = $('#extraData').data('name');
      $clickBtn.prop('disabled', true);  // Avoid multiple request

      const paymentStatusUrl = (
        API_BASE_URL + `/orders/${orderId}/update-payment`
      );

      ajaxRequest(paymentStatusUrl, 'PUT', null,
        (response) => {

          $clickBtn.prop('disabled', false);
          $('#order__confirmation-modal').empty();
          showNotification(`Customer [${name}] Bill Cleared Successfully !`);

          // Update payment status
          $(`tr[data-id="${orderId}"]`)
            .find('.order__bill-status').text('Paid');
          $(`tr[data-id="${orderId}"]`).closest('tr')
            .find('.order__bill-status')
            .css('color', 'green');

        },
        (error) => {
          $clickBtn.prop('disabled', false);
          if (error.status ===  409) {
            showNotification(error.responseJSON.error, true);
          } else {
            showNotification('An error occurred. Please try again.', true);
          }
          $('#order__confirmation-modal').empty();
        }
      );
    });

  // Handle submission of order form
  $('#dynamic__load-dashboard').on('submit', '#order__form', function(e) {
    e.preventDefault();

    const $formSelector = $(this);

    // Validate form data and show error messages
    if (!validateForm($formSelector)) {
      showNotification('Please fill out all required fields.', true);
      return; // Exit if validation fails
    }

    // Load confirmation modal
    const headingText = 'Confirm Order';
    const descriptionText = 'This action cannot be undone !'
    const confirmBtCls = 'order__confirm';

    confirmationModal(headingText, descriptionText, confirmBtCls);
  });

  $('#dynamic__load-dashboard').off('click', '.order__confirm')
    .on('click', '.order__confirm', function(){

      const $button = $(this);
      $button.prop('disabled', true);  // Avoid multiple request

      // Guest data
      const is_guest = (
        $('#order__guest--type-val').val() === 'Walk In' ? true : false
      );
      const name = $('#order__guest--name-val').val();

      // Order data
      const is_paid = (
        $('#order__ispaid-val').val() === 'Yes' ? true : false
      );
      const payment_type = $('#order__payment--type-val').val();
      const amount = parseFloat(
        $('#order__total--amout-cart').val()
        .replaceAll(',', '').replaceAll('₦', '')
      );

      // Merges the ID with other data in cart
      const cartItemsList = [];
      CART.forEach((value, key) => {
        value['itemId'] = key;
        cartItemsList.push(value);
      });

      const data = {
        customerData: { name, is_guest},
        orderData: { payment_type, is_paid, amount },
        itemOrderData: cartItemsList,
      };

      const orderUrl = API_BASE_URL + '/order-items';
      ajaxRequest(orderUrl, 'POST', JSON.stringify(data),
        (response) => {
          $('#order__confirmation-modal').empty();
          showNotification(`Order for ${name} successfully made !`);
          $button.prop('disabled', false);

        },
        (error) => {
	  $button.prop('disabled', false);
	  showNotification('An Error Occured. Try Again !.');
          console.log(error);
        }
      );
    });

  // Switch the dashboard section of ORDERS.
  $('#dynamic__load-dashboard').on('click', '.order__selector', function() {
    const $clickItem = $(this);
    const clickId = $clickItem.attr('id');

    $('.order__selector').removeClass('highlight-btn');
    $clickItem.addClass('highlight-btn');

    // Hide other section once the switch button is click
    $('#order__items-section').hide();
    $('#order__history-section').hide();
    $('.order__emty--cart-section').hide();

    if (clickId === 'order__items') {
      $('#order__items-section').show();
      if (CART.size <= 0) {
        $('.order__emty--cart-section').show();
      }
    } else if (clickId === 'order__history') {
      $('#order__history-section').show();
      $('#order__filter-all').addClass('highlight-btn');

      $('.order__history--table-body').empty();

      const orderUrl = API_BASE_URL + '/order-items';
      fetchData(orderUrl)
        .then((data) => {
          data.forEach(({ order, customer }) => {
            $('.order__history--table-body').append(
              orderHistoryTableTemplate(order, customer)
            );
          });
        })
        .catch((error) => {
        });
    }
  });

  // Handle filter button for Order History Section
  $('#dynamic__load-dashboard').on('click', '.order__filter', function() {
    const $clickItem = $(this);
    const clickId = $clickItem.attr('id');
    $('.order__history--table-body').empty(); 

    switch (clickId) {
      case 'order__filter-all': {
        const orderUrl = API_BASE_URL + '/order-items';
        fetchData(orderUrl)
        .then((data) => {
          data.forEach(({ order, customer, user }) => {
            $('.order__history--table-body').append(
              orderHistoryTableTemplate(order, customer)
            );
          });
        })
        .catch((error) => {
        });
        break;
      }
      case 'order__filter-pending': {
        const orderPendingPaymentUrl = API_BASE_URL + '/orders/pending';
        fetchData(orderPendingPaymentUrl)
        .then((data) => {
          data.forEach(({ order, customer, user }) => {
            $('.order__history--table-body').append(
              orderHistoryTableTemplate(order, customer)
            );
          });
        })
        .catch((error) => {
        });
        break;
      }
      case 'order__filter-paid': {
        const orderPaidPaymentUrl = API_BASE_URL + '/orders/paid';
        fetchData(orderPaidPaymentUrl)
        .then((data) => {
          data.forEach(({ order, customer, user }) => {
            $('.order__history--table-body').append(
              orderHistoryTableTemplate(order, customer)
            );
          });
        })
        .catch((error) => {
        });
        break;
      }
    }

    $('.order__filter').removeClass('highlight-btn');
    $clickItem.addClass('highlight-btn'); 
  });

  // Display dropdown menu
  $('#dynamic__load-dashboard').on(
    'click', '.order__dropdown-btn',
    function() {

      const $clickItem = $(this);
      const clickId = $clickItem.attr('id');

      switch(clickId) {
        case 'order__payment-type': {
          $('#order__payment--type-dropwdown').toggle();
          break;
        }
        case 'order__ispaid': {
          $('#order__ispaid-dropdown').toggle();
          break;
        }
        case 'order__guest-type': {
          $('#order__guest--type-dropdown').toggle();
          break;
        }
      }
    });

  // Update amount and count of quantity of items ordered
  $('#dynamic__load-dashboard').on('click', '.order__count-btn', function() {
    const $clickItem = $(this);
    const $countValueSelector = $clickItem.siblings('.order__counter-value');
    const itemId = $clickItem.data('id');
    const unitPrice = parseFloat(
      $clickItem.data('price').replaceAll(',', '')
    );

    const itemData = CART.get(itemId);  // Retrieve item from cart

    const isIncrease = $clickItem
      .hasClass('order__btn-increase') ? true : false;
    const currentCount = updateElementCount($countValueSelector, isIncrease);

    // Ensure that qty count always ends with one
    if (currentCount === 0) {
      $countValueSelector.text(1);
    }

    if (currentCount >= 1) {

      // Calculate the total price and quantity of items in the CART
      if (isIncrease) {
        const totalAmount = parseFloat(
          itemData['itemAmount'].replaceAll(',', '')
        ) + unitPrice;
        itemData['itemAmount'] = totalAmount.toLocaleString();

        itemData['itemQty'] = itemData['itemQty'] + 1;
      } else {
        const totalAmount = parseFloat(
          itemData['itemAmount'].replaceAll(',', '')
        ) - unitPrice;

        itemData['itemQty'] = itemData['itemQty'] - 1;
        itemData['itemAmount'] = totalAmount.toLocaleString();
      }
    }


    CART.set(itemId, itemData); // update with object of total amount & qty.

    // Update the amount in proportion to item qty counts.
    const totalAmount = cartItemsTotalAmount(CART);
    $('#order__total--amout-cart').val('₦' + totalAmount.toLocaleString());

    $clickItem.closest('.order__items--list-content')
      .find('.order__item-amount')
      .text('₦' + itemData['itemAmount'].toLocaleString());
  });

  // Retrieve selected option from dropdown menu and store in form hidden input
  // field so to be sent to servere during form submission.
  $('#dynamic__load-dashboard')
    .on('click', '.order__dropdown-selector', function() {
      const $currentClickItem = $(this);
      const selectedOption = $currentClickItem.text();

      const parentId = $currentClickItem.closest('.dropdown')
        .find('.order__dropdown-btn').attr('id');


      // Update with selected option & Hide dropdown menu.
      $currentClickItem.closest('.dropdown')
        .find('.order__dropdown-btn span')
        .text(selectedOption);
      $('.dropdown-menu').hide();

      switch(parentId) {
        case 'order__payment-type':
          $('#order__payment--type-val').val(selectedOption);
          break;

        case 'order__ispaid':
          $('#order__ispaid-val').val(selectedOption);
          break;

        case 'order__guest-type':
          $('#order__guest--type-val').val(selectedOption);
          break;
      }
    });

  // Remove an item ordered from cart.
  $('#dynamic__load-dashboard')
    .on('click', '.order__delete-item', function() {
      const $clickItem = $(this);
      const itemId = $clickItem.data('id');

      const deletedItemAmount = parseFloat(
        $clickItem.closest('.order__items--list-content')
        .find('.order__item-amount').text()
        .replaceAll(',', '').replaceAll('₦', '')
      );
      const previousTotalAmount = parseFloat(
        $('#order__total--amout-cart').val()
        .replaceAll(',', '').replaceAll('₦', '')
      );
      const currentTotalAmount = previousTotalAmount - deletedItemAmount;

      $clickItem.closest('.order__items--list-content').remove();
      CART.delete(itemId);

      // Update count & and total amount on delete
      const count = updateElementCount($('#sidebar__order-count'), false);
      $('#order__total--amout-cart').val(
        '₦' + currentTotalAmount.toLocaleString()
      );

      // Handle display for empty cart
      if (CART.size === 0) {
        $('.oder__first-col').hide();
        $('.oder__second-col').hide();
        $('.order__empty-cart').show();
      }

      // Don't Display count of zero.
      if (count === 0) {
        $('#sidebar__order-count').hide();
      }
    });
});
