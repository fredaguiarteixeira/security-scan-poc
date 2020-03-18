import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from 'helpers/configureStore';

const store = configureStore();
const ReduxProvider = ({ children }) => <Provider store={store}>{children}</Provider>;

ReduxProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ReduxProvider;
