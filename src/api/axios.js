import axios from 'axios'

const apiUrl = 'https://rutineitor-backend.onrender.com/api';
const localUrl = 'http://localhost:3000/api';

const instance = axios.create({
    baseURL: localUrl,
    withCredentials: true
});

export default instance