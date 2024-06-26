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
  return target1 === target2;
}


export function createNumber1(n) {
  return n;
}

export function createNumber2(n) {
  return n;
}

export function createNumber3(n) {
  return n;
}

export class CustomNumber {

}

export function createUnenumerableObject(target) {
  return target;
}

export function forEach(target, callback) {

}

export function map(target, callback) {

}

export function filter(target, callback) {

}


export function every(target, callback) {

}

export function some(target, callback) {

}



