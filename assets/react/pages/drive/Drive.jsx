import React, { useState, useEffect, useRef, createContext } from 'react';
import useDriveStore from '../../stores/driveStore.js';
import useUserStore from '../../stores/userStore.js';
import { useForm } from 'react-hook-form';

import DriveList from '../../components/DriveList/DriveList.jsx';
import DriveMenu from '../../components/DriveMenu/DriveMenu.jsx';
import DraggableField from '../../components/DraggableField/DraggableField.jsx';
import ReaderModal from '../../components/ReaderModal/ReaderModal.jsx';
import SSEEvent from '../../components/SSEEvent/SSEEvent.jsx';

export const DriveContext = createContext();

const Drive = () => {
  const [layout, setlayout] = useState(1);
  const { user } = useUserStore();
  const {
    getFolder,
    getFolderPath,
    setRootDir,
    paths,
    rootDir,
    setPaths,
    addFolder,
    getFileUrl,
    drive,
    driveIndex,
    changeDriveElementName,
    addPath,
  } = useDriveStore();
  const modalBtn = useRef(null);
  const modalCloseBtn = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [formAction, setFormAction] = useState(null);
  const [keywords, setKewords] = useState('');
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [driveFile, setDriveFile] = useState(null);
  const [sseUrl, setSseUrl] = useState(null);
  const [activatedDraggableField, setActivatedDraggableField] = useState(true);

  useEffect(() => {
    if (user) {
      const rootFolder = user.roles.includes('ROLE_ADMIN')
        ? process.env.APP_ENV
        : process.env.APP_ENV + '/' + user.name;
      setRootDir(rootFolder);
      getFolder(rootFolder);
    }
  }, [user]);

  const changePath = async (chosenIndex) => {
    let newPaths = [];
    if (parseInt(chosenIndex) >= 0) {
      newPaths = paths.filter((path, index) => index <= chosenIndex);
    }

    setPaths(newPaths);
    await getFolder(getFolderPath());
  };

  const toggleForm = (newFormAction = null) => {
    if (newFormAction === null) {
      modalCloseBtn.current?.click();
      return;
    }

    switch (newFormAction) {
      case 1:
        reset({
          name: null,
        });
        break;
      case 2:
        reset({
          name: null,
        });
        break;
    }
    setFormAction(newFormAction);
    modalBtn.current?.click();
  };

  const addFolderSubmit = async (data) => {
    await addFolder(data.name);
    toggleForm();
  };

  const openDriveElement = (index) => {
    if (drive[index].fullName.endsWith('/')) addPath(index);
    else viewFile(index);
  };

  const viewFile = async (index) => {
    setDriveFile(null);
    setShowReaderModal(true);
    const file = await getFileUrl(index);
    setDriveFile(file);
  };

  const changeElmName = async (data) => {
    const oldPath = drive[driveIndex]['fullName'];
    const tab = oldPath.split('/');
    const index = oldPath.endsWith('/') ? tab.length - 2 : tab.length - 1;
    tab[index] = data.name;

    await changeDriveElementName(driveIndex, oldPath, tab.join('/'));
    toggleForm();
  };

  const moveElmInFolder = async (movedElmIndex, targetElmIndex) => {
    await changeDriveElementName(
      movedElmIndex,
      drive[movedElmIndex]['fullName'],
      `${drive[targetElmIndex]['fullName']}${drive[movedElmIndex]['name']}`,
      true
    );
  };

  return (
    <>
      <DriveContext.Provider value={{ toggleForm, openDriveElement }}>
        <section id="drive" className="p-2">
          <section className="container-fluid">
            <div className="row">
              <div className="col-12 d-lg-block col-lg-3">
                <DriveMenu toggleForm={toggleForm} setSseUrl={setSseUrl} />
              </div>
              <div className="col-12 col-lg-9">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center justify-content-start">
                    {paths.length > 0 && (
                      <select
                        value={paths.length - 1}
                        className="form-select form-select-sm"
                        onChange={(e) => changePath(e.target.value)}>
                        <option value="-1">
                          {user.roles.includes('ROLE_ADMIN')
                            ? rootDir
                            : rootDir.replace(new RegExp(`^${process.env.APP_ENV}/`), '')}
                        </option>
                        {paths.map((path, index) => (
                          <option key={index} value={index}>
                            {path}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm + ${layout === 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setlayout(1)}>
                      <i className="bi bi-list-check"></i>
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm + ${layout === 2 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setlayout(2)}>
                      <i className="bi bi-ui-checks-grid"></i>
                    </button>
                  </div>
                </div>

                <div className="pt-1 pb-1">
                  <div className="input-group mb-3">
                    <input
                      type="search"
                      className="form-control form-control-lg"
                      placeholder="nom"
                      aria-label="Recipient’s username"
                      aria-describedby="button-addon2"
                      defaultValue={keywords}
                      onInput={(e) => setKewords(e.target.value)}
                    />
                    <button className="btn btn-outline-primary" type="button" id="button-addon2">
                      Button
                    </button>
                  </div>
                </div>

                <DraggableField
                  activatedDraggableField={activatedDraggableField}
                  setActivatedDraggableField={setActivatedDraggableField}>
                  {layout === 1 && (
                    <DriveList
                      keywords={keywords}
                      viewFile={viewFile}
                      activatedDraggableField={activatedDraggableField}
                      setActivatedDraggableField={setActivatedDraggableField}
                      openDriveElement={openDriveElement}
                      moveElmInFolder={moveElmInFolder}
                    />
                  )}
                </DraggableField>
              </div>
            </div>
          </section>
        </section>
      </DriveContext.Provider>

      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#driveModal"
        ref={modalBtn}></button>
      <div
        className="modal fade"
        id="driveModal"
        data-bs-backdrop="static"
        tabIndex="-1"
        aria-labelledby="driveModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title fs-5" id="driveModalLabel">
                {formAction === 1 && 'Changer le nom'}
                {formAction === 2 && 'Créer un dossier'}
              </h3>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalCloseBtn}
                onClick={() => setFormAction(null)}></button>
            </div>
            <div className="modal-body">
              {formAction === 1 && (
                <form className="" onSubmit={handleSubmit(changeElmName)}>
                  <div className="mb-3">
                    <label htmlFor="old-name" className="form-label">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="old-name"
                      disabled
                      value={drive[driveIndex]['name']}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nouveau nom(avec l&apos;extension)*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control form-control-sm"
                      autoComplete="off"
                      {...register('name', {
                        required: { value: true, message: 'Le champ est obligatoire' },
                      })}
                    />
                    {errors.name?.type === 'required' && (
                      <div className="alert alert-danger mt-1">{errors.name?.message}</div>
                    )}
                  </div>
                  <div className="text-center">
                    <button className="btn btn-primary btn-sm" type="submit">
                      Envoyer
                    </button>
                  </div>
                </form>
              )}
              {formAction === 2 && (
                <form className="" onSubmit={handleSubmit(addFolderSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nom du dossier*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control form-control-sm"
                      autoComplete="off"
                      {...register('name', {
                        required: { value: true, message: 'Le champ est obligatoire' },
                      })}
                    />
                    {errors.name?.type === 'required' && (
                      <div className="alert alert-danger mt-1">{errors.name?.message}</div>
                    )}
                  </div>
                  <div className="text-center">
                    <button className="btn btn-primary btn-sm" type="submit">
                      Envoyer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {paths.length > 0 && (
        <button
          type="button"
          className="btn btn-outline-primary fixed bottom-5 end-5 z-50"
          onClick={() => changePath(paths.length - 2)}>
          <i className="bi bi-arrow-left-circle"></i>
        </button>
      )}

      {showReaderModal && <ReaderModal setShowReaderModal={setShowReaderModal} driveFile={driveFile} />}

      {user?.roles.includes('ROLE_ADMIN') && <SSEEvent url={sseUrl} />}
    </>
  );
};
export default Drive;
