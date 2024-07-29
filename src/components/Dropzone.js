// Dropzone.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
// import './Dropzone.css'; // Add your styling for the dropzone

const Dropzone = ({ id, onDrop }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="dropzone"
      onDrop={onDrop}
    >
      Drop here
    </div>
  );
};

export default Dropzone;
