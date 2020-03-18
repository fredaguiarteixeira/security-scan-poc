import { useReducer } from 'react';
import { isInteger } from 'helpers/validators';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, [action.name]: { ...state[action.name], value: action.value, error: action.error } };
    case 'setErrors':
      return { ...state, ...action.fieldsWithError };
    default:
      return state;
  }
};

const trim = str => (str ? str.trim() : '');

const useInputForm = inputFields => {
  const [input, dispatch] = useReducer(formReducer, inputFields);

  const handleChange = event => {
    const { name, value } = event.target;
    const field = input[name];
    const text = trim(value);
    const errorMsg = field.required && !text ? 'Required field' : '';
    dispatch({ type: 'set', name, value, error: errorMsg });
  };

  const getError = field => {
    let errorMsg = '';
    if (field.required && !field.value) {
      errorMsg = 'Required field';
    } else if (field.type === 'integer' && !isInteger(field.value)) {
      errorMsg = 'Integer expected';
    }
    return errorMsg;
  };

  const validateForm = () => {
    const fieldsWithError = {};
    Object.keys(input).forEach(name => {
      const field = input[name];
      const errorMsg = getError(field);
      if (errorMsg) {
        fieldsWithError[name] = { error: errorMsg };
      }
    });
    if (Object.entries(fieldsWithError).length > 0) {
      dispatch({ type: 'setErrors', fieldsWithError });
      return false;
    }
    return true;
  };

  const validateField = event => {
    const { name } = event.target;
    const field = input[name];
    const errorMsg = getError(field);
    dispatch({ type: 'set', name, value: field.value, error: errorMsg });
  };

  return {
    handleChange,
    input,
    validateField,
    validateForm,
  };
};

export default useInputForm;
