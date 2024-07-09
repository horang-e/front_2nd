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

const addToCart = () => {
  const cart = memory.getData('cart', []);
  const productSelect = document.querySelector('#product-select');
  const selectedProduct = productList.find(({ id }) => id === productSelect.value);
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

const mainEventBinding = () => {
  const addToCartButton = document.querySelector('#add-to-cart');
  createEventHandler(addToCartButton, {
    'button': (e) => {
      addToCart();
    }
  });
}

//* config
const productList = [
  { id: 'p1', name: '상품1', price: 10000 },
  { id: 'p2', name: '상품2', price: 20000 },
  { id: 'p3', name: '상품3', price: 30000 },
];

const optionView = ({ id, name, price }) => {
  return `<option key=${id} value=${id}> ${name} - ${price}원</option>`;
};
const productSelectViewRender = () => {
  const productSelect = document.querySelector('#product-select');
  productList.forEach(({ id, name, price }) => {
    productSelect.innerHTML += optionView({ id, name, price });
  })
}

const basicViewRender = () => {
  const $app = document.getElementById('app');
  $app.innerHTML = basicView();
  mainEventBinding();
  productSelectViewRender();
}

export default basicViewRender;
