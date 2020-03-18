import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import languageActions from 'actions/languageActions';
import { getActiveLanguage } from 'selectors/languageSelectors';

const LangSwitcher = () => {
  const dispatch = useDispatch();
  const activeLang = useSelector(getActiveLanguage);
  return (
    <div className="btn-group">
      <button
        id="btn-lang-en"
        className={`btn btn-${activeLang === 'en' ? 'success' : 'secondary'}`}
        onClick={() => {
          dispatch(languageActions.setActiveLanguage('en'));
        }}
        type="button"
      >
        EN
      </button>
      <button
        id="btn-lang-fr"
        className={`btn btn-${activeLang === 'fr' ? 'success' : 'secondary'}`}
        onClick={() => {
          dispatch(languageActions.setActiveLanguage('fr'));
        }}
        type="button"
      >
        FR
      </button>
    </div>
  );
};

export default LangSwitcher;
