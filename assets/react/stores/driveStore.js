import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useDriveStore = create((set, get) => ({
    drive: [],
    driveIndex: null,
    paths: [],
    rootDir: null,
    getFolder: async (path) => {
        const headers = getRequestHeaders();
        try {
            let response = await fetch(`/api/s3/get-folder`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({path: path}),
            });
          
            if (response.ok) {
                response = await response.json();
                const folders = [];
                const files = [];
                response.forEach((elm) => {
                    if (elm.fullName.endsWith('/'))folders.push(elm);
                    else files.push(elm);
                });
                set(() => ({drive: folders.concat(files)}));
            }
        } catch (e) {}
    },
    setDriveIndex: (newIndex) => set({driveIndex: newIndex}),
    setRootDir: (newRootDir) => set({rootDir: newRootDir}),
    addPath: async (driveIndex) => {
        const elm = get().drive[driveIndex];
        if (!elm.fullName.endsWith('/')) {
            return;
        }
        
        const oldPaths = get().paths;
        const drive = get().drive;
        oldPaths.push(elm.name);
        set({driveIndex: null, paths: oldPaths});
        await get().getFolder(get().getFolderPath());
    },
    setPaths: (newPaths)  => set({paths: newPaths}),
    getFolderPath: () => get().rootDir + `${get().paths.length === 0 ? '' : '/' + get().paths.join('/')}`
}));
export default useDriveStore;