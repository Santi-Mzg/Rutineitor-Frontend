import { useEffect, useState } from 'react';
import Toolbar from '../components/Toolbar.tsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { fetchWorkoutsByExercise } from '../lib/actions/workout.ts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { exercises } from '../lib/exercises.json';
import ProgressChart from '../components/ProgressChart.tsx';
import { Card, CardContent } from '../components/ui/card.tsx';


export default function WorkoutsByExercise() {    
    const { user } = useAuth()

    const [selectedExercise, setSelectedExercise] = useState<string>(() => {
        const localValue = user ? localStorage.getItem(user.username+'selectedExercise') : null
        return localValue ? JSON.parse(localValue) : ''
    });

    const [workoutList, setWorkoutList] = useState(() => {
        const localValue = user ? localStorage.getItem(user.username+'workoutList') : null;
        return localValue ? JSON.parse(localValue) : []
    });

    const selectExercise = (option) => {
        setSelectedExercise(option.label);
    }

    function getMaxWeightByVolume(workout, exerciseLabel) {
        let exerciseData = workout.blockList
          .flatMap(block => block.exerciseList)
          .filter(exercise => exercise.label === exerciseLabel);
      
        let volumeWeights = {};
      
        exerciseData.forEach(exercise => {
          const volume = exercise.volume;
          const weight = parseInt(exercise.weight, 10);
      
          if (!volumeWeights[volume] || volumeWeights[volume] < weight) {
            volumeWeights[volume] = weight;
          }
        });
      
        return volumeWeights;
    }

    useEffect(() => {
        const fetchWorkoutsByexercise = async (exercise) => {
            try {
                const data = await fetchWorkoutsByExercise(exercise);
                setWorkoutList(data);

            } catch (error) {
                console.error('Error fetching workouts:', error);
            } 
        };
        fetchWorkoutsByexercise(selectedExercise);
        
    }, [selectedExercise]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(user.username+'workoutList', JSON.stringify(workoutList));
            localStorage.setItem(user.username+'selectedExercise', JSON.stringify(selectedExercise));
        }
    }, [workoutList]);

    console.log('selectedExercise: ', selectedExercise);
    console.log('workoutList: ', workoutList);

    return (
        <div className='w-screen'>
            <Toolbar />
            <div className='parent-section py-4 flex-col flex justify-center items-center'>
                <div className='header'>
                    <DropDownWithSearch onChange={selectExercise} options={exercises} text={selectedExercise} />
                </div>
                {workoutList.length === 0 && <h2 className='text-black py-2'>Sin registros</h2> 
                ||
                <Card>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
                            {workoutList.map((workout, index) => (
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
