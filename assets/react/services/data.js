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