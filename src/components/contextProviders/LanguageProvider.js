import React, { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { flattenMessages } from 'helpers/languageHelper';
import { TRANSLATIONS } from 'constants/translations';
import { getActiveLanguage } from 'selectors/languageSelectors';

const LanguageProvider = props => {
  const activeLanguage = useSelector(getActiveLanguage);
  return useMemo(
    () => (
      <IntlProvider locale={activeLanguage} messages={flattenMessages(TRANSLATIONS[activeLanguage])}>
        {props.children}
      </IntlProvider>
    ),
    [activeLanguage]
  );
};

export default LanguageProvider;
