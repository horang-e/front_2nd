export function createHooks(callback) {
  // useState를 통해 생성된 state들을 전역적으로 저장하는 배열
  let states = [];

  // 컴포넌트에서 사용한 useState의 개수
  let stateIndex = 0;

  // useMemo를 통해 생성된 값을 전역적으로 저장하는 배열
  let memoCache = [];

  // useMemo를 통해 생성된 값을 사용하는 컴포넌트의 개수
  let memoIndex = 0;

  const useState = (initState) => {
    // stateIndex에 해당하는 state가 없을 경우 초기값으로 초기화
    if (states[stateIndex] === undefined) {
      states[stateIndex] = initState;
    }

    // stateIndex를 curIndex에 할당하여 클로저로 사용 추가로 이후에 값이 증가하기 때문에 stateIndex를 직접 사용하면 안된다.(별표)
    const curIndex = stateIndex;

    // setState 함수를 통해 state를 변경할 수 있도록 함
    const setState = (newState) => {

      // state가 변경되었을 경우에만 callback을 실행
      if (states[curIndex] !== newState) {
        states[curIndex] = newState;
        callback();
      }
    };

    // stateIndex를 증가시켜 다음 useState를 위한 index로 사용
    stateIndex++;

    return [states[curIndex], setState];
  };

  const useMemo = (fn, refs) => {

    // memoIndex를 curIndex에 할당하여 클로저로 사용 추가로 이후에 값이 증가하기 때문에 memoIndex를 직접 사용하면 안된다(별표).
    const curIndex = memoIndex;


    // memoIndex에 해당하는 값이 없을 경우 fn을 통해 값을 생성하고 memoCache에 ref배열과 함께 저장
    if (memoCache[curIndex] === undefined) {
      memoCache[curIndex] = { memoData: fn(), refs };

      // memoIndex를 증가시켜 다음 useMemo를 위한 index로 사용
      memoIndex++;


    } else {

      // ref가 존재할 경우 ref의 길이가 다를 경우 또는 ref의 값이 다를 경우에만 fn을 통해 값을 생성하고 memoCache에 ref배열과 함께 저장
      if (refs !== undefined) {
        if (refs.length !== memoCache[curIndex].refs.length) {
          memoCache[curIndex] = { memoData: fn(), refs };
        } else {

          // ref배열의 길이가 같을 때 ref값을 비교하여 값이 다를 경우에만 fn을 통해 값을 변경하고 memoCache에 ref배열과 함께 저장
          if (refs.some((ref, index) => ref !== memoCache[curIndex].refs[index])) {
            memoCache[curIndex] = { memoData: fn(), refs };
          }
        }
      }
    }

    return memoCache[curIndex].memoData;
  };

  // 전역적으로 사용되는 state와 memo를 초기화
  // 매 랜더링마다 훅들이 처음부터 순서대로 실행되어야 하기 때문에 초기화가 필요하다.
  // states 와 memoCache는 초기화 하지 않으면서 새로운 랜더링에서 올바른 순서로 mounting 된다.
  const resetContext = () => {
    stateIndex = 0;
    memoIndex = 0;
  }

  return { useState, useMemo, resetContext };
}
