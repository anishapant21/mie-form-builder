


import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from 'react-dom';
import { useDroppable } from "@dnd-kit/core";
import '../components_css/editSpace.css';
import { trashCan_Icon, x_icon } from "../custom-Tools/SVGIcons";
import { SvgImg } from "../custom-Tools/utilsFunction";
import { EditorContext } from "./EditorContext";
import CustomToolBar from "./CustomToolBar";

const DynamicDropzone = ({ className, index }) => {
  const { setNodeRef } = useDroppable({
    id: `dropzone-${index}`,
  });

  return (
    <div ref={setNodeRef} className={className}>
      Drop and drop here to add a new element
    </div>
  );
};

const useDropzones = (dropzoneClass) => {
  const [dropzones, setDropzones] = useState([]);

  useEffect(() => {
    const updateDropzones = () => {
      const editorBlocks = document.querySelectorAll('.ce-block');
      editorBlocks.forEach((block, index) => {
        let dropzone = document.getElementById(`dropzone-${index}`);
        if (!dropzone) {
          dropzone = document.createElement('div');
          dropzone.id = `dropzone-${index}`;
          dropzone.className = dropzoneClass;
          block.insertAdjacentElement('afterend', dropzone);
        }
      });

      const currentDropzones = document.querySelectorAll('[id^="dropzone-"]');
      currentDropzones.forEach((dz) => {
        const index = parseInt(dz.id.split('-')[1]);
        if (index >= editorBlocks.length) {
          dz.remove();
        }
      });

      setDropzones(Array.from(editorBlocks).map((_, index) => index));
    };

    const observer = new MutationObserver(updateDropzones);
    observer.observe(document.getElementById('editorjs'), { childList: true, subtree: true });
    updateDropzones();

    return () => {
      observer.disconnect();
    };
  }, [dropzoneClass]);

  return dropzones;
};

const EditSpace = ({ isOverDropzone }) => {
  const { editorInstanceRef, initEditor } = useContext(EditorContext);
  const [dropzoneClass, setDropzoneClass] = useState("dropzone");
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  
  // This is for the main dropzone at the end
  const { setNodeRef: setMainDropzoneRef } = useDroppable({
    id: 'main-dropzone',
  });

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  const clearPage = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.clear();
    }
  };

  useEffect(() => {
    setDropzoneClass(isOverDropzone ? "dropzone active" : "dropzone");
  }, [isOverDropzone]);

  // Use our custom hook
  const dropzones = useDropzones(dropzoneClass);

  // Create portals for dynamic dropzones
  const dropzonePortals = useMemo(() => 
    dropzones.map(index => {
      const dropzone = document.getElementById(`dropzone-${index}`);
      return dropzone ? createPortal(
        <DynamicDropzone 
          className={dropzoneClass} 
          index={index} 
        />,
        dropzone
      ) : null;
    }),
    [dropzones, dropzoneClass]
  );

  return (
    <div className='editorBody'>
      <div className='editorConfigPanel'>
        <button className='clearPageBtn customToolBar-button inlineSpace' onClick={clearPage}>
          <SvgImg icon={trashCan_Icon} text={'Clear Page'} /> <SvgImg icon={x_icon} />
        </button>
        <div className="padding"></div>
        <CustomToolBar />
      </div>
      <div className='editorWrapper'>
        <div id='editorContainer' ref={editorContainerRef}>
          <div id="editorjs"></div>
          {dropzonePortals}
          {/* Main dropzone at the end */}
          <div ref={setMainDropzoneRef} className={dropzoneClass}>
            Drop and drop here to add a new element
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSpace;
