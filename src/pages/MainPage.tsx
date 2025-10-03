import React, { useEffect, useState } from 'react';
import { getCalendarWorkouts } from '../lib/actions/workout.ts';
import WorkoutPage from './WorkoutPage.tsx';
import { WorkoutType } from '../lib/definitions.ts';
import { useAuth } from '../context/AuthContext.jsx';
import CalendarSection from './CalendarSection.tsx';
import { useParams } from 'react-router-dom';
import { formatDate } from '../lib/utils.ts';
import Toolbar from '../components/Toolbar.tsx';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function MainPage() {

    const { user } = useAuth() 
    const { date } = useParams() // Obtiene la fecha pasada en la URL de la página
    const todayDate = new Date() // Obtiene la fecha de hoy
    const firstDayOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1); // Primer día del mes actual
    const actualDate = date ?? formatDate(todayDate) // Si date es undefined se iguala a todayDate

    const [loading, setLoading] = useState(false);
    const [activeStartDate, setActiveStartDate] = useState<string>(formatDate(firstDayOfMonth));
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>([]);
    const [workout, setWorkout] = useState<WorkoutType>({
        date: actualDate,
        type: '',
        blockList: [],
        comments: '',
        modificable: true,
    })

    const getDateTextFormat = () => {
        const [year, month, day] = actualDate.split('-').map(Number);
        const dayOfWeek = new Date(actualDate).getDay(); 
        let dayOfWeekName = '';
        switch (dayOfWeek) {
            case 0: dayOfWeekName = 'Lunes'; break;
            case 1: dayOfWeekName = 'Martes'; break;
            case 2: dayOfWeekName = 'Miércoles'; break;
            case 3: dayOfWeekName = 'Jueves'; break;
            case 4: dayOfWeekName = 'Viernes'; break;
            case 5: dayOfWeekName = 'Sábado'; break;
            case 6: dayOfWeekName = 'Domingo'; break;
            default: return '';
        }   

        return `${dayOfWeekName} ${day}/${month}/${year}`;
    }
    

    useEffect(() => { // Guarda la rutina cuando se modifica menos en el primero render
        if(workout.type !== '') {
            localStorage.setItem(workout.date + user?.username, JSON.stringify(workout));
        }
    }, [workout]);

    useEffect(() => {
        const fetchWorkouts = async (date: string, user_id: string) => {
            try {

                const data = await getCalendarWorkouts(date, user_id);
                setWorkoutList(data);

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWorkouts(activeStartDate, user?.id || '');
        
    }, [activeStartDate]);

    // Actualiza el entrenamiento según la fecha actual
    useEffect(() => {
        const actualDateDATE = new Date(actualDate)
        const activeStartDateDATE = new Date(activeStartDate)        

        let foundWorkout: WorkoutType | undefined

        const savedWorkout = localStorage.getItem(actualDate + user?.username);
        if (savedWorkout) {
            foundWorkout = JSON.parse(savedWorkout);
        }
        else  {
            foundWorkout = workoutList.find((wod) => wod.date.includes(actualDate));        

            if(!foundWorkout && actualDateDATE < activeStartDateDATE) // Si se sigue sin encontrar y es más antiguo que la fecha mas temprana de fetcheo se actualiza y hace refetch.
                setActiveStartDate(actualDate);
        }
        
        setWorkout({
            date: actualDate,
            type: foundWorkout?.type || '',
            blockList: foundWorkout?.blockList || [],
            comments: foundWorkout?.comments || '',
            modificable: foundWorkout ? foundWorkout.modificable : true
        });
        
    }, [actualDate, workoutList]);

    // Código de la seccion de comentarios
    const handleChange = (event: any) => {
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
    const [expandedCalendarPanel, setExpandedCalendarPanel] = useState<boolean>(true);


    if (loading) {
        return <div>Loading...</div>; // Puedes mostrar un loader o mensaje mientras se cargan los datos
    }

    return (
        <div className='w-screen'>
            <Toolbar />
            {user && (
                <div className='parent-section'>
                    <div className='header'>
                        <h1 className='text-center text-2xl font-bold mb-2 text-[#f3969a]'>{getDateTextFormat()}</h1>
                        <h2>Entrenamiento del Día:</h2>
                        <h2 className='font-bold text-center text-[#f3969a]'>{workout.type}</h2>
                        <button className='more-info-button' onClick={toggleCommentPanel}><FontAwesomeIcon icon={faComment} className="text-[30px] text-[khaki] z-1" /></button>
                    </div>
                    {expandedCommentPanel ? (
                        <div className='w-full'>
                            <textarea
                                className='comment-panel'
                                value={workout.comments}
                                onChange={handleChange}
                                placeholder="Comentarios..."
                            />
                        </div>
                     ) : (
                        <>
                            <WorkoutPage user={user} workout={workout} setWorkout={setWorkout} expandedCalendarPanel={expandedCalendarPanel}/>
                            <CalendarSection user={user} workout={workout} setWorkout={setWorkout} workoutList={workoutList} setWorkoutList={setWorkoutList} expandedCalendarPanel={expandedCalendarPanel} setExpandedCalendarPanel={setExpandedCalendarPanel} activeStartDate={activeStartDate} setActiveStartDate={setActiveStartDate}/>    
                        </>
                    )}
                </div>
            )}

        </div>
    )
}
