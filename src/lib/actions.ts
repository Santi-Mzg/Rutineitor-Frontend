import { deleteWorkoutRequest, createOrUpdateWorkoutRequest, getCalendarWorkoutsRequest } from "../api/workout"
import { WorkoutType } from "./definitions";

export const getCalendarWorkouts = async () => {
    try {
        const res = await getCalendarWorkoutsRequest()
        console.log("CWODs "+JSON.stringify(res.data))
        
        return Array.isArray(res.data) ? res.data : [];
        
    } catch (error) {
        console.log(error)
        return []
    }
}

export const createOrUpdateWorkout = async (workout: WorkoutType) => {
        try {
            console.log("SAVE "+JSON.stringify(workout))
            await createOrUpdateWorkoutRequest(workout)

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