export const createEventHandler = (rootElement, handlers) => {
  rootElement.addEventListener('click', (e) => {
    for (const selector in handlers) {
      const target = e.target.closest(selector);
      if (target) {
        e.preventDefault();
        handlers[selector](e, target);
        break;
      }
    }
  });
};