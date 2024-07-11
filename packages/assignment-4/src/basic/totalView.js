import { memory } from './global';


/**
 * 
 * @param {*} totalPrice 
 * @param {*} discountRate 
 * @property {number} totalPrice
 * @property {number} discountRate
 * @returns 
 */
const cartTotalView = (totalPrice, discountRate) => `
  <div id='cart-total' class='text-xl font-bold my-4'>
    총액: ${totalPrice.toFixed(0)}원
    ${discountRate > 0 ? `<span class='text-green-500 ml-2'>(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''}
  </div>`;


const DISCOUNT_RATE = {
  p1: 10,
  p2: 15,
  p3: 20,
}

/**
 * 할인이 적용되지 않은 총액을 계산합니다.
 * @param {Object} cart 
 * @returns 
 */
const calculateOriginalTotalPrice = (cart) => {
  return cart.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
}
/**
 * 상품별 할인이 적용된 총액을 계산합니다.
 * @param {Object} cart 
 * @returns 
 */
const calculateDiscountTotalPrice = (cart) => {
  return cart.reduce((acc, { id, price, quantity }) =>
    quantity >= 10 ? acc + price * quantity * (1 - DISCOUNT_RATE[id] / 100) : acc + price * quantity
    , 0);
}
/**
 * 총 수량을 계산합니다.
 * @param {Object} cart 
 * @returns 
 */
const calculateTotalQuantity = (cart) => {
  return cart.reduce((acc, { quantity }) => acc + quantity, 0);
}

/**
 * 할인율을 계산합니다.
 * @param {number} originalPrice 
 * @param {number} discountedPrice 
 * @param {number} totalQuantity 
 * @returns 
 */
const calculateDiscountRate = (originalPrice, discountedPrice, totalQuantity) => {
  if (totalQuantity >= 30) return 0.25;
  return (originalPrice - discountedPrice) / originalPrice;
}

/**
 * 할인이 모두 적용된 최종 총액을 계산합니다.
 * @param {number} originalPrice 
 * @param {number} discountedPrice 
 * @param {number} totalQuantity 
 * @returns 
 */
const calculateFinalTotalPrice = (originalPrice, discountedPrice, totalQuantity) => {
  return totalQuantity >= 30 ? originalPrice * 0.75 : discountedPrice;
}

const totalViewRender = () => {
  const cart = memory.getData('cart');

  const cartTotalElement = document.querySelector('#cart-total');

  if (cart === undefined) {
    cartTotalElement.innerHTML = ''
    return;
  }

  const originalTotalPrice = calculateOriginalTotalPrice(cart);
  const discountTotalPrice = calculateDiscountTotalPrice(cart);
  const totalQuantity = calculateTotalQuantity(cart);

  const discountRate = calculateDiscountRate(originalTotalPrice, discountTotalPrice, totalQuantity);
  const finalTotalPrice = calculateFinalTotalPrice(originalTotalPrice, discountTotalPrice, totalQuantity);

  cartTotalElement.innerHTML = cartTotalView(Math.round(finalTotalPrice), discountRate);
}

export default totalViewRender;