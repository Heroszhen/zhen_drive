import { create } from 'zustand';
import { getRequestHeaders } from '../services/data.js';

const useDriveStore = create((set, get) => ({
  drive: [],
  driveIndex: null,
  paths: [],
  rootDir: null,
  getFolder: async (path = null) => {
    if (path === null) path = get().getFolderPath() + '/';

    set(() => ({ drive: [] }));
    const headers = getRequestHeaders();
    try {
      const response = await fetch(`/api/s3/get-folder`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ path }),
      });

      if (response.ok) {
        const elements = (await response.json())['hydra:member'];
        const folders = [];
        const files = [];
        elements.forEach((elm) => {
          if (elm.fullName.endsWith('/')) folders.push(elm);
          else files.push(elm);
        });
        set(() => ({ drive: folders.concat(files) }));
        get().sortDrive();
      }
    } catch {}
  },
  setDriveIndex: (newIndex) => set({ driveIndex: newIndex }),
  setRootDir: (newRootDir) => set({ rootDir: newRootDir }),
  sortDrive: () => {
    const folders = [];
    const files = [];

    get().drive.forEach((elm) => {
      if (elm.fullName.endsWith('/')) folders.push(elm);
      else files.push(elm);
    });

    folders.sort((current, next) => current.name.localeCompare(next.name));
    files.sort((current, next) => current.name.localeCompare(next.name));

    set({ drive: [...folders, ...files] });
  },
  addPath: async (driveIndex) => {
    const elm = get().drive[driveIndex];
    if (!elm.fullName.endsWith('/')) {
      return;
    }

    const oldPaths = get().paths;
    oldPaths.push(elm.name);
    set({ driveIndex: null, paths: oldPaths });
    await get().getFolder(get().getFolderPath());
  },
  setPaths: (newPaths) => set({ paths: newPaths }),
  getFolderPath: () => get().rootDir + `${get().paths.length === 0 ? '' : '/' + get().paths.join('/')}`,
  addFolder: async (folderName) => {
    const headers = getRequestHeaders();
    try {
      let response = await fetch(`/api/s3/add-folder`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ path: `${get().getFolderPath()}/${folderName}` }),
      });

      if (response.ok) {
        response = await response.json();
        set(() => ({ drive: [response, ...get().drive] }));
        get().sortDrive();
      }
    } catch {}
  },
  deleteDriveElement: async (index) => {
    const headers = getRequestHeaders();
    try {
      const response = await fetch(`/api/s3/delete-drive`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ path: `${get().drive[index].fullName}` }),
      });

      if (response.ok) {
        set(() => ({ drive: get().drive.filter((item, itemIndex) => itemIndex !== index) }));
      }
    } catch {}
  },
  uploadFolderOrFiles: async (files) => {
    const formData = new FormData();
    const folderPath = get().getFolderPath() + '/';
    formData.append('total', files.length);
    formData.append('rootPath', folderPath);
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
      const fullPath = file.webkitRelativePath !== '' ? file.webkitRelativePath : file.fullPath;
      if (fullPath && fullPath !== '') {
        const tab = fullPath.split('/');
        tab.pop();
        formData.append(`file_${index}_folder`, tab.join('/') + '/');
      }
    });

    const headers = getRequestHeaders(true);
    try {
      const response = await fetch(`/api/s3/upload-folder-files`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.ok) {
        const results = await response.json();
        if (Array.isArray(results)) {
          let path;
          results.forEach((elm) => {
            if (elm.fullName.endsWith('/')) {
              // folder
              path = `${folderPath}${elm.name}/`;
              if (path === elm.fullName) set(() => ({ drive: [elm, ...get().drive] }));
            } else {
              // file
              path = elm.fullName.substring(0, elm.fullName.lastIndexOf('/')) + '/';
              if (path === folderPath) set(() => ({ drive: [...get().drive, elm] }));
            }
          });
          get().sortDrive();
        }
      }
    } catch {}
  },
  getBucketInfo: async (path) => {
    const headers = getRequestHeaders();
    try {
      const response = await fetch(`/api/s3/get-bucket`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ path }),
      });

      if (response.ok) return await response.json();
    } catch {}
  },
  getFileUrl: async (index) => {
    const headers = getRequestHeaders();
    try {
      const response = await fetch(`/api/s3/get-file-url`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ path: get().drive[index].fullName }),
      });

      if (response.ok) {
        const result = await response.json();
        return { ...get().drive[index], url: result.url };
      }
    } catch {}
  },
  changeDriveElementName: async (index, oldName, newName, toRemove = false) => {
    const headers = getRequestHeaders();

    const payload = {
      oldPath: oldName,
      newPath: newName,
      isFile: !oldName.endsWith('/'),
    };
    try {
      const response = await fetch(`/api/s3/rename-folder-file`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        if (toRemove) {
          set(() => ({ drive: get().drive.filter((item, itemIndex) => itemIndex !== index) }));
        } else {
          const oldDrive = get().drive;
          oldDrive[index] = result;
          set(() => ({ drive: oldDrive }));
          get().sortDrive();
        }
      }
    } catch {}
  },
}));
export default useDriveStore;
