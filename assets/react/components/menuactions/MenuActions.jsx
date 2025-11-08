import React, { useContext } from 'react';
import './MenuActions.scss';
import useDriveStore from '../../stores/driveStore.js';
import { DriveContext } from '../../pages/Drive/Drive.jsx';

const MenuActions = () => {
  const { setDriveIndex, driveIndex, deleteDriveElement, drive } = useDriveStore();
  const { toggleForm, openDriveElement, openInNewTab } = useContext(DriveContext);

  const removeDriveElement = async () => {
    if (!window.confirm('Veux-tu vraiment supprimer cet élément ?')) {
      return;
    }
    await deleteDriveElement(driveIndex);
    document.body.click();
    setDriveIndex(null);
  };

  return (
    <>
      <div className="menu-actions">
        <div className="action" onClick={() => openDriveElement(driveIndex)}>
          <i className="bi bi-book"></i>
          <span>Ouvrir</span>
        </div>
        {driveIndex && !drive[driveIndex]['fullName'].endsWith('/') && (
          <div className="action" onClick={() => openInNewTab(driveIndex)}>
            <i className="bi bi-sign-turn-right"></i>
            <span>Nouvel onglet</span>
          </div>
        )}
        <div className="action">
          <i className="bi bi-download"></i>
          <span>Télécharger</span>
        </div>
        <div
          className="action"
          onClick={() => {
            toggleForm(1);
            document.body.click();
          }}>
          <i className="bi bi-pencil"></i>
          <span>Renommer</span>
        </div>
        <div className="action">
          <i className="bi bi-folder-symlink"></i>
          <span>Déplacer</span>
        </div>
        <div className="action">
          <i className="bi bi-share"></i>
          <span>Partager</span>
        </div>
        <div className="action" onClick={() => removeDriveElement()}>
          <i className="bi bi-trash"></i>
          <span>Supprimer</span>
        </div>
      </div>
    </>
  );
};
export default MenuActions;
