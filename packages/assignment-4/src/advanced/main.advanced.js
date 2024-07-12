
import { createCartView } from './createCartView.js';
import { createShoppingCart } from './createShoppingCart.js';
import { bindingEventListeners } from './eventSetup.js';


function main() {
  const cart = createShoppingCart();
  const productList = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
  ];
  createCartView(productList);
  bindingEventListeners(cart, productList);
}

main();