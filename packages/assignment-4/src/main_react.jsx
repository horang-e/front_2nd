import React, { useState, useEffect } from 'react';

const Main = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const calculateTotalDiscountRatenPrice = () => {
    // 할인 이후의 총액
    let totalPrice = 0;

    // 총 수량
    let totalQuantity = 0;

    // 할인 이전의 총액
    let originalTotalPrice = 0;

    // 할인율
    let discountRate = 0;

    cartItems.forEach((item) => {
      const originalTotalPricePerItem = item.price * item.quantity;
      let discountRatePerItem = 0;
      let discountTotalPricePerItem = 0;

      totalQuantity += item.quantity;
      originalTotalPrice += originalTotalPricePerItem;

      if (item.quantity >= 10) {
        item.id === 'p1'
          ? (discountRatePerItem = 0.1)
          : item.id === 'p2'
          ? (discountRatePerItem = 0.15)
          : (discountRatePerItem = 0.2);
      }

      discountTotalPricePerItem = originalTotalPricePerItem * (1 - discountRatePerItem);
      totalPrice += discountTotalPricePerItem;
    });

    if (totalQuantity >= 30 && originalTotalPrice * 0.75 < totalPrice) {
      totalPrice = originalTotalPrice * 0.75;
      discountRate = 0.25;
    } else {
      discountRate = (originalTotalPrice - totalPrice) / originalTotalPrice;
    }
    setTotalPrice(totalPrice);
    setDiscountRate(discountRate);
  };

  useEffect(() => {
    calculateTotalDiscountRatenPrice();
  }, [cartItems]);

  const handleCartItem = (event) => {
    const target = event.target;
    const productId = target.dataset.productId;
    const change = parseInt(target.dataset.change);

    if (target.classList.contains('quantity-change')) {
      const changeQuantity = cartItems.map((cartItem) => {
        return cartItem.id === productId ? { ...cartItem, quantity: cartItem.quantity + change } : cartItem;
      });
      const filteredCartItems = changeQuantity.filter((cartItem) => cartItem.quantity > 0);
      setCartItems(filteredCartItems);
    } else if (target.classList.contains('remove-item')) {
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== productId));
    }
  };

  const productList = [
    { id: 'p1', name: '상품1', price: 10000 },
    { id: 'p2', name: '상품2', price: 20000 },
    { id: 'p3', name: '상품3', price: 30000 },
  ];

  const [selectedProduct, setSelectedProduct] = useState(productList[0].id);

  const addToCart = () => {
    productList.forEach((product) => {
      if (product.id === selectedProduct) {
        const chosenCartItem = cartItems.find((cartItem) => cartItem.id === product.id);
        chosenCartItem
          ? setCartItems(
              cartItems.map((cartItem) => {
                if (cartItem.id === product.id) {
                  return { ...cartItem, quantity: cartItem.quantity + 1 };
                }
                return cartItem;
              })
            )
          : setCartItems([...cartItems, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
      }
    });
  };

  console.log('cartItems', cartItems);

  return (
    //w
    <div className='bg-gray-100 p-8' id='w'>
      {/* b */}
      <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
        {/* h */}
        <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
        {/* ct */}
        <div id='cart-items'>
          {cartItems.map((item) => (
            <div key={item.id} id={item.id} className='flex justify-between items-center mb-2'>
              <span>
                {item.name} - {item.price}원 x {item.quantity}
              </span>
              <div>
                <button
                  className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                  onClick={(e) => handleCartItem(e)}
                  data-product-id={item.id}
                  data-change='-1'>
                  -
                </button>
                <button
                  className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                  onClick={(e) => handleCartItem(e)}
                  data-product-id={item.id}
                  data-change='1'>
                  +
                </button>
                <button
                  className='remove-item bg-red-500 text-white px-2 py-1 rounded'
                  onClick={(e) => handleCartItem(e)}
                  data-product-id={item.id}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* tt */}
        {totalPrice !== 0 && (
          <div id='cart-total' className='text-xl font-bold my-4'>
            총액 : {totalPrice}원
            {discountRate > 0 && (
              <span className='text-green-500 ml-2'>({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
            )}
          </div>
        )}

        {/* s */}
        <select
          id='product-select'
          className='border rounded p-2 mr-2'
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}>
          {productList.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        {/* ab */}
        <button id='add-to-cart' className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => addToCart()}>
          추가
        </button>
      </div>
    </div>
  );
};

export default Main;
