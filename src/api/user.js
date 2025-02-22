import axios from './axios'

export const fetchUsersRequest = () => axios.get(`/users`)
export const fetchUserRequest = (username) => axios.get(`/user/${username}`)
export const deleteUserRequest = (id) => axios.delete(`/user/${id}`)
