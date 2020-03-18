export const isInteger = number => {
  const num = number.trim();
  if (!num) {
    return true;
  }
  if (num.match('^[0-9]+$')) {
    return true;
  }
  return false;
};

const validators = {
  isInteger,
};

export default validators;
