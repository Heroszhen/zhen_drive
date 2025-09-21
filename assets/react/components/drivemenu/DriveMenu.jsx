import './DriveMenu.scss';
import { logout } from '../../services/util';

const DriveMenu = (props) => {
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
                                <li className="list-group-item" onClick={()=>props.toggleForm(2)}>
                                    <i className="bi bi-folder-plus"></i>
                                    Nouveau dossier
                                </li>
                                <li className="list-group-item">
                                    <i className="bi bi-folder-symlink"></i>
                                    Importer un dossier
                                </li>
                                <li className="list-group-item">
                                    <i className="bi bi-file-earmark-arrow-up"></i>
                                    Importer un fichier
                                </li>
                                <li className="list-group-item" onClick={()=>logout()}>
                                    <i className="bi bi-door-closed"></i>
                                    Déconnexion
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