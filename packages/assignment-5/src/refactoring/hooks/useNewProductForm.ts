import { useState } from 'react';
import { EditProductCallback, Product } from '../../types';

export const useNewProductForm = (callback: EditProductCallback) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const addNewProduct = (product: Omit<Product, 'id'>) => {
    if (product.name === '') {
      alert('Name is required');
      return;
    }
    if (product.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }
    if (product.stock < 0) {
      alert('Stock must be greater than or equal to 0');
      return;
    }
    callback({
      ...product,
      id: Date.now().toString(),
    });
    setShowNewProductForm(false);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
  };

  const updateNewProductForm = (property: string, value: string | number) => {
    setNewProduct((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const toggleNewProductForm = () => {
    setShowNewProductForm(!showNewProductForm);
  };

  return {
    newProduct,
    updateNewProductForm,
    addNewProduct,
    showNewProductForm,
    toggleNewProductForm,
  };
};
