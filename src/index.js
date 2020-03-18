import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import '@tds/core-css-reset/dist/index.css';
import 'index.css';
import App from 'components/shared/App';
import ReduxProvider from 'components/contextProviders/ReduxProvider';
import LanguageProvider from 'components/contextProviders/LanguageProvider';

ReactDOM.render(
  <ReduxProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ReduxProvider>,
  document.getElementById('root')
);
