import React, { useState, useEffect } from 'react';
import useDriveStore from '../../stores/driveStore';
import moment from 'moment';
import { getExtensionIcon, getDropDownMenuPosition } from '../../services/data';

import MenuActions from '../menuactions/MenuActions';

const DriveList = (props) => {
    const {drive, setDriveIndex, driveIndex, addPath} = useDriveStore();

    return (
        <>
            <section id="drive-list" className="list-files">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Taille</th>
                            <th scope="col">Modifié</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drive
                            .filter((elm) => elm.name.toLowerCase().includes(props.keywords.toLowerCase()))
                            .map((elm, index) => (
                                <tr 
                                    key={index} 
                                    className={`${driveIndex===index ? 'active' : ''}`} 
                                    onClick={(e) => setDriveIndex(index)}
                                    onDoubleClick={()=> addPath(index)}
                                >
                                    <th scope="row">
                                        <div className="d-flex align-items-center">
                                            <span className="me-2 text-[23px]">
                                                {getExtensionIcon(elm)}
                                            </span>
                                            {elm.name}
                                        </div>
                                    </th>
                                    <td>
                                        {elm.fullName.endsWith('/') ? '-' : elm.size}
                                    </td>
                                    <td>{moment(elm.updated).format('DD/MM/YYYY')}</td>
                                    <td>
                                        <div className="dropdown">
                                            <div data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-three-dots"></i>
                                            </div>
                                            <div className="dropdown-menu p-1" style={getDropDownMenuPosition()} onClick={(e)=>e.stopPropagation()}>
                                                {driveIndex===index &&
                                                    <MenuActions />                
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
}
export default DriveList;