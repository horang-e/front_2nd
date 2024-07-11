import { MainLayout } from './templates';

export const createCartView = (productList) => {
  const appElement = document.getElementById('app');
  appElement.innerHTML = MainLayout({ items: productList });
};
