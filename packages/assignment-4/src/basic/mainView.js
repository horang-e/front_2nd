import { createEventHandler, memory } from "./global";

const basicView = () => `
<div class='bg-gray-100 p-8' id='w'>
  <div class='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
    <h1 class='text-2xl font-bold mb-4'>장바구니</h1>
    <div id='cart-items'></div>
    <div id='cart-total'></div>
    <select id='product-select' class='border rounded p-2 mr-2'></select>
  <button id='add-to-cart' class='bg-blue-500 text-white px-4 py-2 rounded'>추가</button>
  </div>
</div>`;

/**
 * 장바구니에 상품을 추가합니다.
 */
const addToCart = () => {
  const cart = memory.getData('cart', []);
  const productSelectElement = document.querySelector('#product-select');
  const selectedProduct = productList.find(({ id }) => id === productSelectElement.value);
  const targetIndex = cart.findIndex(({ id }) => id === selectedProduct.id);

  if (targetIndex === -1) {
    cart.push({ ...selectedProduct, quantity: 1 });
  }
  else {
    cart[targetIndex].quantity++;
  }
  memory.setData('cart', cart);

  console.log(cart);
};

/**
 * 이벤트 핸들러를 생성합니다.
 */
const mainEventBinding = () => {
  const addToCartButtonElement = document.querySelector('#add-to-cart');
  createEventHandler(addToCartButtonElement, {
    'button': () => {
      addToCart();
    }
  });
}

//* config
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

/**
 * 
 * @param {string} id
 * @param {string} name
 * @param {number} price
 * @returns 
 */
const optionView = ({ id, name, price }) => {
  return `<option key=${id} value=${id}> ${name} - ${price}원</option>`;
};

/**
 * 옵션 뷰를 렌더링합니다.
 */
const productSelectViewRender = () => {
  const productSelectElement = document.querySelector('#product-select');
  productList.forEach(({ id, name, price }) => {
    productSelectElement.innerHTML += optionView({ id, name, price });
  })
}

const basicViewRender = () => {
  const appElement = document.getElementById('app');
  appElement.innerHTML = basicView();
  mainEventBinding();
  productSelectViewRender();
}

export default basicViewRender;
