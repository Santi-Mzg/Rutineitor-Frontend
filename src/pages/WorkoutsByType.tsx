import { useEffect, useState } from 'react';
import { arrayTypes } from '../lib/utils.ts';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { fetchWorkoutsByType } from '../lib/actions/workout.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { Card, CardContent } from '../components/ui/card.tsx';
import {  WorkoutType } from '../lib/definitions.ts';
import { Link } from 'react-router-dom';

export default function WorkoutsByType() {    
    const { user } = useAuth()

    const [selectedType, setSelectedType] = useState<string>(() => {
        const localValue = user ? localStorage.getItem(user.username+'selectedType') : null
        return localValue ? JSON.parse(localValue) : null
    });

    const [workoutList, setWorkoutList] = useState(() => {
        const localValue = user ? localStorage.getItem(user.username+'workoutList') : null
        return localValue ? JSON.parse(localValue) : []
    });

    useEffect(() => {
        const fetchWorkoutsBytype = async (type: string) => {
            try {
                const data = await fetchWorkoutsByType(type);
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
            <div className='parent-section py-4 flex-col flex justify-center items-center'>
                <div className='header'>
                    <DropDownWithSearch onChange={(option: any) => setSelectedType(option.value)} options={arrayTypes} text={selectedType ? selectedType : "Elegir Entrenamiento..."} />
                </div>
                {workoutList.length === 0 && <h2 className='text-black py-2'>Sin registros</h2> 
                ||
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                            {workoutList.map((workout: WorkoutType, index: number) => (
                                <Link to={`/workout/${(workout.date).slice(0, 10)}`} key={index}>
                                    <div className="rounded-lg border p-4 flex flex-col space-y-2 sm:space-y-0">
                                        <div>
                                            <h4 className="font-semibold">{(workout.date).slice(0, 10)}</h4>
                                        </div>
                                        <div className="text-left sm:text-right flex items-center space-x-2">
                                            <p className="font-semibold">{workout.blockList[0].exerciseList[0].weight} kg x</p>
                                            <p className="text-sm text-gray-500">{workout.blockList[0].exerciseList[0].volume} reps</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                }
            </div>
        </div>
    )
}
