import React, { useEffect, useState } from 'react';
import { getCalendarWorkouts } from '../lib/actions/workout.ts';
import WorkoutPage from './WorkoutPage.tsx';
import { UserType, WorkoutType } from '../lib/definitions.ts';
import CalendarSection from './CalendarSection.tsx';
import { useParams } from 'react-router-dom';
import { formatDate } from '../lib/utils.ts';
import Toolbar from '../components/Toolbar.tsx';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchUser } from '../lib/actions/user.ts';

export default function UserMainPage() {
    
    const { username, date } = useParams() // Obtiene el username y la fecha pasada en la URL de la página
    const [userClient, setUserClient] = useState<UserType>({
        id: '',
        username: '',
        email: '',
        age: '',
        weight: '',
        height: '',
        goal: '',
        isTrainer: false,
    });

    useEffect(() => {
        const getUser = async (username: string) => {
            try {
                const data = await fetchUser(username);
                setUserClient(data); // Asigna los datos de los entrenamientos

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };
        if(username)
            getUser(username); 
        
    }, [username]);


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

    useEffect(() => {
        const fetchWorkouts = async (date: string, user_id: string) => {
            try {
                const data = await getCalendarWorkouts(date, user_id);
                setWorkoutList(data); // Asigna los datos de los entrenamientos
            } catch (error) {
                console.error('Error fetching workouts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts(activeStartDate, userClient.id);

    }, [activeStartDate, userClient]);

    // Actualiza el entrenamiento según la fecha actual
    useEffect(() => {
        // const localWorkout = localStorage.getItem(actualDate + userClient?.username || '');
        let foundWorkout
        //  = localWorkout ? JSON.parse(localWorkout) : null;
        const actualDateDATE = new Date(actualDate)
        const activeStartDateDATE = new Date(activeStartDate)        
        
        if(!foundWorkout) { // Si no se encuentra un entrenamiento para la fecha actual en local storage se busca en la lista fetcheada
            foundWorkout = workoutList.find((wod) => wod.date.includes(actualDate));        

            if(!foundWorkout && actualDateDATE < activeStartDateDATE) // Si se sigue sin encontrar y es más antiguo que la fecha mas temprana de fetcheo se actualiza y hace refetch.
                setActiveStartDate(actualDate)
        }
        console.log("FOUND "+JSON.stringify(foundWorkout))

        setWorkout({
            date: actualDate,
            type: foundWorkout?.type || '',
            blockList: foundWorkout?.blockList || [],
            comments: foundWorkout?.comments || '',
            modificable: foundWorkout ? false : true,
        });

    }, [actualDate, workoutList]);


    // Código de la seccion de comentarios
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <div className='w-screen'>
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
                <div className='w-full'>
                    <WorkoutPage user={userClient} workout={workout} setWorkout={setWorkout} expandedCalendarPanel={expandedCalendarPanel}/>
                    <CalendarSection user={userClient} workout={workout} setWorkout={setWorkout} workoutList={workoutList} setWorkoutList={setWorkoutList} expandedCalendarPanel={expandedCalendarPanel} setExpandedCalendarPanel={setExpandedCalendarPanel} activeStartDate={activeStartDate} setActiveStartDate={setActiveStartDate}/>
                </div>
                }
            </div>
        </div>
    )
}
