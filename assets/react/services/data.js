export const getImageExtensions = () => {
  return ['png', 'gif', 'jpeg', 'jpg', 'webp']
}

export const getRequestHeaders = (isFormData = false) => {
    let headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    };
  
    if (isFormData) delete headers['Content-Type'];
  
    if (localStorage.getItem('token')) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }
    return headers;
};

export const getExtensionIcon = (driveElm) => {
  if (driveElm['fullName'].endsWith('/')) return <i className="bi bi-folder-fill"></i>;

  const extension = driveElm['extension'].toLowerCase();
  if (extension === 'pdf') return <i className="bi bi-file-earmark-pdf-fill"></i>;
  if (getImageExtensions().includes(extension)) return <i className="bi bi-file-earmark-image"></i>;
  else return <i className="bi bi-file-x"></i>;
}

export const getDropDownMenuPosition = () => {
  return {
    position: 'absolute', 
    inset: "0px auto auto 0px", 
    margin: "0px", 
    transform: "translate(0px, 26px)"
  };
}