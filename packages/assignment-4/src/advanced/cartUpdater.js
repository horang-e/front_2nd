import { CartItem, CartTotal } from './templates.js';

/**
 * 값이 변경된 장바구니 정보를 화면에 업데이트합니다.
 * @param {ShoppingCart} cart
 */
export function updateCartView(cart) {
  const cartItemsElement = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');
  const cartItems = cart.getItems();

  cartItemsElement.innerHTML = cartItems.map(CartItem).join('');

  const { total, discountRate } = cart.getTotal();
  cartTotalElement.innerHTML = CartTotal({ totalPrice: total, discountRate });
}