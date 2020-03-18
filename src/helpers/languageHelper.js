import { getLocalStorageItem, setLocalStorageItem } from './localStorage';

const activeLangKey = 'activeLanguage';

export const setLanguage = language => {
  setLocalStorageItem(activeLangKey, language);
};

export const getLanguage = () => {
  const lang = getLocalStorageItem(activeLangKey);
  if (lang === null) setLanguage('en');
  return lang || 'en';
};

export const flattenMessages = (nestedMessages, prefix = '') =>
  Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // eslint-disable-next-line no-param-reassign
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
