export const getImageExtensions = () => {
  return ['png', 'gif', 'jpeg', 'jpg']
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
  if (driveElm['extension'] === 'pdf') return <i className="bi bi-file-earmark-pdf-fill"></i>;
  if (getImageExtensions().includes(driveElm['extension'].toLowerCase())) return <i className="bi bi-file-earmark-image"></i>;
}

export const getDropDownMenuPosition = () => {
  return {
    position: 'absolute', 
    inset: "0px auto auto 0px", 
    margin: "0px", 
    transform: "translate(0px, 26px)"
  };
}