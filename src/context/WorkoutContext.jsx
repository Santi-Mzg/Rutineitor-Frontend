import { createContext, useContext, useState } from "react"
import { getWorkoutRequest, getCalendarWorkoutsRequest, createOrUpdateWorkoutRequest, deleteWorkoutRequest } from '../api/workout.js';
import { useAuth } from './AuthContext.jsx';
import { formatDate } from '../utils/utils.js'


const todayDate = new Date() // Obtiene la fecha de hoy
todayDate.setHours(0, 0, 0, 0)

export const WorkoutContext = createContext()

export const useWorkout = () => {
    const context = useContext(WorkoutContext)
    if (!context) throw new Error("useWorkout must be used within an WorkoutProvider")
    return context
}

export const WorkoutProvider = ({ children }) => {
    const { user } = useAuth()
    const [workout, setWorkout] = useState({
        date: formatDate(todayDate),
        type: null,
        blockList: [],
        comments: ''
    })

    const getWorkout = async (date) => {
        try {
            const res = await getWorkoutRequest(date)
            console.log("asdasd "+JSON.stringify(res.data))
            setWorkout(({
                date: date,
                type: res.data.type,
                blockList: res.data.blockList,
                comments: res.data.comments
            }))
            
        } catch (error) {
            if (error.response?.data?.message==='Rutina no encontrada') {
                const localWorkout = localStorage.getItem(date + user.username)

                if (localWorkout) 
                    setWorkout(JSON.parse(localWorkout))
                else {
                    setWorkout({
                        date: date,
                        type: null,
                        blockList: [],
                        comments: '',
                    });
                }
            }
        }
    }

    // const getCalendarWorkouts = async () => {
    //     try {
    //         const res = await getCalendarWorkoutsRequest()
    //         console.log("CWODs "+JSON.stringify(res.data))
    //         return res.data
            
    //     } catch (error) {
    //         console.log(error)
    //         return []
    //     }
    // }

    // const createOrUpdateWorkout = async (workout) => {
    //     try {
    //         console.log("SAVE "+JSON.stringify(workout))
    //         await createOrUpdateWorkoutRequest(workout)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const deleteWorkout = async (date) => {
    //     try {
    //         await deleteWorkoutRequest(date)
    //     } catch (error) {
    //         console.log(error)
    //     }

    //     setWorkout(prevWorkout => ({
    //         date: prevWorkout.date,
    //         type: null,
    //         blockList: [],
    //         comments: ''
    //     }))
    // }

    return (
        <WorkoutContext.Provider
            value={{
                workout,
                setWorkout,
                getWorkout,
                // createOrUpdateWorkout,
                // deleteWorkout,
            }}>
            {children}
        </WorkoutContext.Provider>
    )
}