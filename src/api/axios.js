import axios from 'axios'

const apiUrl = 'https://rutineitor-backend.onrender.com/api';
const localUrl = 'http://localhost:3001/api';

const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

export default instance