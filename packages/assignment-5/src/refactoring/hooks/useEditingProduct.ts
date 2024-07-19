import { useState } from 'react';
import { Discount, EditProductCallback, Product } from '../../types';

export const useEditingProduct = (callback: EditProductCallback) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const editProperty = (property: string, value: string | number | Discount[]) => {
    setEditingProduct((prevProduct) => {
      if (prevProduct === null) return null;
      return { ...prevProduct, [property]: value };
    });
  };

  const applyEditingProduct = () => {
    if (editingProduct === null) return;
    callback(editingProduct);
    setEditingProduct(null);
  };

  return { editingProduct, setEditingProduct, editProperty, applyEditingProduct };
};
