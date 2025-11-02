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

/**
 *
 * @param {number|string} size
 * @return {{size:(number|string), unit: string}}
 */
export const convertS3Size = (size) => {
  const castedSize = typeof size === 'string' ? parseInt(size) : size;

  if (castedSize < 1024) return { size: castedSize, unit: 'o' };
  if (castedSize < 1024 * 1024) return { size: (castedSize / 1024).toFixed(1), unit: 'Ko' };
  if (castedSize < 1024 * 1024 * 1024) return { size: (castedSize / (1024 * 1024)).toFixed(1), unit: 'Mo' };
  return { size: (castedSize / (1024 * 1024 * 1024)).toFixed(1), unit: 'Go' };
};
