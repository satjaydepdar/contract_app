import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = async (files: File[], message: string) => {
  const formData = new FormData();
  
  // Serialize files with only necessary properties
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
    formData.append(`fileInfo[${index}]`, JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    }));
  });
  
  formData.append('message', message);

  const response = await api.post('/chat', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};