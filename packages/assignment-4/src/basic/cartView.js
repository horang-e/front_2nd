import { memory, createEventHandler } from "./global";

/**
 * 카트 아이템을 업데이트합니다.
 * @property {event} e
 * @property {string} type
 * @returns 
 */
const updateCartItems = (e, type) => {
  const cart = memory.getData('cart');
  if (!cart) return;
  const productId = e.target.dataset.productId;
  const targetIndex = cart.findIndex(({ id }) => id === productId);
  const targetItem = cart[targetIndex];
  switch (type) {
    case 'plus':
      targetItem.quantity++;
      break;
    case 'minus':
      targetItem.quantity === 0 ? targetItem.quantity : targetItem.quantity--;
      break;
    case 'remove':
      cart.splice(targetIndex, 1);
      break;
  }

  // 수량이 0인 아이템은 제거합니다.
  const filteredCart = cart.filter(({ quantity }) => quantity > 0) || [];

  memory.setData('cart', filteredCart);
}

/**
 * 
 * @param {*} param0 
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @returns 
 */
const cartItemView = ({ id, name, price, quantity }) => `<div key = ${id} id = ${id} class = 'flex justify-between items-center mb-2'>
  <span>
    ${name} - ${price}원 x ${quantity}
  </span>
  <div>
    <button
      class='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
      data-product-id=${id}
      data-change='-1'>
      -
    </button>
    <button
      class='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
      data-product-id=${id}
      data-change='1'>
      +
    </button>
    <button
      class='remove-item bg-red-500 text-white px-2 py-1 rounded'
      data-product-id=${id}>
      삭제
    </button>
  </div>
  `;

// 이벤트 핸들러가 바인딩되었는지 여부를 저장합니다.
let eventHandlerBound = false;


/**
 * 카트 아이템에 이벤트를 바인딩합니다.
 */
const cartEventBinding = () => {
  if (eventHandlerBound) return;

  const cartItemElement = document.querySelector('#cart-items');
  createEventHandler(cartItemElement, {
    '.quantity-change': (e) => {
      const change = parseInt(e.target.dataset.change);
      updateCartItems(e, change > 0 ? 'plus' : 'minus');
    },
    '.remove-item': (e) => {
      updateCartItems(e, 'remove');
    }
  });

  eventHandlerBound = true;
}


const cartItemsViewRender = () => {
  const cartItemElement = document.querySelector('#cart-items');
  const cart = memory.getData('cart');
  if (!cart) return;
  cartItemElement.innerHTML = '';
  cart.forEach(({ id, name, price, quantity }) => {
    cartItemElement.innerHTML += cartItemView({ id, name, price, quantity });
    if (cart.length !== 0) {
      cartEventBinding();
    }
  });
}

export default cartItemsViewRender;
