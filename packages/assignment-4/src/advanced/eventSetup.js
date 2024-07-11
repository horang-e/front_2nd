import { createEventHandler } from './utils.js';
import { updateCartView } from './cartUpdater.js';

/**
 * 
 * @param {*} cart 
 * @param {*} productList 
 */
export function bindingEventListeners(cart, productList) {
  const addToCartButtonElement = document.querySelector('#add-to-cart');
  const productSelectElement = document.querySelector('#product-select');
  const cartItemElement = document.querySelector('#cart-items');

  createEventHandler(addToCartButtonElement, {
    'button': () => {
      const selectedOption = productList.find(({ id }) => id === productSelectElement.value);
      cart.addItem(selectedOption);
      updateCartView(cart);
    }
  });

  createEventHandler(cartItemElement, {
    '.quantity-change': (e) => {
      const productId = e.target.dataset.productId;
      const change = parseInt(e.target.dataset.change);
      const selectedCartItem = cart.getItems().find(item => item.product.id === productId);
      if (selectedCartItem) {
        cart.updateQuantity(productId, selectedCartItem.quantity + change);
        updateCartView(cart);
      }
    },
    '.remove-item': (e) => {
      const productId = e.target.dataset.productId;
      cart.removeItem(productId);
      updateCartView(cart);
    }
  });
}