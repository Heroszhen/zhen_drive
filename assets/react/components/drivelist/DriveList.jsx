import React, { useState, useEffect } from 'react';
import useDriveStore from '../../stores/driveStore';
import moment from 'moment';
import { getExtensionIcon, getDropDownMenuPosition } from '../../services/data';

import MenuActions from '../Menuactions/MenuActions';
import './DriveList.scss';

const DriveList = (props) => {
  const { drive, setDriveIndex, driveIndex, addPath } = useDriveStore();
  const [movedElm, setMovedElm] = useState(null);
  const [targetElm, setTargetElm] = useState(null);

  const openDriveElement = (index) => {
    if (drive[index].fullName.endsWith('/')) addPath(index);
    else props.viewFile(index);
  };

  const handleDragStart = (e) => {
    props.setActivatedDraggableField(false);
    e.stopPropagation();

    setMovedElm(e.target);
  };

  const handleDragEnd = (e) => {
    props.setActivatedDraggableField(true);
    setMovedElm(null);
    targetElm?.classList.remove('drag-enter');
    setTargetElm(null);
  };

  const handleDragEnter = (e) => {
    if (props.activatedDraggableField) return;
    e.preventDefault();

    const newTargetElm = e.target.closest('.drive-elm');
    if (!newTargetElm.classList.contains('drive-folder')) {
      targetElm?.classList.remove('drag-enter');
      setTargetElm(null);
      return;
    }

    if (newTargetElm === targetElm) return;
    newTargetElm.classList.add('drag-enter');
    targetElm?.classList.remove('drag-enter');
    setTargetElm(newTargetElm);
  };

  const handleDrop = (e) => {
    if (props.activatedDraggableField) return;
    e.preventDefault();
    e.stopPropagation();

    const finalTargetElm = e.target.closest('.drive-elm');
    if (!finalTargetElm.classList.contains('drive-folder') || !targetElm || !movedElm) {
      return;
    }

    const movedIndex = movedElm.dataset.key;
    const targetIndex = finalTargetElm.dataset.key;
    console.log(movedIndex, targetIndex);
  };

  return (
    <>
      <section id="drive-list" className="list-files min-h-[600px]">
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
                  className={`drive-elm${driveIndex === index ? ' active' : ''}${elm.fullName.endsWith('/') ? ' drive-folder' : ''}`}
                  onClick={(e) => setDriveIndex(index)}
                  onDoubleClick={() => openDriveElement(index)}
                  data-key={index}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDrop={handleDrop}>
                  <th scope="row">
                    <div className="d-flex align-items-center">
                      <span className="me-2 text-[23px]">{getExtensionIcon(elm)}</span>
                      {elm.name}
                    </div>
                  </th>
                  <td>{elm.fullName.endsWith('/') ? '-' : elm.size}</td>
                  <td>{moment(elm.updated).format('DD/MM/YYYY')}</td>
                  <td>
                    <div className="dropdown">
                      <div data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-three-dots"></i>
                      </div>
                      <div
                        className="dropdown-menu p-1"
                        style={getDropDownMenuPosition()}
                        onClick={(e) => e.stopPropagation()}>
                        {driveIndex === index && <MenuActions openDriveElement={openDriveElement} />}
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
};
export default DriveList;
