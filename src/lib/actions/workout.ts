import { deleteWorkoutRequest, createOrUpdateWorkoutRequest, getCalendarWorkoutsRequest, fetchWorkoutsByTypeRequest, fetchWorkoutsByExerciseRequest} from "../../api/workout"
import { WorkoutType } from "../definitions";
import { sendWebPush } from "./push";

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

        const res = await createOrUpdateWorkoutRequest(workout, id)

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