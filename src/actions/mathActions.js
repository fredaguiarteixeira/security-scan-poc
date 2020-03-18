import { MULTIPLY, MULTIPLY_SUCCESS, MULTIPLY_FAILURE } from 'constants/constants';
import { multiply } from 'services/mathServices';

// construct success and failure results to be dispatched to reducer
const success = response => ({
  type: MULTIPLY_SUCCESS,
  response,
  error: null,
});

const failure = error => ({
  type: MULTIPLY_FAILURE,
  result: null,
  error,
});

// execute action and dispatch results to reducer

export const multiplyNumbers = (x, y) => {
  return dispatch => {
    try {
      dispatch({ type: MULTIPLY });
      multiply(x, y).then(response => {
        dispatch(success(response));
      });
    } catch (error) {
      dispatch(failure(error));
    }
  };
};

const mathActions = {
  multiplyNumbers,
};

export default mathActions;
