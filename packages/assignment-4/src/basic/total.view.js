import { memory } from './global';

const cartTotalView = (totalPrice, discountRate) => `
  <div id='cart-total' class='text-xl font-bold my-4'>
    총액: ${totalPrice.toFixed(0)}원
    ${discountRate > 0 ? `<span class='text-green-500 ml-2'>(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}
  </div>`;

const discountRateConfig = {
  p1: 10,
  p2: 15,
  p3: 20,
}

const calculateOriginalTotalPrice = (cart) => {
  return cart.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
}

const calculateDiscountTotalPrice = (cart) => {
  return cart.reduce((acc, { id, price, quantity }) =>
    quantity >= 10 ? acc + price * quantity * (1 - discountRateConfig[id] / 100) : acc + price * quantity
    , 0);
}

const calculateTotalQuantity = (cart) => {
  return cart.reduce((acc, { quantity }) => acc + quantity, 0);
}

const calculateDiscountRate = (originalPrice, discountedPrice, totalQuantity) => {
  if (totalQuantity >= 30) return 0.25;
  return (originalPrice - discountedPrice) / originalPrice;
}

const calculateFinalTotalPrice = (originalPrice, discountedPrice, totalQuantity) => {
  return totalQuantity >= 30 ? originalPrice * 0.75 : discountedPrice;
}

const totalViewRender = () => {
  const cart = memory.getData('cart');

  const cartTotal = document.querySelector('#cart-total');

  if (cart === undefined) {
    cartTotal.innerHTML = ''
    return;
  }

  const originalTotalPrice = calculateOriginalTotalPrice(cart);
  const discountTotalPrice = calculateDiscountTotalPrice(cart);
  const totalQuantity = calculateTotalQuantity(cart);

  const discountRate = calculateDiscountRate(originalTotalPrice, discountTotalPrice, totalQuantity);
  const finalTotalPrice = calculateFinalTotalPrice(originalTotalPrice, discountTotalPrice, totalQuantity);

  cartTotal.innerHTML = cartTotalView(Math.round(finalTotalPrice), discountRate);
}

export default totalViewRender;