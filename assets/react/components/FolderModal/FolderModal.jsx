import React, { useRef, useEffect, useState } from 'react';
import useDriveStore from '../../stores/driveStore.js';

const FolderModal = (props) => {
  const [paths, setPaths] = useState([]);
  const modalBtn = useRef(null);
  const { getFolder, getFolderPath, rootDir, paths: pathsInStore, drive, driveIndex } = useDriveStore();

  useEffect(() => {
    modalBtn.current.click();
    setPaths(pathsInStore);console.log(rootDir,pathsInStore)
  }, []);

  return (
    <>
      <button type="button" data-bs-toggle="modal" data-bs-target="#staticFolderModal" ref={modalBtn}></button>
      <div
        className="modal fade"
        id="staticFolderModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticFolderModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticFolderModalLabel">{drive[driveIndex].name}</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div className="modal-body max-h-[500px] overflow-auto" ></div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FolderModal;
