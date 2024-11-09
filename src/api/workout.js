import axios from './axios'

export const getWorkoutRequest = (date) => axios.get(`/workout/${date}`)

export const createOrUpdateWorkoutRequest = (workout) => axios.post(`/workout`, workout)

export const deleteWorkoutRequest = (date) => axios.delete(`/workout/${date}`)