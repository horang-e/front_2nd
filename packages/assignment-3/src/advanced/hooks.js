export function createHooks(callback) {
  let states = [];
  let stateIndex = 0;
  let memoCache = [];
  let memoIndex = 0;

  // setState가 여러번 호출될때 가장 마지막에 들어온 setState만 실행되게 하기 위한 스택
  let batchStack = [];

  // setState가 여러번 호출될때 가장 마지막에 들어온 setState만 실행되게 하기 위한 플래그
  let isUpdateScheduled = false;

  const useState = (initState) => {

    const currentIndex = stateIndex;

    if (states[currentIndex] === undefined) {
      states[currentIndex] = initState;
    }

    const setState = (newState) => {
      // batchStack에 현재 useState에 대한 인덱스와 새로운 스테이트값을 넣어준다.
      batchStack.push({ index: currentIndex, state: newState });

      // 1frame 후에 processUpdates를 실행한다.
      // 해당 로직은 한번만 실행되어야 하기 때문에 isUpdateScheduled를 사용한다.
      // 첫 호출시 사용되어 isUpdateScheduled를 true로 변경하고 setTimeout 로직 또한 첫 호출시에 실행된다.
      // 결과적으로는 총 한번만 실행된다. (맨처음)
      if (!isUpdateScheduled) {
        isUpdateScheduled = true;
        // 우선순위가 제일 낮아서 setTimeout 보다는 requestAnimationFrame을 사용하는게 좋다.
        setTimeout(processUpdates, 16.67);
      }
    };

    stateIndex++;

    return [states[currentIndex], setState];
  };

  const processUpdates = () => {

    // 각 인덱스 별로 마지막 스테이트 값을 저장할 객체 배열
    let updates = [];

    // 에러처리
    if (batchStack.length === 0) {
      isUpdateScheduled = false;
      return;
    }

    // 인덱스 당 스택 마지막 요소를 가져온다.
    for (let i = 0; i < stateIndex; i++) {
      updates.push(batchStack.filter(stack => stack.index === i).pop());
    }

    // updates 배열을 순회하면서 각 인덱스에 대한 스테이트값을 변경한다.
    // 스테이트값이 기존 state 값과 다르게 들어올 때만 실제로 state를 변경해준다.
    updates.forEach(update => {
      if (states[update.index] !== update.state) {
        states[update.index] = update.state;
      }
    });

    callback();


    // 스택 제거
    batchStack = [];

    // 다시 processUpdates를 실행할 수 있도록 isUpdateScheduled를 false로 변경한다.
    isUpdateScheduled = false;

  };

  const useMemo = (fn, refs) => {

    const curIndex = memoIndex;

    if (memoCache[curIndex] === undefined) {
      memoCache[curIndex] = { memoData: fn(), refs };
      memoIndex++;
    } else {
      if (refs !== undefined) {
        if (refs.length !== memoCache[curIndex].refs.length) {
          memoCache[curIndex] = { memoData: fn(), refs };
        } else {

          if (refs.some((ref, index) => ref !== memoCache[curIndex].refs[index])) {
            memoCache[curIndex] = { memoData: fn(), refs };
          }
        }
      }
    }

    return memoCache[curIndex].memoData;
  };

  const resetContext = () => {
    stateIndex = 0;
    memoIndex = 0;
  }

  return { useState, useMemo, resetContext };
}


//** 의식의 흐름 */
// Batching
// state는 변경되었을때 바로 랜더링이 되는것이 아닌 어떤 이벤트(ex. onClick)가 발생했을 때에 랜더링이된다.
// 하나의 이벤트 내에서 여러번의 setState가 발생했을때 이것들을 한번에 처리하는 것을 Batching이라고 한다.
// 이것을 구현하기 위해서는 어떻게 해야할까?
// setState 가 여러번 발생 했을때 해당 이벤트를 어디에 모아 뒀다가 가장 마지막에 들어오는 애만 1frame 후에 실행되게 해야한다. 그럼 이건 후입선출 이니까 stack을 사용한다. stack에 넣어두고 1frame 후에 stack에서 pop을 해서 실행하면 된다.
// 근데 그러면 이 과정들이 1frame 안에 일어났으며 한개의 스테이트값에 대한 변경만 발생했음을 알아야한다.
// 그러면 해당 스테이트값에 대한 인덱스를 키로 가지면서 밸류값으로 스택을 가지고 있어야하지..? 그리고 처음 딱 이벤트가 발생하는 시점에 setTimeout을 걸어두고 1frame 후에 실행되게 해야한다.

//* Batch 추가 공부*/
// test code 가 setA("test5") 가 아닌 setA("foo") 였다면 랜더링은 일어나지 않는다. batch를 통해서 1frame 중 가장 마지막 newState에 대한 변경만 일어나기 때문에 이전 값과 같다고 인식해서 랜더링이 일어나지 않는다.0o0!!