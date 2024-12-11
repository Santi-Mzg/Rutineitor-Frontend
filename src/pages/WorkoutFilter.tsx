import React, { useEffect, useState } from 'react';
import { WorkoutType } from '../lib/definitions.ts';
import { arrayTypes } from '../utils/utils.js';
import Toolbar from '../components/Toolbar.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';
import { fetchWorkoutsByType } from '../lib/actions.ts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function WorkoutFilter() {    
    const { user } = useAuth()
    const [selectedType, setSelectedType] = useState<string>(() => {
        const localValue = localStorage.getItem(user.username+'selectedType')
        return localValue ? JSON.parse(localValue) : ''
    });
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>(() => {
        const localValue = localStorage.getItem(user.username+'workoutList')
        return localValue ? JSON.parse(localValue) : []
    });
    const selectType = (option) => {
        setSelectedType(option.value);
    }

    useEffect(() => {
        const fetchWorkoutsBytype = async (date: string) => {
            try {
                const data = await fetchWorkoutsByType(date);
                console.log("WODS "+JSON.stringify(data))
                setWorkoutList(data);

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } 
        };
        fetchWorkoutsBytype(selectedType);
        
    }, [selectedType]);

    useEffect(() => {
        localStorage.setItem(user.username+'workoutList', JSON.stringify(workoutList));
        localStorage.setItem(user.username+'selectedType', JSON.stringify(selectedType));
    }, [workoutList]);

    return (
        <>
            <Toolbar />
            <DropDownWithSearch onChange={selectType} options={arrayTypes} text="Elegir Tipo..." /> 
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
        </>
    )
}
