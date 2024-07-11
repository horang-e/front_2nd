export function shallowEquals(target1, target2) {
  //1. 두 값이 엄격하게 같은지 비교
  //case. 1 === 1, 'abc' === 'abc', null === null, undefined === undefined
  if (target1 === target2) return true;
  //2. 두 값이 객체인지 체크
  if (typeof target1 === 'object') {
    //2.1. 원시 래퍼 객체인지 체크
    //case. new Number(1) === new Number(1), new String('abc') === new String('abc')
    //추가설명 : new Number(1)은 Number 객체를 생성. 이는 number 원시 값과는 다른 객체. 그렇기 때문에 instanceof를 사용하여 넘어오는 target1과 target2가 Number,String 혹은 Boolean객체인지 체크 해서 원시 래퍼 객체라면 엄격한 체크를 해준다.
    if ((target1 instanceof Number || target1 instanceof String || target1 instanceof Boolean) &&
      (target2 instanceof Number || target2 instanceof String || target2 instanceof Boolean)) {
      return target1 === target2;
    }
    //2.2. 여긴 도대체 봐도 모르겠다.. 클래스 비교...?
    //case. new class {}() === new class {}()
    if (Object.getPrototypeOf(target1) !== Object.getPrototypeOf(target2)) {
      return target1 === target2;
    }


    if (Array.isArray(target1) && Array.isArray(target2)) {
      //2.3. 배열인지 체크 후 배열의 길이가 같은지 체크 후 각 요소를 엄격하게 비교
      //case. [1,2,3] === [1,2,3],[1, 2, 3, [4]]===[1, 2, 3, [4]],[1, 2, 3, { foo: 1 }]=[1, 2, 3, { foo: 1 }],[1, 2]===[1, 2]
      if (target1.length !== target2.length) return false;
      for (let i = 0; i < target1.length; i++) {
        if (target1[i] !== target2[i]) return false;
      }
      return true;
    } else if (!Array.isArray(target1) && !Array.isArray(target2)) {
      //2.4. 객체인지 체크 후 키의 길이가 같은지 체크 후 각 키의 값을 뽑고 각 키의 값이 같은지 엄격하게 비교
      //case. { a: 1 }==={ a: 1 },{ a: 1 }==={ a: 2 },{ a: 1, b: { c: 2, d: [], e: [1, 2, 3] } }==={ a: 1, b: { c: 2, d: [], e: [1, 2, 3] } },{ a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }==={ a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (target1[key] !== target2[key]) return false;
      }
      return true;
    } else {
      return false;
    }
  }

  return false;
}

export function deepEquals(target1, target2) {
  //1. 두 값이 엄격하게 같은지 비교
  //case. 1 === 1, 'abc' === 'abc', null === null, undefined === undefined
  if (target1 === target2) return true;
  //2. 두 값이 객체인지 체크
  if (typeof target1 === 'object') {
    //2.1. 원시 래퍼 객체인지 체크
    //case. new Number(1) === new Number(1), new String('abc') === new String('abc')
    //추가설명 : new Number(1)은 Number 객체를 생성. 이는 number 원시 값과는 다른 객체. 그렇기 때문에 instanceof를 사용하여 넘어오는 target1과 target2가 Number,String 혹은 Boolean객체인지 체크 해서 원시 래퍼 객체라면 엄격한 체크를 해준다.
    if ((target1 instanceof Number || target1 instanceof String || target1 instanceof Boolean) &&
      (target2 instanceof Number || target2 instanceof String || target2 instanceof Boolean)) {
      return target1 === target2;
    }
    //2.2. 여긴 도대체 봐도 모르겠다.. 클래스 비교...?
    //case. new class {}() === new class {}()
    if (Object.getPrototypeOf(target1) !== Object.getPrototypeOf(target2)) {
      return target1 === target2;
    }


    if (Array.isArray(target1) && Array.isArray(target2)) {
      //2.3. 배열인지 체크 후 배열의 길이가 같은지 체크 후 배열이라면 각 요소를 재귀적으로 비교
      //case. [1,2,3] === [1,2,3],[1, 2, 3, [4]]===[1, 2, 3, [4]],[1, 2, 3, { foo: 1 }]=[1, 2, 3, { foo: 1 }],[1, 2]===[1, 2]
      if (target1.length !== target2.length) return false;
      if (JSON.stringify(target1) === JSON.stringify(target2))
        return true;
    } else if (!Array.isArray(target1) && !Array.isArray(target2)) {
      //2.4. 객체인지 체크 후 키의 길이가 같은지 체크 후 각 키의 값을 뽑고 각 키의 값이 같은지 돌면서 비교
      //case. { a: 1 }==={ a: 1 },{ a: 1 }==={ a: 2 },{ a: 1, b: { c: 2, d: [], e: [1, 2, 3] } }==={ a: 1, b: { c: 2, d: [], e: [1, 2, 3] } },{ a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }==={ a: 1, b: { c: 2, d: [], e: [1, 2, 3], f: new Number(1) } }
      const keys1 = Object.keys(target1);
      const keys2 = Object.keys(target2);
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        if (!deepEquals(target1[key], target2[key])) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  return false;
}


export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  return {
    toString() {
      return `${n}`;
    },
    valueOf() {
      return n;
    },
    toJSON() {
      return `this is createNumber3 => ${n}`;
    }
  }

}

export class CustomNumber {
  static instances = new Map();

  constructor(value) {
    if (CustomNumber.instances.has(value)) {
      return CustomNumber.instances.get(value);
    }

    this.value = value;
    CustomNumber.instances.set(value, this);
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return String(this.value);
  }

  toJSON() {
    return `${this.value}`;
  }
}


// 비 열거형 속성을 만드는 함수
// Object.defineProperty()를 사용하여 enumerable 속성을 false로 설정
// 얘는 언제쓰지? 왜 쓰는거지? : 값을 숨기고 싶을때 주로 테스트 코드 사용시 -> 의도적으로 값을 변환하거나 예측대로 흘러가게 만든다거나 할때 사용, 실제 서비스에는 사용하지않지만 복잡한데이터에서는 사용할 수 있다.
export function createUnenumerableObject(target) {
  const result = {};

  for (let key in target) {
    Object.defineProperty(result, key, {
      value: target[key],
      enumerable: false,
    });
  }

  return result;
}

export function forEach(target, callback) {
  //1. target이 배열이거나 NodeList인지 체크
  //추가설명 : NodeList는 DOM API로 생성된 객체로 배열과 유사하지만 배열이 아니다. 그렇기 때문에 NodeList인지 체크를 해준다.
  if (Array.isArray(target) || target instanceof NodeList) {
    for (let i = 0; i < target.length; i++) {
      callback(target[i], i);
    }
  }
  else {
    //2. target이 객체일때 key를 뽑아내서 callback함수에 넣어준다.
    //추가설명 : 비열거형 속성을 가진 객체는 Object.getOwnPropertyNames()를 사용하여 속성 이름을 배열로 반환해야 한다. Object.keys()는 열거 가능한 속성만 반환한다.
    const keys = Object.getOwnPropertyNames(target);
    for (let key of keys) {
      callback(target[key], key);
    }
  }
}

export function map(target, callback) {
  //1. target이 배열이거나 NodeList인지 체크
  //추가설명 : map은 기존의 배열을 직접 바꾸는것이 아닌 새로운 배열을 반환하는 함수이다. 그렇기 때문에 새로운 배열을 반환해야 한다. 그래서 result를 반환해줄 수 있게 만든다.
  if (Array.isArray(target) || target instanceof NodeList) {
    const result = [];
    for (let i = 0; i < target.length; i++) {
      result.push(callback(target[i], i));
    }
    return result;
  }
  else {
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (let key of keys) {
      result[key] = callback(target[key], key);
    }
    return result;
  }
}

export function filter(target, callback) {
  //1. target이 배열이거나 NodeList인지 체크
  //추가설명 : filter는 기존의 배열을 직접 바꾸는것이 아닌 새로운 배열을 반환하는 함수이다. 그렇기 때문에 새로운 배열을 반환해야 한다. 그래서 result를 반환해줄 수 있게 만든다.

  if (Array.isArray(target) || target instanceof NodeList) {
    //callback함수의 조건을 만족할때 result에 push해준다.
    const result = [];
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) {
        result.push(target[i]);
      }
    }
    return result;
  }
  else {
    //callback함수의 조건을 만족할때 result에 넣어준다.
    const result = {};
    const keys = Object.getOwnPropertyNames(target);
    for (let key of keys) {
      if (callback(target[key])) {
        result[key] = target[key];
      }
    }
    return result;
  }

}

//함수 설명 : target의 모든 요소가 callback함수의 조건을 만족하면 true를 반환한다.
export function every(target, callback) {
  if (Array.isArray(target) || target instanceof NodeList) {
    //callback함수의 조건을 만족할때 true를 반환한다.
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) {
        return true;
      } else {
        return false;
      }
    }
  }
  else {
    const keys = Object.getOwnPropertyNames(target);
    for (let key of keys) {
      if (callback(target[key])) {
        return true;
      } else {
        return false;
      }
    }
  }

}
//함수 설명 : target의 요소중 하나라도 callback함수의 조건을 만족하면 true를 반환한다.
export function some(target, callback) {
  let result = false;

  if (Array.isArray(target) || target instanceof NodeList) {
    //callback함수의 조건을 만족할때 true를 반환한다.
    for (let i = 0; i < target.length; i++) {
      if (callback(target[i])) {
        result = true;
      }
    }
  }
  else {
    const keys = Object.getOwnPropertyNames(target);
    for (let key of keys) {
      if (callback(target[key])) {
        result = true;
      }
    }
  }
  return result;
}



