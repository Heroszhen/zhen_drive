import React, { useEffect, useRef } from 'react';
import parse from 'html-react-parser';

export const MESSAGE_TYPE_SUCCESS = 'info';
export const MESSAGE_TYPE_ERROR = 'danger';

const MessageModal = (props) => {
  const modalBtn = useRef(null);

  useEffect(() => {
    if (props.message) {
      modalBtn.current?.click();
    }
  }, [props]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#messageModal"
        ref={modalBtn}></button>
      <div
        className="modal fade"
        id="messageModal"
        tabIndex="-1"
        aria-labelledby="messageModalLabel"
        aria-hidden="true"
        onClick={() => props.setModalConfig({ type: null, message: null })}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {props.type && props.message && (
              <div className={`modal-body text-break text-${props.type}`}>{parse(props.message)}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MessageModal;
