import  { fetchData, getBaseUrl, highLightOrderBtn } from '../global/utils.js';
import  { displayFoodDrink } from '../global/templates.js';

$(document).ready(function() {
  const API_BASE_URL = getBaseUrl()['apiBaseUrl'];

  window.CART = new Map();  // Declare Globally

 $('#dynamic__load-dashboard').on('click', '.order-btn', function() {
    const $clickBtn = $(this);

    const itemId = $clickBtn.data('id');
    const itemType = $clickBtn.data('type');  // E.g., food or drink
    const itemAmount = $clickBtn.data('amount');
    const itemName = $clickBtn.data('name');
    const itemQty = 1; // Initiate count to one once an item is selected

    if (CART.has(itemId)) {
      // If item exists, remove it
      CART.delete(itemId);
      $clickBtn.removeClass('highlight-btn');
    } else {
      // If item does not exist, add it
      CART.set(itemId, { itemType, itemName, itemAmount, itemQty });
      $clickBtn.addClass('highlight-btn');
    }

    // Show the count of item order added to cart.
    if (CART.size !== 0) {
      $('#sidebar__order-count').text(CART.size);
      $('#sidebar__order-count').show();
    } else {
      $('#sidebar__order-count').hide();
    }
  });

  $('#dynamic__load-dashboard').on(
    'click', '#restaurant__food, #restaurant__drink, #restaurant__all',
    function() {
      const $clickBtn = $(this);
      $('#restaurant__food, #restaurant__drink, #restaurant__all')
        .removeClass('highlight-btn');
      $('#restaurant__food--drinks').empty();
      $clickBtn.addClass('highlight-btn');

      const clickId = $clickBtn.attr('id');

      // Handle filtering of items in restaurant e.g., foods, drinks etc.
      switch(clickId) {
        case 'restaurant__all': {
          const foodDrinkUrl = API_BASE_URL + '/foods/drinks';
          fetchData(foodDrinkUrl)
          .then(({ foods, drinks }) => {
            displayFoodDrink(foods, drinks);
            highLightOrderBtn(CART);
          })
          .catch((error) => {
            console.log(error);
          });
          break;
        }
        case 'restaurant__food': {
          const foodUrl = API_BASE_URL + '/foods';
          fetchData(foodUrl)
          .then((foods) => {
            displayFoodDrink(foods, null);
            highLightOrderBtn(CART);
          })
          .catch((error) => {
            console.log(error);
          });
          break;
        }
        case 'restaurant__drink': {
          const drinkUrl = API_BASE_URL + '/drinks';
          fetchData(drinkUrl)
          .then((drinks) => {
            displayFoodDrink(null, drinks);
            highLightOrderBtn(CART);
          })
          .catch((error) => {
            console.log(error);
          });

          break;
        }
      }
    });
});
