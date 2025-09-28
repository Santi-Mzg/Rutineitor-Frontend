import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL;
const localUrl = import.meta.env.VITE_LOCAL_URL;

const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

export default instance