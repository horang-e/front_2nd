import { createHooks } from "./hooks";
import { render as updateElement } from "./render";

function MyReact() {
  let rootElement = null;
  let rootComponent = null;

  const _render = () => {
    resetHookContext();
    if (rootElement && rootComponent) {
      const newVdom = rootComponent();
      updateElement(rootElement, newVdom, rootElement.firstChild);
    }
  };

  function render($root, component) {
    rootElement = $root;
    rootComponent = component;
    _render();
  }

  const { useState, useMemo, resetContext: resetHookContext } = createHooks(_render);

  return { render, useState, useMemo };
}

export default MyReact();


/**
 * useState로 값이 변경 되었을때 일어나는 랜더링의 순서
 */
// 1. useState를 통해 state를 생성하고 초기값을 설정한다.
// 2. setState를 통해 state값을 변경하고 변경됨에 따라 callback을 실행한다.
// 3. callback 즉 _render을 실행하여 stateIndex와 memoIndex 초기화를 실행한다.
// 4. rootComponent() 함수를 실행하여 새로운 가상 DOM(newVdom)을 생성한다. 이 때 createHooks가 다시 호출되어 useState와 useMemo를 초기화한다.
// 5. updateElement(rootElement, newVdom, rootElement.firstChild)를 통해 이전의 DOM과 새로운 DOM을 비교한다.
// 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복 <- 조건을 통해 각 자식노드에 대해 재귀적으로 render 함수를 호출한다.
// 7. 변경된 부분만 업데이트 된 실제 DOM을 반환한다.