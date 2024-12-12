import React, { useEffect, useState } from 'react';
import { getCalendarWorkouts } from '../lib/actions.ts';
import WorkoutPage from './WorkoutPage.tsx';
import { WorkoutType } from '../lib/definitions.ts';
import { useAuth } from '../context/AuthContext.jsx';
import CalendarSection from './CalendarSection.tsx';
import { useParams } from 'react-router-dom';
import { formatDate } from '../lib/utils.ts';
import Toolbar from '../components/Toolbar.jsx';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MainPage() {
    const { user } = useAuth() 
    const { date } = useParams() // Obtiene la fecha pasada en la URL de la página
    const todayDate = new Date() // Obtiene la fecha de hoy
    const firstDayOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1); // Primer día del mes actual
    const actualDate = date ?? formatDate(todayDate) // Si date es undefined se iguala a todayDate
    
    const [loading, setLoading] = useState(true);
    const [activeStartDate, setActiveStartDate] = useState<string>(formatDate(firstDayOfMonth));
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>([]);
    const [workout, setWorkout] = useState<WorkoutType>({
        date: actualDate,
        type: '',
        blockList: [],
        comments: '',
        modificable: true,
    })

    // for(let i=0; i<workoutList.length; i++){
    //     console.log("CWOD "+JSON.stringify(workoutList[i].date))
    // }

    useEffect(() => {
        const fetchWorkouts = async (date: string) => {
            try {
                const data = await getCalendarWorkouts(date);
                setWorkoutList(data); // Asigna los datos de los entrenamientos
            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts(activeStartDate);
        
    }, [activeStartDate]);

    // Actualiza el entrenamiento según la fecha actual
    useEffect(() => {
        const foundWorkout = workoutList.find((wod) => wod.date === `${actualDate}T00:00:00.000Z`);
        
        if(!foundWorkout) { // Si no se encuentra un entrenamiento para la fecha actual es porque es más antiguo que la fecha mas temprana de fetcheo por lo que la actualiza y hace refetch.
            setActiveStartDate(actualDate)
        }

        setWorkout({
            date: actualDate,
            type: foundWorkout?.type || '',
            blockList: foundWorkout?.blockList || [],
            comments: foundWorkout?.comments || '',
            modificable: foundWorkout ? false : true,
        });
    }, [actualDate, workoutList]);


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
                    <CalendarSection user={user} workout={workout} setWorkout={setWorkout} workoutList={workoutList} setWorkoutList={setWorkoutList} expandedCalendarPanel={expandedCalendarPanel} setExpandedCalendarPanel={setExpandedCalendarPanel} activeStartDate={activeStartDate} setActiveStartDate={setActiveStartDate}/>
                </div>
                }
            </div>
        </>
    )
}
