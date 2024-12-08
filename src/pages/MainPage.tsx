// import React from 'react';
// import { getCalendarWorkouts } from '../lib/actions.ts';
// import WorkoutPage from './WorkoutPage.tsx';
// import { Workout } from '../lib/definitions.ts';

// export default async function MainPage() {

//     const workouts: Workout[] = await getCalendarWorkouts()

//     return (
//         <WorkoutPage workouts={workouts}/>
//     )
// }


import React, { useEffect, useState } from 'react';
import { getCalendarWorkouts } from '../lib/actions.ts';
import WorkoutPage from './WorkoutPage.tsx';
import { WorkoutType } from '../lib/definitions.ts';
import { useAuth } from '../context/AuthContext.jsx';
import CalendarSection from './CalendarSection.tsx';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils/utils.js';
import Toolbar from '../components/Toolbar.jsx';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MainPage() {
    const { user } = useAuth()
    const { date } = useParams() // Obtiene la fecha pasada en la URL de la página
    const todayDate = new Date() // Obtiene la fecha de hoy
    const actualDate = date ?? formatDate(todayDate) // Si date es undefined se iguala a todayDate

    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState<string>((todayDate.getMonth() + 1).toString().padStart(2, '0'));
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>([]);
    const [workout, setWorkout] = useState<WorkoutType>({
        date: actualDate,
        type: '',
        blockList: [],
        comments: '',
        modificable: false,
    })

    // for(let i=0; i<workoutList.length; i++){
    //     console.log("CWOD "+JSON.stringify(workoutList[i].date))
    // }

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const data = await getCalendarWorkouts();
                setWorkoutList(data); // Asigna los datos de los entrenamientos
            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, []);

    // Actualiza el entrenamiento según la fecha actual
    useEffect(() => {
        const foundWorkout = workoutList.find((wod) => wod.date === `${actualDate}T00:00:00.000Z`);

        setWorkout({
            date: actualDate,
            type: foundWorkout?.type || '',
            blockList: foundWorkout?.blockList || [],
            comments: foundWorkout?.comments || '',
            modificable: false,
        });
    }, [actualDate, workoutList]);

    // const foundWorkout = workoutList.find(wod => wod.date === actualDate+"T00:00:00.000Z") 

    // useEffect(() => {
    //     if (foundWorkout) {
    //         setWorkout({
    //             date: actualDate,
    //             type: foundWorkout.type ?? "",
    //             blockList: foundWorkout.blockList ?? [],
    //             comments: foundWorkout.comments ?? "",
    //             modificable: false,
    //         });
    //     } else {
    //         setWorkout({
    //             date: actualDate,
    //             type: "",
    //             blockList: [],
    //             comments: "",
    //             modificable: false,
    //         });
    //     }
    // }, [actualDate]);  



    // Código de la seccion de comentarios
    const handleChange = (event) => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            comments: event.target.value
        }));
    };
    
    const [expandedCommentPanel, setExpandedCommentPanel] = useState<boolean>(false);

    const toggleCommentPanel = () => {
        setExpandedCommentPanel((prevState => !prevState));
    };


    // Código de la seccion de calendario
    const [expandedCalendarPanel, setExpandedCalendarPanel] = useState<boolean>(false);


    if (loading) {
        return <div>Loading...</div>; // Puedes mostrar un loader o mensaje mientras se cargan los datos
    }

    return (
        <>
            <Toolbar />
            <div className='parent-section'>
                <div className='header'>
                    <h2>Entrenamiento del Día:</h2>
                    <h2 style={{ color: '#f3969a', fontWeight: 'bold', textAlign: 'center' }}>{workout.type}</h2>
                    <button className='more-info-button' onClick={toggleCommentPanel}><FontAwesomeIcon icon={faComment} style={{fontSize: '30px', color: 'khaki', zIndex: 1}} /></button>
                </div>
                {expandedCommentPanel && 
                <div>
                    <textarea
                        className='comment-panel'
                        value={workout.comments}
                        onChange={handleChange}
                        placeholder="Comentarios..."
                    />
                </div>
                ||
                <div>
                    <WorkoutPage user={user} workout={workout} setWorkout={setWorkout} expandedCalendarPanel={expandedCalendarPanel}/>
                    <CalendarSection user={user} workout={workout} setWorkout={setWorkout} workoutList={workoutList} expandedCalendarPanel={expandedCalendarPanel} setExpandedCalendarPanel={setExpandedCalendarPanel}/>
                </div>
                }
            </div>
        </>
    )
}
