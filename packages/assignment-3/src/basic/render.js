export function jsx(type, props, ...children) {
  return { type, props, children: children };
}

// 가상돔을 실제 돔으로 변환
export function createElement(node) {
  // jsx를 dom으로 변환
  // type이 문자열이라면
  // 추가정보 : 처음엔 얜 무조건 통과 하고 저아래 forEach문에서 children 돌려서 string이면 createTextNode로 만들어줌
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  // node.type 태그로 element 생성 
  // ex) <div></div>
  const el = document.createElement(node.type);

  // node.props 가 null이 아니면 
  if (node.props) {
    for (const prop in node.props) {
      el.setAttribute(prop, node.props[prop]);
    }
  }
  // node.children을 반복하여 각 자식노드에 대해 createElement 함수 호출
  node.children.forEach(child => {
    el.appendChild(createElement(child));
  });

  return el;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  newProps = newProps || {};
  oldProps = oldProps || {};

  Object.entries(newProps).forEach(([prop, value]) => {
    if (oldProps[prop] !== value) {
      target.setAttribute(prop, value);
    }
  });

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  Object.keys(oldProps).forEach(prop => {
    if (!(prop in newProps)) {
      target.removeAttribute(prop);
    }
  });


}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    return parent.removeChild(parent.childNodes[index]);
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    return parent.appendChild(createElement(newNode));
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode === 'string' && typeof oldNode === 'string' && newNode !== oldNode) {
    return parent.childNodes[index].nodeValue = newNode;
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    return parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(parent.childNodes[index], newNode.props, oldNode.props);

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  // 하위 노드 추가, 삭제에 대한 로직
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const longerLength = Math.max(newChildren.length, oldChildren.length);


  for (let i = 0; i < longerLength; i++) {
    render(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
  }
}
