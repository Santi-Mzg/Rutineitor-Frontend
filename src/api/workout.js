import axios from './axios'

export const getWorkoutRequest = (date) => axios.get(`/workout/${date}`)

export const getCalendarWorkoutsRequest = (date) => axios.get(`/workout-calendar-list/${date}`)

export const createOrUpdateWorkoutRequest = (workout) => axios.post(`/workout`, workout)

export const deleteWorkoutRequest = (date) => axios.delete(`/workout/${date}`)

export const fetchWorkoutsByTypeRequest = (type) => axios.get(`/workout-type-list/${type}`)

export const fetchWorkoutsByExerciseRequest = (exercise) => axios.get(`/workout-exercise-list/${exercise}`)

