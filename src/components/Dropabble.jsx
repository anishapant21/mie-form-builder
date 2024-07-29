import { useDroppable } from "@dnd-kit/core";

const Droppable = ({ id, className, visible, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${visible || isOver ? "visible" : "hidden"}`}
    >
      {children}
    </div>
  );
};

export default Droppable;
