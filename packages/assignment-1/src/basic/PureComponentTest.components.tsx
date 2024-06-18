import { repeatBarked, repeatMeow } from './UseMemoTest.utils.ts';
import { memo } from 'react';

type TCryingProps = {
  crying: number;
};

export const Dog = memo(({ crying }: TCryingProps) => {
  return <p data-testid='dog'>강아지 "{repeatBarked(crying)}"</p>;
});

export const Cat = memo(({ crying }: TCryingProps) => {
  return <p data-testid='cat'>고양이 "{repeatMeow(crying)}"</p>;
});
