import { useEffect, useState } from 'react';
import { WorkoutType } from '../lib/definitions.ts';
import { arrayTypes } from '../lib/utils.js';
import Toolbar from '../components/Toolbar.tsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { fetchWorkoutsByType } from '../lib/actions/workout.ts';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, CardContent } from '../components/ui/card.tsx';

export default function WorkoutsByType() {    
    const { user } = useAuth()
    const [selectedType, setSelectedType] = useState<string>(() => {
        const localValue = user ? localStorage.getItem(user.username+'selectedType') : null
        return localValue ? JSON.parse(localValue) : ''
    });
    const [workoutList, setWorkoutList] = useState<WorkoutType[]>(() => {
        const localValue = user ? localStorage.getItem(user.username+'workoutList') : null
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
        if(user) {
            localStorage.setItem(user?.username+'workoutList', JSON.stringify(workoutList));
            localStorage.setItem(user?.username+'selectedType', JSON.stringify(selectedType));
        }
    }, [workoutList]);

    return (
        <div className='w-screen'>
            <Toolbar />
            <div className='parent-section py-4 flex-col'>
                <div className='header'>
                    {selectedType!=='' && <DropDownWithSearch onChange={selectType} options={arrayTypes} text="Elegir Ejercicio..." />}
                    <h2 className='py-2' style={{ color: '#f3969a', fontWeight: 'bold', textAlign: 'center' }}>{selectedType}</h2>
                </div>
                <Card>
                    <CardContent>
                        <div className="space-y-4">
                            {workoutList.map((workout, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 space-y-2 sm:space-y-0"
                                    >
                                    <div>
                                        <h4 className="font-semibold">{(workout.date).slice(0, 10)}</h4>
                                    </div>
                                    <div className="text-left sm:text-right flex items-center space-x-2">
                                        <p className="font-semibold">{workout.blockList[0].exerciseList[0].weight} kg x</p>
                                        <p className="text-sm text-gray-500">{workout.blockList[0].exerciseList[0].volume} reps</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
