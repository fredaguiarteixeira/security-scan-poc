import { SET_LANGUAGE } from 'constants/constants';

const setActiveLanguage = locale => ({
  type: SET_LANGUAGE,
  locale,
});

const languageActions = {
  setActiveLanguage,
};

export default languageActions;
