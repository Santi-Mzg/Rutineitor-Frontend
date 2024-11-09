import axios from 'axios'

const apiUrl = process.env.API_URL;

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' 
        ? apiUrl 
        : 'http://localhost:3000/api',
    withCredentials: true
});

export default instance