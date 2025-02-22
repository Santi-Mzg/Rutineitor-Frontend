import axios from './axios'

export const getWorkoutRequest = (date, id) => axios.get(`/workout/${id}/${date}`)

export const getCalendarWorkoutsRequest = (date, id) => axios.get(`/workout-calendar-list/${id}/${date}`)

export const createOrUpdateWorkoutRequest = (workout, id) => axios.post(`/workout/${id}`, workout)

export const deleteWorkoutRequest = (date, id) => axios.delete(`/workout/${id}/${date}`)

export const fetchWorkoutsByTypeRequest = (type) => axios.get(`/workout-type-list/${type}`)

export const fetchWorkoutsByExerciseRequest = (exercise) => axios.get(`/workout-exercise-list/${exercise}`)