import React, { useRef, useContext } from 'react';
import { getMaxFileSize } from '../../services/data.js';
import { MessageModalContext } from '../../App.jsx';
import { MESSAGE_TYPE_ERROR } from '../MessageModal/MessageModal.jsx';
import useDriveStore from '../../stores/driveStore.js';

const DraggableField = ({ children, activatedDraggableField }) => {
  const grayField = useRef(null);
  const { setModalConfig } = useContext(MessageModalContext);
  const { uploadFolderOrFiles } = useDriveStore();

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!activatedDraggableField) return;

    grayField.current.classList.remove('d-none');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (!activatedDraggableField) return;

    grayField.current.classList.add('d-none');

    let files = [];
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      const entry = e.dataTransfer.items[i].webkitGetAsEntry();
      if (entry.isFile) files.push(e.dataTransfer.files.item(i));
      else await readDirectory(entry, files);
    }

    const errors = [];
    files = files.filter((file) => {
      if ((!file) instanceof File || file.size > getMaxFileSize()) errors.push(file);
      return file instanceof File && file.size <= getMaxFileSize();
    });

    if (errors.length > 0) {
      let errorMsg = '';
      errors.forEach((file) => (errorMsg += `${file.fullPath} trop gros<br/>`));
      setModalConfig({ type: MESSAGE_TYPE_ERROR, message: errorMsg });
    } else {
      if (files.length > 0) uploadFolderOrFiles(files);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!activatedDraggableField) return;

    if (e.target == grayField.current) grayField.current.classList.add('d-none');
  };

  const readDirectory = async (directory, files) => {
    return new Promise((resolve) => {
      const reader = directory.createReader();
      reader.readEntries(
        async (entries) => {
          for (const entry of entries) {
            if (entry.isFile) {
              const file = await readFileEntry(entry);
              files.push(file);
            } else {
              const file = await readDirectory(entry, files);
              files.push(file);
            }
          }
          resolve(1);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  const readFileEntry = async (entry) => {
    return new Promise((resolve) => {
      entry.file((file) => {
        file['fullPath'] = entry.fullPath.startsWith('/') ? entry.fullPath.slice(1) : entry.fullPath;
        resolve(file);
      });
    });
  };

  return (
    <section
      className="draggable-zone relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}>
      {children}

      <div className="w-100 h-100 absolute z-[9999] top-0 start-0 bg-gray-500/50 d-none" ref={grayField}></div>
    </section>
  );
};
export default DraggableField;
