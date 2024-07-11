import { createShoppingCart } from './createShoppingCart';
import { MainLayout, CartTotal, CartItem } from './templates';
import { createEventHandler } from './utils';

const cart = createShoppingCart()

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 */
const productList = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];


const updateCartView = () => {
  const cartItemsElement = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');
  const items = cart.getItems();

  cartItemsElement.innerHTML = items.map(CartItem).join('');

  const { total, discountRate } = cart.getTotal();
  cartTotalElement.innerHTML = CartTotal({ totalPrice: total, discountRate });
};

/**
 * 추가 이벤트 핸들러를 생성합니다.
 */
const mainEventBinding = () => {
  const addToCartButtonElement = document.querySelector('#add-to-cart');
  const productSelectElement = document.querySelector('#product-select');
  createEventHandler(addToCartButtonElement, {
    'button': (e) => {
      const product = productList.find(({ id }) => id === productSelectElement.value);
      cart.addItem(product)
      updateCartView();
    }
  });
  const cartItemElement = document.querySelector('#cart-items');
  createEventHandler(cartItemElement, {
    '.quantity-change': (e) => {
      const productId = e.target.dataset.productId;
      const change = parseInt(e.target.dataset.change);
      const item = cart.getItems().find(item => item.product.id === productId);
      if (item) {
        cart.updateQuantity(productId, item.quantity + change);
        updateCartView();
      }
    },
    '.remove-item': (e) => {
      const productId = e.target.dataset.productId;
      cart.removeItem(productId);
      updateCartView();
    }
  });

}


export const createCartView = () => {
  const appElement = document.getElementById('app');
  appElement.innerHTML = MainLayout({ items: productList });
  mainEventBinding();
  updateCartView();
};
