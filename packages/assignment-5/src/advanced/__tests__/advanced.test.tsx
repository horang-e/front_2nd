import { useState } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';

import { CartPage } from '../../refactoring/components/CartPage.tsx';
import { AdminPage } from '../../refactoring/components/AdminPage.tsx';
import type { Coupon, Product } from '../../types';
import { getRemainingStock, getMaxDiscount, getAppliedDiscount } from '../../refactoring/hooks/utils/cartUtils.ts';
import {
  useNewProductForm,
  useCouponForm,
  useDiscountForm,
  useEditingProduct,
  useCart,
  useProducts,
  useProductAccordion,
} from '../../refactoring/hooks/index.ts';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('새로 추가한 훅과 유틸 함수 테스트 > ', () => {
    const testProducts: Product[] = [
      { id: '1', name: '상품1', price: 10000, stock: 20, discounts: [] },
      {
        id: '2',
        name: '상품2',
        price: 20000,
        stock: 10,
        discounts: [{ quantity: 10, rate: 0.1 }],
      },
      {
        id: '3',
        name: '상품3',
        price: 30000,
        stock: 15,
        discounts: [{ quantity: 10, rate: 0.15 }],
      },
      {
        id: '4',
        name: '상품4',
        price: 40000,
        stock: 20,
        discounts: [
          { quantity: 10, rate: 0.2 },
          { quantity: 15, rate: 0.25 },
        ],
      },
    ];

    const testProduct: Product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      stock: 10,
      discounts: [
        { quantity: 2, rate: 0.1 },
        { quantity: 5, rate: 0.2 },
      ],
    };

    let useCartResult: {
      current: ReturnType<typeof useCart>;
    };
    let useProductsResult: {
      current: ReturnType<typeof useProducts>;
    };

    beforeEach(() => {
      const { result: cartResult } = renderHook(() => useCart());
      useCartResult = cartResult;

      const { result: productsResult } = renderHook(() => useProducts(testProducts));
      useProductsResult = productsResult;
    });

    describe('새로운 유틸 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      describe('getMaxDiscount', () => {
        test('빈 배열에 대해 0을 반환해야 합니다.', () => {
          expect(getMaxDiscount([])).toBe(0);
        });
        test('가장 높은 할인율을 반환해야 합니다.', () => {
          expect(getMaxDiscount(testProducts[0].discounts)).toBe(0);
          expect(getMaxDiscount(testProducts[1].discounts)).toBe(0.1);
          expect(getMaxDiscount(testProducts[2].discounts)).toBe(0.15);
          expect(getMaxDiscount(testProducts[3].discounts)).toBe(0.25);
        });
      });

      describe('getRemainingStock', () => {
        test('카트에 특정 상품이 없을 때 해당 상품의 전체 재고를 반환해야 합니다', () => {
          expect(getRemainingStock(useCartResult.current.cart, useProductsResult.current.products[0])).toBe(20);
        });
        test('카트에 특정 상품이 있을 때 해당 상품의 남은 재고를 정확히 계산해야 합니다', () => {
          act(() => {
            useCartResult.current.addToCart(testProducts[0]); // quantity = 1
          });

          expect(getRemainingStock(useCartResult.current.cart, useProductsResult.current.products[0])).toBe(20 - 1);
        });
      });

      describe('getAppliedDiscount', () => {
        test('수량이 할인 기준에 미치지 못할 때 0을 반환해야 합니다', () => {
          act(() => {
            useCartResult.current.addToCart(testProducts[0]);
          });

          const item = useCartResult.current.cart[0];
          // 수량을 추가하지 않았기 때문에 0이어야 합니다
          expect(getAppliedDiscount(item)).toBe(0);
        });
        test('수량에 따라 적용 가능한 최대 할인율을 반환해야 합니다', () => {
          act(() => {
            useCartResult.current.addToCart(testProducts[0]);
            useCartResult.current.addToCart(testProducts[1]);
            useCartResult.current.addToCart(testProducts[2]);
            useCartResult.current.addToCart(testProducts[3]);
          });

          const item = useCartResult.current.cart[3];

          act(() => {
            useCartResult.current.updateQuantity('4', 12);
          });

          expect(getAppliedDiscount(item)).toBe(0.2);

          act(() => {
            useCartResult.current.updateQuantity('4', 15);
          });

          expect(getAppliedDiscount(item)).toBe(0.25);
        });
        test('수량이 가장 높은 할인 기준을 초과할 때도 최대 할인율을 반환해야 합니다', () => {
          act(() => {
            useCartResult.current.addToCart(testProducts[0]);
            useCartResult.current.addToCart(testProducts[1]);
            useCartResult.current.addToCart(testProducts[2]);
            useCartResult.current.addToCart(testProducts[3]);
          });

          const item = useCartResult.current.cart[3];
          act(() => {
            useCartResult.current.updateQuantity('4', 20);
          });
          expect(getAppliedDiscount(item)).toBe(0.25);
        });
      });
    });

    describe('새로운 hook 함수를 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      describe('useEditingProduct', () => {
        test('editingProduct의 초기 상태는 null이어야 합니다', () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          expect(result.current.editingProduct).toEqual(null);
        });
        test('setEditingProduct 함수는 상품을 설정해야 합니다', () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          act(() => {
            result.current.setEditingProduct(testProduct);
          });

          expect(result.current.editingProduct).toEqual(testProduct);
        });
        test('editProperty 함수는 특정 속성을 업데이트해야 합니다', () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          act(() => {
            result.current.setEditingProduct(testProduct);
            result.current.editProperty('stock', 5);
          });

          expect(result.current.editingProduct?.stock).toBe(5);
        });
        test('applyEditingProduct 함수는 onProductUpdate를 호출하고 editingProduct를 null로 설정해야 합니다', async () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          act(() => {
            result.current.setEditingProduct(testProduct);
          });

          act(() => {
            result.current.applyEditingProduct();
          });

          await waitFor(() => {
            expect(result.current.editingProduct).toEqual(null);
            expect(onProductUpdate).toBeCalledTimes(1);
          });
        });
        test('editProperty 함수는 editingProduct가 null일 때 아무 동작도 하지 않아야 합니다', () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          act(() => {
            result.current.editProperty('stock', 5);
          });

          expect(result.current.editingProduct).toEqual(null);
          expect(onProductUpdate).not.toHaveBeenCalled();
        });
        test('applyEditingProduct 함수는 editingProduct가 null일 때 onProductUpdate를 호출하지 않아야 합니다', () => {
          const onProductUpdate = vi.fn();
          const { result } = renderHook(() => useEditingProduct(onProductUpdate));

          act(() => {
            result.current.applyEditingProduct();
          });

          expect(result.current.editingProduct).toEqual(null);
          expect(onProductUpdate).not.toHaveBeenCalled();
        });
      });

      describe('useNewProductForm', () => {
        const mockNewProduct = {
          name: 'New Product',
          price: 100,
          stock: 10,
          discounts: [],
        };

        test('addNewProduct 함수는 onProductAdd를 호출하고 상태를 초기화해야 합니다', () => {
          const onProductAdd = vi.fn();
          const { result } = renderHook(() => useNewProductForm(onProductAdd));

          act(() => {
            result.current.addNewProduct(mockNewProduct);
          });

          expect(onProductAdd).toBeCalledTimes(1);
          expect(result.current.newProduct).toEqual({
            name: '',
            price: 0,
            stock: 0,
            discounts: [],
          });
        });
        test('updateNewProductForm 함수는 부분적인 업데이트를 허용해야 합니다', () => {
          const onProductAdd = vi.fn();
          const { result } = renderHook(() => useNewProductForm(onProductAdd));

          act(() => {
            result.current.addNewProduct(mockNewProduct);
          });

          act(() => {
            result.current.updateNewProductForm('price', 1000);
          });

          expect(result.current.newProduct.price).toBe(1000);
        });
      });

      describe('useDiscountForm', () => {
        const mockProduct: Product = {
          id: '1',
          name: 'Test Product',
          price: 100,
          stock: 10,
          discounts: [{ quantity: 5, rate: 0.1 }],
        };

        test('초기 상태가 올바르게 설정되어야 합니다', () => {
          const mockCallback = vi.fn();

          const { result } = renderHook(() => useDiscountForm(mockProduct, mockCallback));

          expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
        });

        test('setNewDiscount 함수가 새로운 할인을 올바르게 설정해야 합니다', () => {
          const mockCallback = vi.fn();

          const { result } = renderHook(() => useDiscountForm(mockProduct, mockCallback));

          act(() => {
            result.current.setNewDiscount({ quantity: 10, rate: 0.2 });
          });

          expect(result.current.newDiscount).toEqual({ quantity: 10, rate: 0.2 });
        });

        test('addDiscount 함수가 새로운 할인을 추가하고 콜백을 호출해야 합니다', () => {
          const mockCallback = vi.fn();

          const { result } = renderHook(() => useDiscountForm(mockProduct, mockCallback));

          act(() => {
            result.current.addDiscount({ quantity: 10, rate: 0.2 });
          });

          expect(mockCallback).toHaveBeenCalledWith('discounts', [
            { quantity: 5, rate: 0.1 },
            { quantity: 10, rate: 0.2 },
          ]);
          expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
        });

        test('deleteDiscount 함수가 지정된 인덱스의 할인을 제거하고 콜백을 호출해야 합니다', () => {
          const mockCallback = vi.fn();

          const { result } = renderHook(() => useDiscountForm(mockProduct, mockCallback));

          act(() => {
            result.current.addDiscount({ quantity: 10, rate: 0.2 });
          });

          act(() => {
            result.current.deleteDiscount(1);
          });

          expect(mockCallback).toHaveBeenCalledWith('discounts', [{ quantity: 5, rate: 0.1 }]);
        });

        test('editingProduct가 null일 때 addDiscount와 deleteDiscount가 아무 동작도 하지 않아야 합니다', () => {
          const mockCallback = vi.fn();

          const { result } = renderHook(() => useDiscountForm(null, mockCallback));

          act(() => {
            result.current.addDiscount({ quantity: 10, rate: 0.2 });
          });

          expect(mockCallback).not.toHaveBeenCalled();

          act(() => {
            result.current.deleteDiscount(0);
          });

          expect(mockCallback).not.toHaveBeenCalled();

          expect(result.current.newDiscount).toEqual({ quantity: 0, rate: 0 });
        });
      });

      describe('useCouponForm', () => {
        const mockCoupon: Coupon = { name: 'New Coupon', code: 'NEW10', discountType: 'percentage', discountValue: 10 };

        test('addCoupon 함수는 유효한 쿠폰일 때 onCouponAdd를 호출하고 상태를 초기화해야 합니다', async () => {
          const onCouponAdd = vi.fn();
          const { result } = renderHook(() => useCouponForm(onCouponAdd));

          act(() => {
            result.current.addCoupon(mockCoupon);
          });

          await waitFor(() => {
            expect(onCouponAdd).toBeCalledTimes(1);
            expect(result.current.newCoupon).toEqual({
              name: '',
              code: '',
              discountType: 'percentage',
              discountValue: 0,
            });
          });
        });
        test('addCoupon 함수는 유효하지 않은 쿠폰일 때 onCouponAdd를 호출하지 않아야 한다.', async () => {
          const onCouponAdd = vi.fn();
          const { result } = renderHook(() => useCouponForm(onCouponAdd));

          act(() => {
            result.current.addCoupon({ ...mockCoupon, name: '' });
          });

          await waitFor(() => {
            expect(onCouponAdd).toBeCalledTimes(0);
          });
        });
      });

      describe('useProductAccordion', () => {
        test('toggleProductAccordion 함수는 productId를 토글해야 합니다', () => {
          const { result } = renderHook(() => useProductAccordion());
          act(() => {
            result.current.toggleProductAccordion(mockProducts[0].id);
          });
          expect(result.current.openProductIds).toContain(mockProducts[0].id);
          act(() => {
            result.current.toggleProductAccordion(mockProducts[0].id);
          });
          expect(result.current.openProductIds).not.toContain(mockProducts[0].id);
        });
        test('toggleProductAccordion 함수는 동일한 productId를 여러 번 토글해도 정상적으로 작동해야 합니다', () => {
          const { result } = renderHook(() => useProductAccordion());
          act(() => {
            result.current.toggleProductAccordion(mockProducts[0].id);
            result.current.toggleProductAccordion(mockProducts[0].id);
            result.current.toggleProductAccordion(mockProducts[0].id);
          });
          expect(result.current.openProductIds).toContain(mockProducts[0].id);
          act(() => {
            result.current.toggleProductAccordion(mockProducts[0].id);
          });
          expect(result.current.openProductIds).not.toContain(mockProducts[0].id);
        });
        test('toggleProductAccordion 함수는 여러 개의 productId를 관리할 수 있어야 합니다', () => {
          const { result } = renderHook(() => useProductAccordion());
          act(() => {
            result.current.toggleProductAccordion(mockProducts[0].id);
            result.current.toggleProductAccordion(mockProducts[1].id);
            result.current.toggleProductAccordion(mockProducts[2].id);
          });
          expect(result.current.openProductIds).toContain(mockProducts[0].id);
          expect(result.current.openProductIds).toContain(mockProducts[1].id);
          expect(result.current.openProductIds).toContain(mockProducts[2].id);
          act(() => {
            result.current.toggleProductAccordion(mockProducts[1].id);
          });
          expect(result.current.openProductIds).toContain(mockProducts[0].id);
          expect(result.current.openProductIds).not.toContain(mockProducts[1].id);
          expect(result.current.openProductIds).toContain(mockProducts[2].id);
        });
      });
    });
  });
});
