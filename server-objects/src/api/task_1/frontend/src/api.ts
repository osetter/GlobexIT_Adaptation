import axios from 'axios';
import { BACKEND_URL } from './config/global';

export const fetchUsers = async () => {
  const formData = new FormData();
  formData.append('method', 'fetchUsers');

  const response = await axios.post(BACKEND_URL, formData);

  return response.data;
};

