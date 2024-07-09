class Memory {
  constructor() {
    this.data = {};
    this.observers = {};
  }

  setData(key, value) {
    this.data[key] = value;
    this.notify(key);
  }

  getData(key, defaultValue) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  subscribe(key, callback) {
    if (!this.observers[key]) {
      this.observers[key] = [];
    }
    this.observers[key].push(callback);
  }

  notify(key) {
    if (this.observers[key]) {
      this.observers[key].forEach(callback => callback(this.data[key]));
    }
  }
}

export default Memory;