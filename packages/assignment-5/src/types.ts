export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}

export interface EditProductCallback {
  (updatedProduct: Product): void;
}

export interface EditCouponCallback {
  (updatedCoupon: Coupon): void;
}

export interface EditDiscountCallback {
  (property: string, value: Discount[]): void;
}
