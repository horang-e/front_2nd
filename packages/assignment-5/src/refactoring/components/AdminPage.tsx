import { useState } from 'react';
import { Coupon, Product } from '../../types.ts';
import { useEditingProduct } from '../hooks/useEditingProduct.ts';
import { useDiscountForm } from '../hooks/useDiscountForm.ts';

import { useNewProductForm } from '../hooks/useNewProductForm.ts';
import NewProductForm from '../block/NewProductForm.tsx';
import AdminCouponSection from '../block/AdminCouponSection.tsx';
import { useProductAccordion } from '../hooks/useProductAccordion.ts';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({ products, coupons, onProductUpdate, onProductAdd, onCouponAdd }: Props) => {
  const { openProductIds, toggleProductAccordion } = useProductAccordion();
  const { editingProduct, editProperty, applyEditingProduct, setEditingProduct } = useEditingProduct(onProductUpdate);
  const { newDiscount, setNewDiscount, addDiscount, deleteDiscount } = useDiscountForm(editingProduct, editProperty);
  const { newProduct, updateNewProductForm, addNewProduct, showNewProductForm, toggleNewProductForm } =
    useNewProductForm(onProductAdd);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>관리자 페이지</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>상품 관리</h2>
          <button
            onClick={toggleNewProductForm}
            className='bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600'>
            {showNewProductForm ? '취소' : '새 상품 추가'}
          </button>

          {/* 새 상품 추가 폼 */}
          {showNewProductForm && (
            <NewProductForm
              newProduct={newProduct}
              updateNewProductForm={updateNewProductForm}
              addNewProduct={addNewProduct}
            />
          )}

          <div className='space-y-2'>
            {products.map((product, index) => (
              <div key={product.id} data-testid={`product-${index + 1}`} className='bg-white p-4 rounded shadow'>
                <button
                  data-testid='toggle-button'
                  onClick={() => toggleProductAccordion(product.id)}
                  className='w-full text-left font-semibold'>
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>
                {openProductIds.has(product.id) && (
                  <div className='mt-2'>
                    {editingProduct && editingProduct.id === product.id ? (
                      <div>
                        <div className='mb-4'>
                          <label className='block mb-1'>상품명: </label>
                          <input
                            type='text'
                            value={editingProduct.name}
                            onChange={(e) => editProperty('name', e.target.value)}
                            className='w-full p-2 border rounded'
                          />
                        </div>
                        <div className='mb-4'>
                          <label className='block mb-1'>가격: </label>
                          <input
                            type='number'
                            value={editingProduct.price}
                            onChange={(e) => editProperty('price', e.target.value)}
                            className='w-full p-2 border rounded'
                          />
                        </div>
                        <div className='mb-4'>
                          <label className='block mb-1'>재고: </label>
                          <input
                            type='number'
                            value={editingProduct.stock}
                            onChange={(e) => editProperty('stock', e.target.value)}
                            className='w-full p-2 border rounded'
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div>
                          <h4 className='text-lg font-semibold mb-2'>할인 정보</h4>
                          {editingProduct.discounts.map((discount, index) => (
                            <div key={index} className='flex justify-between items-center mb-2'>
                              <span>
                                {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                              </span>
                              <button
                                onClick={() => deleteDiscount(index)}
                                className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'>
                                삭제
                              </button>
                            </div>
                          ))}
                          <div className='flex space-x-2'>
                            <input
                              type='number'
                              placeholder='수량'
                              value={newDiscount.quantity}
                              onChange={(e) => setNewDiscount({ ...newDiscount, quantity: parseInt(e.target.value) })}
                              className='w-1/3 p-2 border rounded'
                            />
                            <input
                              type='number'
                              placeholder='할인율 (%)'
                              value={newDiscount.rate * 100}
                              onChange={(e) => setNewDiscount({ ...newDiscount, rate: parseInt(e.target.value) / 100 })}
                              className='w-1/3 p-2 border rounded'
                            />
                            <button
                              onClick={() => addDiscount(newDiscount)}
                              className='w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                              할인 추가
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={applyEditingProduct}
                          className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2'>
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className='mb-2'>
                            <span>
                              {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}
                        <button
                          data-testid='modify-button'
                          onClick={() => setEditingProduct(product)}
                          className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2'>
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <AdminCouponSection coupons={coupons} onCouponAdd={onCouponAdd} />
      </div>
    </div>
  );
};
