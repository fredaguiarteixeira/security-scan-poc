export const removeLocalStorageItem = key => {
  localStorage.removeItem(key);
};

export const setLocalStorageItem = (key, value) => {
  if (!value) {
    removeLocalStorageItem(key);
  }
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = key => {
  return JSON.parse(localStorage.getItem(key));
};
