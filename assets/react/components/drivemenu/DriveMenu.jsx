import React, { useRef } from 'react';
import './DriveMenu.scss';
import { logout } from '../../services/util';
import useDriveStore from '../../stores/driveStore';

const DriveMenu = (props) => {
    const dirInputRef = useRef(null);
    const filesInputRef = useRef(null);
    const {uploadFolderOrFiles} = useDriveStore();

    const uploadFiles = async (e, isFolder = false) => {
        if (e.target.files.length === 0)return;
        await uploadFolderOrFiles(e.target.files, isFolder);
    }

    return (
        <>
            <div className="accordion mb-2" id="accordion-drive-menu">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Mon Drive
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordion-drive-menu">
                        <div className="accordion-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <i className="bi bi-person-circle"></i>
                                    Profil
                                </li>
                                <li className="list-group-item">
                                    <span onClick={()=>props.toggleForm(2)}>
                                        <i className="bi bi-folder-plus"></i>
                                        Nouveau dossier
                                    </span>
                                </li>
                                <li className="list-group-item">
                                    <span onClick={()=>dirInputRef.current?.click()}>
                                        <i className="bi bi-folder-symlink"></i>
                                        Importer un dossier
                                    </span>
                                    <div className="d-none">
                                        <input type="file" id="folderInput" webkitdirectory="true" directory="true" multiple ref={dirInputRef} onChange={(e) => uploadFiles(e, true)} />
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <span onClick={()=>filesInputRef.current?.click()}>
                                        <i className="bi bi-file-earmark-arrow-up"></i>
                                        Importer fichiers
                                    </span>
                                    <div className="d-none">
                                        <input type="file" id="multiFileInput" multiple ref={filesInputRef} onChange={uploadFiles} />
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <span onClick={()=>logout()}>
                                        <i className="bi bi-door-closed"></i>
                                        Déconnexion
                                    </span>
                                </li>
                                <li className="list-group-item">
                                    <i className="bi bi-app"></i>
                                    Installer
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        45.5 GB 50 GB
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordion-drive-menu">
                        <div className="accordion-body">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default DriveMenu;