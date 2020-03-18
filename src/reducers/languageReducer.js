import { SET_LANGUAGE, SET_LANGUAGE_SUCCESS } from 'constants/constants';

// Initial state
export const initialState = {
  locale: 'en', // default locale
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
    case SET_LANGUAGE_SUCCESS:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
};
