import React, { useEffect, useState, useContext } from 'react';
import { MessageModalContext } from '../../../App.jsx';
import useDriveStore from '../../../stores/driveStore.js';

const TXTEditor = (props) => {
  const { driveIndex, drive, getFileUrl, modifyFile } = useDriveStore();
  const [fileContent, setFileContent] = useState(null);
  const { toast } = useContext(MessageModalContext);

  useEffect(() => {
    if (driveIndex !== null) {
      getFileContent();
    }
  }, []);

  const getFileContent = async () => {
    try {
      const elm = await getFileUrl(driveIndex);
      const response = await fetch(elm.url);
      const text = await response.text();
      setFileContent(text);
    } catch {}
  };

  const save = async () => {
    const result = await modifyFile(drive[driveIndex]['fullName'], fileContent);
    if (result) {
      toast.success('Enregistré', {
        autoClose: 1000,
        theme: 'light',
      });
    }
  };

  const countWords = () => {
    if (fileContent === null) return 0;
    return fileContent.replace(/[\s。，"()：？.]/g, '').length;
  };

  return (
    <>
      <section
        id="editor-txt"
        className="position-fixed z-5 top-0 start-0 w-100 h-100 bg-white overflow-hidden p-1 z-500">
        <div className="d-flex justify-content-between">
          <i className="bi bi-floppy-fill cursor-pointer" onClick={() => save()}></i>
          {countWords()} caractères
          <i className="bi bi-x-lg mr-3 cursor-pointer" onClick={() => props.setOpenEditor(false)}></i>
        </div>
        {fileContent !== null && (
          <textarea
            className="w-100 h-[calc(100%-30px)]"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          />
        )}
      </section>
    </>
  );
};
export default TXTEditor;
