export const logout = () => {
  localStorage.removeItem('token');
  location.replace('/');
};

/**
 * @param {number} seconds
 * @return {Promise<void>}
 */
export const wait = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
