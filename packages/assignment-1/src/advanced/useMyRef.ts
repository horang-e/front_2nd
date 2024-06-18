import { useState } from 'react';

export function useMyRef<T>(initValue: T | null) {
  // ref를 저장할 state를 생성. { current: initValue}객체를 통해 current값이 변경되더라도 리랜더링 되지 않게 함
  const [ref, setRef] = useState<{ current: T | null }>(() => ({ current: initValue }));

  // setRef를 통해 ref의 값을 변경.
  const setRefValue = (value: T | null) => {
    setRef({ current: value });
  };

  return [ref, setRefValue];
}
