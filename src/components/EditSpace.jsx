import { useContext, useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import '../components_css/editSpace.css';
import { trashCan_Icon, x_icon } from "../custom-Tools/SVGIcons";
import { SvgImg } from "../custom-Tools/utilsFunction";
import { EditorContext } from "./EditorContext";
import CustomToolBar from "./CustomToolBar";

const EditSpace = ({ isOverDropzone }) => {
  const { editorInstanceRef, initEditor } = useContext(EditorContext);
  const [dropzoneClass, setDropzoneClass] = useState("dropzone")
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);

  const { setNodeRef } = useDroppable({
    id: 'dropzone',
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

  useEffect(() => {
    const updateDropzones = () => {
      const editorBlocks = document.querySelectorAll('.ce-block');
      editorBlocks.forEach((block, index) => {
        let dropzone = document.getElementById(`dropzone-${index}`);
        if (!dropzone) {
          dropzone = document.createElement('div');
          dropzone.id = `dropzone-${index}`;
          dropzone.className = dropzoneClass;
          dropzone.setAttribute('ref', setNodeRef)
          
          block.insertAdjacentElement('afterend', dropzone);
        }
      });
    };

    const observer = new MutationObserver(updateDropzones);
    observer.observe(document.getElementById('editorjs'), { childList: true, subtree: true });

    updateDropzones();

    return () => observer.disconnect();
  }, [dropzoneClass]);

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
          <div ref={setNodeRef} className={dropzoneClass}>
            Drop and drop here to add a new element
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSpace;
