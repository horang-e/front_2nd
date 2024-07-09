import { memory, createEventHandler } from "./global";


const handleCartItems = (e, type) => {
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

  const filteredCart = cart.filter(({ quantity }) => quantity > 0) || [];
  memory.setData('cart', filteredCart);
}


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

let eventHandlerBound = false;

const cartEventBinding = () => {
  if (eventHandlerBound) return;

  const cartItems = document.querySelector('#cart-items');
  createEventHandler(cartItems, {
    '.quantity-change': (e) => {
      const change = parseInt(e.target.dataset.change);
      handleCartItems(e, change > 0 ? 'plus' : 'minus');
    },
    '.remove-item': (e) => {
      handleCartItems(e, 'remove');
    }
  });

  eventHandlerBound = true;
}


const cartItemsViewRender = () => {
  const cartItems = document.querySelector('#cart-items');
  const cart = memory.getData('cart');
  if (!cart) return;
  cartItems.innerHTML = '';
  cart.forEach(({ id, name, price, quantity }) => {
    cartItems.innerHTML += cartItemView({ id, name, price, quantity });
    if (cart.length !== 0) {
      cartEventBinding();
    }
  });

}

export default cartItemsViewRender;
