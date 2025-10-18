import React, { useRef, useEffect, useState, useContext } from 'react';
import './DriveMenu.scss';
import { logout } from '../../services/util.js';
import useDriveStore from '../../stores/driveStore.js';
import useUserStore from '../../stores/userStore.js';
import { MessageModalContext } from '../../App.jsx';
import { getMaxFileSize } from '../../services/data.js';

const DriveMenu = (props) => {
  const dirInputRef = useRef(null);
  const filesInputRef = useRef(null);
  const { uploadFolderOrFiles, getBucketInfo, getFolder, setDriveIndex } = useDriveStore();
  const { user } = useUserStore();
  const [driveInfo, setDriveInfo] = useState(null);
  const [bucketInfo, setBucketInfo] = useState(null);
  const { setModalConfig } = useContext(MessageModalContext);

  useEffect(() => {
    if (user === null) return;

    (async () => {
      setDriveInfo(await getBucketInfo(`${process.env.APP_ENV}/${user.name}/`));
      if (user.roles.includes('ROLE_ADMIN')) setBucketInfo(await getBucketInfo(`/`));
    })();
  }, [user]);

  const uploadFiles = async (e, isFolder = false) => {
    if (e.target.files.length === 0) return;

    const files = [];
    let errorMsg = '';
    for (let index = 0; index < e.target.files.length; index++) {
      const file = e.target.files.item(index);
      if (file.size > getMaxFileSize()) errorMsg += `${file.name}(${file.size} bytes) trop gros <br />`;
      files.push(file);
    }

    if (errorMsg !== '') setModalConfig({ type: 'danger', message: errorMsg });
    else await uploadFolderOrFiles(files, isFolder);
  };

  const refresh = async () => {
    setDriveIndex(null);
    await getFolder();
  };

  return (
    <>
      <div className="accordion mb-2" id="accordion-drive-menu">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne">
              <img src="/static/icons8-google-drive-512.png" className="w-[20px]" alt="" />
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordion-drive-menu">
            <div className="accordion-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <span>
                    <i className="bi bi-person-circle"></i>
                    Profil
                  </span>
                </li>
                <li className="list-group-item">
                  <span onClick={() => props.toggleForm(2)}>
                    <i className="bi bi-folder-plus"></i>
                    Nouveau dossier
                  </span>
                </li>
                <li className="list-group-item">
                  <span onClick={() => dirInputRef.current?.click()}>
                    <i className="bi bi-folder-symlink"></i>
                    Importer un dossier
                  </span>
                  <div className="d-none">
                    <input
                      type="file"
                      id="folderInput"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      ref={dirInputRef}
                      onChange={(e) => uploadFiles(e, true)}
                    />
                  </div>
                </li>
                <li className="list-group-item">
                  <span onClick={() => filesInputRef.current?.click()}>
                    <i className="bi bi-file-earmark-arrow-up"></i>
                    Importer fichiers
                  </span>
                  <div className="d-none">
                    <input type="file" id="multiFileInput" multiple ref={filesInputRef} onChange={uploadFiles} />
                  </div>
                </li>
                <li className="list-group-item">
                  <span onClick={() => refresh()}>
                    <i className="bi bi-app"></i>
                    Actualiser
                  </span>
                </li>
                {user?.roles.includes('ROLE_ADMIN') && (
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-telephone-inbound"></i>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switchContact"
                        onChange={(e) => props.setSseUrl(e.target.checked ? '/api/sse/event' : null)}
                      />
                      <label className="form-check-label" htmlFor="switchContact">
                        Contact
                      </label>
                    </div>
                  </li>
                )}
                <li className="list-group-item">
                  <span onClick={() => logout()}>
                    <i className="bi bi-door-closed"></i>
                    Déconnexion
                  </span>
                </li>
                <li className="list-group-item">
                  <span>
                    <i className="bi bi-cloud-arrow-down"></i>
                    Installer
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {driveInfo !== null && (
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo">
                Mon Drive : {driveInfo.size} Mo
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordion-drive-menu">
              <div className="accordion-body">
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-success">
                    <i className="bi bi-folder2-open"></i>
                  </div>
                  <div className="wrap-type">{driveInfo.nbFolders} dossiers</div>
                  <div className="wrap-size"></div>
                </li>
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-primary">
                    <i className="bi bi-file-earmark"></i>
                  </div>
                  <div className="wrap-type">{driveInfo.nbFiles} fichiers</div>
                  <div className="wrap-size"></div>
                </li>
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-danger">
                    <i className="bi bi-file-earmark-pdf"></i>
                  </div>
                  <div className="wrap-type">{driveInfo.nbPDFs} PDF</div>
                  <div className="wrap-size"></div>
                </li>
              </div>
            </div>
          </div>
        )}
        {bucketInfo !== null && (
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThress"
                aria-expanded="false"
                aria-controls="collapseThress">
                Mon compartiment : {bucketInfo.size} Mo
              </button>
            </h2>
            <div id="collapseThress" className="accordion-collapse collapse" data-bs-parent="#accordion-drive-menu">
              <div className="accordion-body">
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-success">
                    <i className="bi bi-folder2-open"></i>
                  </div>
                  <div className="wrap-type">{bucketInfo.nbFolders} dossiers</div>
                  <div className="wrap-size"></div>
                </li>
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-primary">
                    <i className="bi bi-file-earmark"></i>
                  </div>
                  <div className="wrap-type">{bucketInfo.nbFiles} fichiers</div>
                  <div className="wrap-size"></div>
                </li>
                <li className="list-group-item drive-info">
                  <div className="wrap-icon text-danger">
                    <i className="bi bi-file-earmark-pdf"></i>
                  </div>
                  <div className="wrap-type">{bucketInfo.nbPDFs} PDF</div>
                  <div className="wrap-size"></div>
                </li>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default DriveMenu;
