import { useState } from 'react';
import { Discount, EditDiscountCallback, Product } from '../../types';

export const useDiscountForm = (editingProduct: Product | null, callback: EditDiscountCallback) => {
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const addDiscount = (discount: Discount) => {
    if (editingProduct === null) return;
    const newDiscounts = [...editingProduct.discounts, discount];
    callback('discounts', newDiscounts);
    setNewDiscount({ quantity: 0, rate: 0 });
  };

  const deleteDiscount = (index: number) => {
    if (editingProduct === null) return;
    const newDiscounts = editingProduct.discounts.filter((_, i) => i !== index);
    callback('discounts', newDiscounts);
  };

  return { newDiscount, setNewDiscount, addDiscount, deleteDiscount };
};
