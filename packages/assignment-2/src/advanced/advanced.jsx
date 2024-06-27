import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { deepEquals } from '../basic/basic';

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
  const [state, setState] = useState(initValue);
  const setCustomState = (newValue) => {
    if (deepEquals(state, newValue)) {
      return;
    }
    setState(newValue);
  };
  return [state, setCustomState];
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

//context provider는 컴포넌트에 데이터를 전달하는 방법을 제공. 상태 저장 및 관리, 상태 전달, 상태 업데이트 등을 할 수 있게 해준다.
export const TestContextProvider = ({ children }) => {
  const valueRef = useRef(textContextDefaultValue);

  const setValue = (key, newValue) => {
    valueRef.current = { ...valueRef.current, [key]: newValue };
  };

  return <TestContext.Provider value={{ value: valueRef.current, setValue }}>{children}</TestContext.Provider>;
};

//useContext는 context의 값을 읽어올 때 사용하는 hook으로 context 값을 구독, 사용, 리랜더링 트리거의 역할을 한다.
const useTestContext = (key) => {
  const { value, setValue } = useContext(TestContext);
  const [state, setState] = useState(value[key]);

  useEffect(() => {
    setValue(key, state);
  }, [state]);

  return [state, setState];
};

export const useUser = () => {
  return useTestContext('user');
};

export const useCounter = () => {
  return useTestContext('count');
};

export const useTodoItems = () => {
  return useTestContext('todoItems');
};
