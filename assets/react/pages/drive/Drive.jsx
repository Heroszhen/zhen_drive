import React, { useState, useEffect } from 'react';
import useDriveStore from '../../stores/driveStore';
import useUserStore from '../../stores/userStore.js';

import DriveList from '../../components/drivelist/DriveList';
import DriveMenu from '../../components/drivemenu/DriveMenu';

const Drive = () => {
    const [layout, setlayout] = useState(1);
    const { user } = useUserStore();
    const {getFolder, getFolderPath, setRootDir, paths, rootDir, setPaths} = useDriveStore();

    useEffect(() => {
        if (user) {
            const rootFolder = user.roles.includes('ROLE_ADMIN') ? process.env.APP_ENV : user.name
            setRootDir(rootFolder);
            getFolder(rootFolder);
        }
    }, [user]);

    const changePath = async (chosenIndex) => {
        let newPaths = [];
        if (parseInt(chosenIndex) >= 0) {
            newPaths = paths.filter((path, index) => index <= chosenIndex );
        }
        
        setPaths(newPaths);
        await getFolder(getFolderPath());
    }

    return (
        <>
            <section id="drive" className="p-2">
                <section className="container-fluid">
                    <div className="row">
                        <div className="col-12 d-lg-block col-lg-3">
                            <DriveMenu />
                        </div>
                        <div className="col-12 col-lg-9">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center justify-content-start"> 
                                    {paths.length > 0 &&
                                        <select value={paths.length - 1} className="form-select form-select-sm" onChange={(e)=>changePath(e.target.value)}>
                                            <option  value='-1'>{rootDir}</option>
                                            {
                                                paths.map((path,  index)=>(
                                                    <option key={index} value={index}>{path}</option>
                                                ))
                                            }
                                      </select>
                                    }
                                </div>
                                <div className="btn-group" role="group">
                                    <button type="button" className={`btn btn-sm + ${layout === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>setlayout(1)}>
                                        <i className="bi bi-list-check"></i>
                                    </button>
                                    <button type="button" className={`btn btn-sm + ${layout === 2 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={()=>setlayout(2)}>
                                        <i className="bi bi-ui-checks-grid"></i>
                                    </button>
                                </div>
                            </div>
                            
                            
                            {layout === 1 && <DriveList />}
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}
export default Drive;