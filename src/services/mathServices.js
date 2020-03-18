import axios from 'axios';
import config from '../config';

export const multiply = async (x, y) => {
  const { baseUrl, endpoint } = config.multiplyApi;
  const response = await axios.post(`${baseUrl}${endpoint}`, { x, y });
  return response.data;
};

const mathServices = {
  multiply,
};

export default mathServices;
