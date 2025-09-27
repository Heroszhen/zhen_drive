import React, { useRef, useEffect } from 'react';
import { IMAGE_EXTENSIONS } from '../../services/data';

const ReaderModal = (props) => {
  const modalBtn = useRef(null);
  const modalBtnClose = useRef(null);

  useEffect(() => {
    modalBtn.current?.click();
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#readerModal"
        ref={modalBtn}></button>
      <div
        className="modal fade"
        id="readerModal"
        tabIndex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="readerModalLabel"
        aria-hidden="true">
        <div className="modal-dialog d-none">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalBtnClose}></button>
            </div>
          </div>
        </div>

        <div className="modal-nav top-0 start-0 position-fixed w-100 p-1 ps-3 text-white">
          <i
            className="bi bi-x-lg text-[20px] cursor-pointer"
            onClick={() => {
              props.setShowReaderModal(false);
              modalBtnClose.current.click();
            }}></i>
        </div>
        {props.driveFile && (
          <div className="w-[800px] mx-auto mt-[38px] mw-100 h-[calc(100%-38px)] p-1 overflow-y-auto">
            {props.driveFile.extension === 'pdf' && (
              <iframe src={props.driveFile.url} className="w-100 h-[99%]"></iframe>
            )}
            {IMAGE_EXTENSIONS.includes(props.driveFile.extension) && (
              <img src={props.driveFile.url} className="w-100 h-auto" />
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default ReaderModal;
