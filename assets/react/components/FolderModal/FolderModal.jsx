import React, { useRef, useEffect, useState } from 'react';
import useDriveStore from '../../stores/driveStore.js';

const FolderModal = (props) => {
  const [paths, setPaths] = useState(null);
  const modalBtn = useRef(null);
  const modalClosedBtn = useRef(null);
  const { rootDir, paths: pathsInStore, drive, driveIndex, getFolderFolders, changeDriveElementName } = useDriveStore();
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    modalBtn.current.click();
    setPaths(pathsInStore);
  }, []);

  useEffect(() => {
    getFolders();
  }, [paths]);

  const getFolders = async () => {
    if (null === paths) return;
    const folderPath = rootDir + '/' + paths.join('/') + (paths.length > 0 ? '/' : '');
    setFolders(await getFolderFolders(folderPath));
  };

  const handlePaths = (index) => {
    if (index === -1) {
      setPaths((prev) => prev.slice(0, -1));
    } else {
      setPaths([...paths, folders[index]['name']]);
    }
  };

  const moveDriveElement = async (targetElmIndex) => {
    await changeDriveElementName(
      driveIndex,
      drive[driveIndex]['fullName'],
      `${folders[targetElmIndex]['fullName']}${drive[driveIndex]['name']}${drive[driveIndex]['fullName'].endsWith('/') ? '/' : ''}`,
      true
    );

    modalClosedBtn.current.click();
  };

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
              <h1 className="modal-title fs-5" id="staticFolderModalLabel">
                {null !== driveIndex && drive[driveIndex]?.name}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalClosedBtn}
                onClick={() => props.setShowFolderModal(false)}></button>
            </div>
            <div className="modal-body max-h-[500px] overflow-auto">
              <ul className="list-group">
                {folders.map((folder, index) => (
                  <li className="list-group-item hover:bg-[#0b5ed7] hover:text-white" key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div
                        className="cursor-pointer hover:bg-[#c2e7ff] pl-2 pr-2 rounded"
                        onClick={() => moveDriveElement(index)}>
                        {folder.name}
                      </div>
                      <div
                        className="cursor-pointer text-[25px] hover:bg-black pl-2 pr-2 rounded"
                        onClick={() => handlePaths(index)}>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              {paths && paths.length > 0 && (
                <button type="button" className="btn btn-dark" onClick={() => handlePaths(-1)}>
                  <i className="bi bi-arrow-left"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FolderModal;
