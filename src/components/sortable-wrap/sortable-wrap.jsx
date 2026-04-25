import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { moveIngredient } from '@services/burgerConstructor';

const SortableWrap = ({ id, index, children }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const [, dropRef] = useDrop({
    accept: 'burgerConstructorSortableItem',
    hover(item, monitor) {
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

  const [{ isDragging }, dragRef] = useDrag({
    item: { id, index },
    type: 'burgerConstructorSortableItem',
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
