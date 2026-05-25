import { useRef, type JSX } from 'react';
import { useDrag, useDrop, type DropTargetMonitor } from 'react-dnd';

import { moveIngredient } from '@services/burgerConstructor';
import { useAppDispatch } from '@services/hooks';

type TSortableWrapProps = {
  id: string;
  index: number;
  children: React.ReactNode;
};

const SortableWrap = ({ id, index, children }: TSortableWrapProps): JSX.Element => {
  const ref = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const [, dropRef] = useDrop<
    { index: number },
    unknown,
    { draggedItem: { index: number } | null }
  >({
    accept: 'burgerConstructorSortableItem',
    hover(item, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      dispatch(moveIngredient({ toIndex: hoverIndex, fromIndex: dragIndex }));
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef] = useDrag<
    { id: string; index: number },
    unknown,
    { isDragging: boolean }
  >({
    type: 'burgerConstructorSortableItem',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  dragRef(dropRef(ref));
  return (
    <div style={{ opacity }} ref={ref}>
      {children}
    </div>
  );
};

export default SortableWrap;
