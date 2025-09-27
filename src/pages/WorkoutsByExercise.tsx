import { useEffect, useState } from 'react';
import Toolbar from '../components/Toolbar.tsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { fetchWorkoutsByExercise } from '../lib/actions/workout.ts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { exercises } from '../lib/exercises.json';
import ProgressChart from '../components/ProgressChart.tsx';
import { Card, CardContent } from '../components/ui/card.tsx';
import { BlockType, ExerciseType, WorkoutType } from '../lib/definitions.ts';


export default function WorkoutsByExercise() {    
    const { user } = useAuth()

    const [selectedExercise, setSelectedExercise] = useState<string>(() => {
        const localValue = user ? localStorage.getItem(user.username+' - selectedExercise - WBE') : null
        return localValue ? JSON.parse(localValue) : null
    });

    const [workoutList, setWorkoutList] = useState<WorkoutType[]>(() => {
        const localValue = user ? localStorage.getItem(user.username+' - workoutList - WBE') : null;
        return localValue ? JSON.parse(localValue) : []
    });

    function getMaxWeightByVolume(workout: WorkoutType, exerciseLabel: string) {
        let exerciseData = workout.blockList
          .flatMap((block: BlockType) => block.exerciseList)
          .filter((exercise: ExerciseType) => exercise.label === exerciseLabel);
      
        let volumeWeights: Record<number, number> = {};
      
        exerciseData.forEach((exercise: ExerciseType) => {
          const volume: number = Number(exercise.volume);
          const weight: number = Number(exercise.weight);
  
      
          if (!volumeWeights[volume] || volumeWeights[volume] < weight) {
            volumeWeights[volume] = weight;
          }
        });
      
        return volumeWeights;
    }

    useEffect(() => {
        const fetchWorkoutsByexercise = async (exerciseLabel: string) => {
            try {
                const data = await fetchWorkoutsByExercise(exerciseLabel);
                setWorkoutList(data);

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } 
        };
        fetchWorkoutsByexercise(selectedExercise);
        
    }, [selectedExercise]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(user.username+' - workoutList - WBE', JSON.stringify(workoutList));
            localStorage.setItem(user.username+' - selectedExercise - WBE', JSON.stringify(selectedExercise));
        }
    }, [workoutList]);

    console.log('selectedExercise: ', selectedExercise);
    console.log('workoutList: ', workoutList);

    return (
        <div className='w-screen'>
            <Toolbar />
            <div className='parent-section py-4 flex-col flex justify-center items-center'>
                <div className='header'>
                    <DropDownWithSearch onChange={(option: any) => setSelectedExercise(option.label)} options={exercises} text={selectedExercise ? selectedExercise : "Elegir Ejercicio..."} />
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
                                        {Object.entries(getMaxWeightByVolume(workout, selectedExercise)).map(([volume, weight]) => (
                                            <div className="text-left sm:text-right flex items-center space-x-2" key={volume}>
                                                <p className="font-semibold">{weight} kg</p>
                                                <p className="text-sm text-gray-500">x {volume} rep{volume === '1' || 's'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                }
                <ProgressChart exercise={selectedExercise} />
            </div>
        </div>
    )
}
