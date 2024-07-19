import { useState } from 'react';
import { Coupon, EditCouponCallback } from '../../types';

const initialCoupon: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
};

export const useCouponForm = (callback: EditCouponCallback) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCoupon);

  const addCoupon = (coupon: Coupon) => {
    if (coupon.name === '' || coupon.code === '' || coupon.discountValue === 0) return;
    callback(coupon);
    setNewCoupon(initialCoupon);
  };

  return { newCoupon, setNewCoupon, addCoupon };
};
