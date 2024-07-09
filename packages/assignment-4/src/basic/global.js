import Memory from "./Memory";

const createEventHandler = (rootElement, handlers) => {
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

const memory = new Memory();

const initObservers = (key, callbacks) => {
  callbacks.forEach(callback => {
    memory.subscribe(key, callback);
  });
}


export { memory, createEventHandler, initObservers };