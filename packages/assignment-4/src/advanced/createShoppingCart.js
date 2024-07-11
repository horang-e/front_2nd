export const createShoppingCart = () => {
  const items = [];

  /**
   * 
   * @param {object} product 
   * @param {number} quantity 
   */
  const addItem = (product, quantity = 1) => {
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
  };

  /**
   * 
   * @param {number} id 
   */
  const removeItem = (id) => {
    const index = items.findIndex(item => item.product.id === id);
    if (index !== -1) {
      items.splice(index, 1);
    }
  };

  /**
   * 
   * @param {number} id 
   * @param {number} quantity 
   * @returns 
   */
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const item = items.find(item => item.product.id === id);
    if (item) {
      item.quantity = quantity;
    }
  };

  const getItems = () => [...items];

  const DISCOUNT_RATE = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
  };

  const getTotalQuantity = () => items.reduce((acc, item) => acc + item.quantity, 0);

  const calculateDiscountedPrice = () => {
    return items.reduce((acc, { product, quantity }) => {
      const { id, price } = product;
      const itemTotal = price * quantity;
      if (quantity >= 10) {
        return acc + itemTotal * (1 - DISCOUNT_RATE[id]);
      }
      return acc + itemTotal;
    }, 0);
  };

  const getTotal = () => {
    const originalTotal = items.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
    const discountedTotal = calculateDiscountedPrice();
    const totalQuantity = getTotalQuantity();

    let finalTotal = discountedTotal;
    let discountRate = (originalTotal - discountedTotal) / originalTotal;

    if (totalQuantity >= 30) {
      finalTotal = originalTotal * 0.75;
      discountRate = 0.25;
    }

    return {
      total: finalTotal,
      discountRate: discountRate
    };
  };

  return { addItem, removeItem, updateQuantity, getItems, getTotal };
};