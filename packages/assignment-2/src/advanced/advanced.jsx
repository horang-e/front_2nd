import { createContext, useContext, useState } from 'react';
const memoCache = new Map();

export const memo1 = (fn) => {
  // 함수의 소스코드를 문자열로 변환하여 동일한 함수 정의를 가진 함수에 대해 동일한 키를 생성
  //"() => Array.from({ length: a }).map((_, k) => k + 1)"
  const key = fn.toString();

  //캐시값에 해당 키가 있으면 캐시값을 반환
  if (memoCache.has(key)) {
    return memoCache.get(key);
  }
  //캐시값에 해당 키가 없으면 함수를 실행하고 결과값을 캐시에 저장
  const result = fn();
  memoCache.set(key, result);

  return result;
};

const depsCache = [];
export const memo2 = (fn, deps) => {
  //함수에 결과값을 캐시할 때 디펜던시값을 추가로 받아서 디펜던시값이 바뀌면 캐시를 초기화(deps값은 배열로 받음)
  const key = fn.toString();
  const result = fn();

  //deps배열과 캐시되어있는 deps배열을 비교하기 위한 함수
  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };
  //propsCache 배열에 해당 키가 있고 props값중에 해당 변수가 있으면 캐시값을 반환
  const cacheIndex = depsCache.findIndex((cache) => cache.key === key);
  //해당 캐시값이 있을 때
  if (cacheIndex !== -1) {
    const cache = depsCache[cacheIndex];
    //deps값에 변화가 없을 때
    if (areArraysEqual(deps, cache.deps)) {
      return cache.result;
    } else {
      //deps값에 변화가 있을 때
      depsCache[cacheIndex] = { key, deps, result };
      return result;
    }
  } else {
    //해당 캐시값이 없을 때
    depsCache.push({ key, deps, result });
    return result;
  }
};

export const useCustomState = (initValue) => {
  return useState(initValue);
};

const textContextDefaultValue = {
  user: null,
  todoItems: [],
  count: 0,
};

export const TestContext = createContext({
  value: textContextDefaultValue,
  setValue: () => null,
});

export const TestContextProvider = ({ children }) => {
  const [value, setValue] = useState(textContextDefaultValue);

  return <TestContext.Provider value={{ value, setValue }}>{children}</TestContext.Provider>;
};

const useTestContext = () => {
  return useContext(TestContext);
};

export const useUser = () => {
  const { value, setValue } = useTestContext();

  return [value.user, (user) => setValue({ ...value, user })];
};

export const useCounter = () => {
  const { value, setValue } = useTestContext();

  return [value.count, (count) => setValue({ ...value, count })];
};

export const useTodoItems = () => {
  const { value, setValue } = useTestContext();

  return [value.todoItems, (todoItems) => setValue({ ...value, todoItems })];
};
