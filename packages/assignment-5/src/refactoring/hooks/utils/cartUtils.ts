import { CartItem, Coupon, Discount, Product } from '../../../types';

export const calculateItemTotal = (item: CartItem) => {
  const discount = getMaxApplicableDiscount(item);
  return item.product.price * item.quantity * (1 - discount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  // 할인율을 큰 숫자부터 정렬
  const sortingDiscountList = item.product.discounts.sort((a, b) => b.rate - a.rate);

  // 할인율 중 최대 할인율을 찾아서 적용
  const applicableDiscount = sortingDiscountList.find((discount) => item.quantity >= discount.quantity);

  return applicableDiscount?.rate || 0;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const subtotalAfterProductDiscounts = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  const applyCouponDiscount = (total: number, coupon: Coupon): number => {
    const { discountType, discountValue } = coupon;
    return discountType === 'amount' ? total - discountValue : total * (1 - discountValue / 100);
  };

  const totalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(subtotalAfterProductDiscounts, selectedCoupon)
    : subtotalAfterProductDiscounts;

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  const copiedCart = [...cart];
  const itemIndex = copiedCart.findIndex((item) => item.product.id === productId);

  if (itemIndex === -1) {
    return copiedCart.filter((item) => item.quantity > 0);
  }

  const item = copiedCart[itemIndex];
  item.quantity = Math.min(newQuantity, item.product.stock);

  return copiedCart.filter((item) => item.quantity > 0);
};

export const getMaxDiscount = (discounts: Discount[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  let appliedDiscount = 0;
  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }
  return appliedDiscount;
};
