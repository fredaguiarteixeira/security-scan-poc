import { combineReducers } from 'redux';
import multiplyReducer from './multiplyReducer';
import language from './languageReducer';

export default combineReducers({
  language,
  multiplyReducer,
});
