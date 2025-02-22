import { deleteWorkoutRequest, createOrUpdateWorkoutRequest, getCalendarWorkoutsRequest, fetchWorkoutsByTypeRequest, fetchWorkoutsByExerciseRequest} from "../../api/workout"
import { WorkoutType } from "../definitions";

export const getCalendarWorkouts = async (date: string, id:string) => {
    try {
        const res = await getCalendarWorkoutsRequest(date, id)
        
        return Array.isArray(res.data) ? res.data : [];
        
    } catch (error) {
        console.log(error)
        return []
    }

}

export const createOrUpdateWorkout = async (workout: WorkoutType, id:string) => {
    try {
        console.log("TO SAVE "+id+" "+JSON.stringify(workout))            

        const res = await createOrUpdateWorkoutRequest(workout, id)
        console.log("SAVED "+JSON.stringify(res.data))            
        
        return res.data

    } catch (error) {
        console.log(error)
    }
}

export const deleteWorkout = async (date: string, id:string) => {
    try {
        await deleteWorkoutRequest(date, id)

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

export const fetchWorkoutsByExercise = async (exercise: string) => {
    try {
        const res = await fetchWorkoutsByExerciseRequest(exercise)
        
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.log(error)
        return []
    }
}