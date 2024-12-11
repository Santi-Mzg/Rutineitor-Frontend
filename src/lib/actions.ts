import { deleteWorkoutRequest, createOrUpdateWorkoutRequest, getCalendarWorkoutsRequest, fetchWorkoutsByTypeRequest} from "../api/workout"
import { WorkoutType } from "./definitions";

export const getCalendarWorkouts = async (date: string) => {
    try {
        const res = await getCalendarWorkoutsRequest(date)
        
        return Array.isArray(res.data) ? res.data : [];
        
    } catch (error) {
        console.log(error)
        return []
    }
}

export const createOrUpdateWorkout = async (workout: WorkoutType) => {
    try {

        const res = await createOrUpdateWorkoutRequest(workout)
        console.log("SAVED "+JSON.stringify(res.data))            
        
        return res.data

    } catch (error) {
        console.log(error)
    }
}

export const deleteWorkout = async (date: string) => {
    try {
        await deleteWorkoutRequest(date)

    } catch (error) {
        console.log(error)
    }
}

export const fetchWorkoutsByType = async (type: string) => {
    try {
        const res = await fetchWorkoutsByTypeRequest(type)

        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.log(error)
        return []
    }
}