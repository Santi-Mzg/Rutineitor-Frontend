import React, { useEffect, useState } from 'react';
import { WorkoutType } from '../lib/definitions.ts';
import Toolbar from '../components/Toolbar.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import { fetchWorkoutsByExercise } from '../lib/actions.ts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { exercises } from '../lib/exercises.json';
import ProgressChart from '../components/ProgressChart.tsx.tsx';


export default function WorkoutsByExercise() {    
    const { user } = useAuth()
    const [selectedExercise, setSelectedExercise] = useState<string>(() => {
        const localValue = localStorage.getItem(user.username+'selectedExercise')
        return localValue ? JSON.parse(localValue) : ''
    });
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>(() => {
        const localValue = localStorage.getItem(user.username+'workoutList')
        return localValue ? JSON.parse(localValue) : []
    });
    const selectExercise = (option) => {
        setSelectedExercise(option.label);
    }

    useEffect(() => {
        const fetchWorkoutsByexercise = async (date: string) => {
            try {
                const data = await fetchWorkoutsByExercise(date);
                setWorkoutList(data);

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } 
        };
        fetchWorkoutsByexercise(selectedExercise);
        
    }, [selectedExercise]);

    useEffect(() => {
        localStorage.setItem(user.username+'workoutList', JSON.stringify(workoutList));
        localStorage.setItem(user.username+'selectedExercise', JSON.stringify(selectedExercise));
    }, [workoutList]);

    return (
        <>
            <Toolbar />
            <DropDownWithSearch onChange={selectExercise} options={exercises} text="Elegir Ejercicio..." /> 
            <ul className='list'>
                {(workoutList).map((workout, index) => {
                    return (
                        <li key={index} style={{ marginBottom: '30px' }}>
                            <Link to={`/workout/${(workout.date).slice(0, 10)}`} style={{ textDecoration: 'none' }}>
                                <div className='btn-group' style={{padding: '10px', margin: '5px'}}>
                                    <WorkoutCard
                                        workout={workout} 
                                    />
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <ProgressChart exercise={selectedExercise} />
        </>
    )
}
