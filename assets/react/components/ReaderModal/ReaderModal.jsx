import React, { useRef, useEffect } from 'react';
import { IMAGE_EXTENSIONS } from '../../services/data.js';

import './ReaderModal.scss';

const ReaderModal = (props) => {
  const modalBtn = useRef(null);
  const modalBtnClose = useRef(null);
  const ZHEN_FRONT_SERVICE_FILE_VIEW = process.env.ZHEN_FRONT_SERVICE + '/file-view';
  const iframeRef = useRef(null);

  useEffect(() => {
    modalBtn.current?.click();
  }, []);

  useEffect(() => {
    if (props.driveFile !== null && iframeRef.current !== null) {
      iframeRef.current.addEventListener('load', loadIframe);
    }

    return () => {
      iframeRef.current?.removeEventListener('load', loadIframe);
    }
  }, [props.driveFile, iframeRef.current]);

  const loadIframe = () => {
    const extension = IMAGE_EXTENSIONS.includes(props.driveFile.extension) ? 'image' : props.driveFile.extension;
    iframeRef.current.contentWindow.postMessage(
      { type: 'READY', payload: { url: props.driveFile.url, extension: extension } },
      ZHEN_FRONT_SERVICE_FILE_VIEW
    );
  }

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
            {/* {props.driveFile.extension === 'pdf' && (
              <iframe src={props.driveFile.url} className="w-100 h-[99%]" title="pdf"></iframe>
            )}
            {IMAGE_EXTENSIONS.includes(props.driveFile.extension) && (
              <img src={props.driveFile.url} className="w-100 h-auto" alt="" />
            )}
            {props.driveFile.extension === 'mp3' && (
              <section className="file-wrap">
                <audio controls src={props.driveFile.url}></audio>
              </section>
            )}
            {props.driveFile.extension === 'mp4' && (
              <section className="file-wrap">
                <video className="bg-dark" controls>
                  <source src={props.driveFile.url} type="video/mp4" />
                </video>
              </section>
            )} */}
            <iframe
              src={ZHEN_FRONT_SERVICE_FILE_VIEW}
              className="w-100 h-[99%]"
              title={props.driveFile.name}
              ref={iframeRef}></iframe>
          </div>
        )}
      </div>
    </>
  );
};
export default ReaderModal;
