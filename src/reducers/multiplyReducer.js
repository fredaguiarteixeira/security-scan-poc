import { MULTIPLY, MULTIPLY_SUCCESS, MULTIPLY_FAILURE } from 'constants/constants';

const initialState = {
  response: {},
  error: '',
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MULTIPLY:
      return {
        ...state,
        response: {},
        error: '',
        loading: true,
      };
    case MULTIPLY_SUCCESS:
      return {
        ...state,
        response: action.response,
        error: '',
        loading: false,
      };
    case MULTIPLY_FAILURE:
      return {
        ...state,
        response: {},
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};
