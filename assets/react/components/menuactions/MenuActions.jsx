import React, { useState, useEffect } from 'react';
import './MenuActions.scss';
import useDriveStore from '../../stores/driveStore';

const MenuActions = () => {
    const {drive, setDriveIndex, driveIndex, deleteDriveElement, addPath} = useDriveStore();

    const removeDriveElement = async () => {
        if (!window.confirm('Veux-tu vraiment supprimer cet élément ?')) {
            return;
        }
        await deleteDriveElement(driveIndex);
        document.body.click();
        setDriveIndex(null);
    }

    return (
        <>
            <div className="menu-actions">
                <div className='action' onClick={()=>addPath(driveIndex)}>
                    <i className="bi bi-book"></i>
                    <span>Ouvrir</span>
                </div>
                <div className='action'>
                    <i className="bi bi-download"></i>
                    <span>Télécharger</span>
                </div>
                <div className='action'>
                    <i className="bi bi-pencil"></i>
                    <span>Renommer</span>
                </div>
                <div className='action' onClick={()=>removeDriveElement()}>
                    <i className="bi bi-trash"></i>
                    <span>Supprimer</span>
                </div>
            </div>
            
        </>
    );
};
export default MenuActions;