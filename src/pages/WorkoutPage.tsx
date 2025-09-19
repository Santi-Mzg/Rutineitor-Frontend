import { useEffect } from 'react';
import Block from '../components/Block.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import 'react-calendar/dist/Calendar.css';
import { arrayTypes } from '../lib/utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ExerciseType, BlockType, UserType, WorkoutType } from '../lib/definitions.ts';

type WorkoutPageProps = {
    user: UserType;
    workout: WorkoutType;
    setWorkout: React.Dispatch<React.SetStateAction<WorkoutType>>;
    expandedCalendarPanel: boolean;
};

export default function WorkoutPage({ user, workout, setWorkout, expandedCalendarPanel }: WorkoutPageProps) {

    useEffect(() => { // Guarda la rutina cuando se modifica
        localStorage.setItem(workout.date + user.username, JSON.stringify(workout))
    }, [workout])

    useEffect(() => {
        const savedWorkout = localStorage.getItem(workout.date + user.username);
        if (savedWorkout) {
            setWorkout(JSON.parse(savedWorkout));
        }
    }, []);

    // Funciones de la rutina
    // Funciones para manejo de bloques
    const createWorkout = (option: any) => {
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            type: option.value
        }));
        addBlock(0)
    }

    const addBlock = (blockIndex: number) => {
        const newBlock: BlockType = {
            series: 3,
            exerciseList: [],
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 0, newBlock)
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }

    const deleteBlock = (blockIndex: number) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 1)
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }

// Block actions
    const updateSeries = (blockIndex: number, exerciseIndex: number, option: any) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].series = option
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addExerciseToBlock = (blockIndex: number, exercise: ExerciseType) => {
        const newExercise = {
            label: exercise.label,
            isometric: exercise.isometric? exercise.isometric : false,
            weighted: exercise.weighted? exercise.weighted : false,
            volume: "",
            weight: "",
            // time: "",
            // distance: "",
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.push(newExercise)
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const blockActions = {
        updateSeries,
        addExercise: addExerciseToBlock,
    }  
    

    // Exercise actions

    const addVolume = (blockIndex: number, exerciseIndex: number, volume: string) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].volume = volume
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addWeight = (blockIndex: number, exerciseIndex: number, weight: string) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].weight = weight
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }
    
    // const addDistance = (blockIndex: number, exerciseIndex: number, distance: string) => {
    //     const updatedBlocks = [...workout.blockList]
    //     updatedBlocks[blockIndex].exerciseList[exerciseIndex].distance = distance
    //     setWorkout(prevWorkout => ({
    //         ...prevWorkout,
    //         blockList: updatedBlocks
    //     }))
    // }

    // const addTime = (blockIndex: number, exerciseIndex: number, time: string) => {
    //     const updatedBlocks = [...workout.blockList]
    //     updatedBlocks[blockIndex].exerciseList[exerciseIndex].time = time
    //     setWorkout(prevWorkout => ({
    //         ...prevWorkout,
    //         blockList: updatedBlocks
    //     }))
    // }


    const moveExerciseDown = (blockIndex: number, exerciseIndex: number) => {
        if(exerciseIndex < workout.blockList[blockIndex].exerciseList.length - 1) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex + 1]
            updatedExercises[exerciseIndex + 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout((prevWorkout: any) => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }
        
    }

    const moveExerciseUp = (blockIndex: number, exerciseIndex: number) => {
        if(exerciseIndex > 0) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex - 1]
            updatedExercises[exerciseIndex - 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout((prevWorkout: any) => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }   
    }

    const deleteExerciseFromBlock = (blockIndex: number, exerciseIndex: number) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.splice(exerciseIndex, 1)
        setWorkout((prevWorkout: any) => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const exerciseActions = {
        addVolume,
        addWeight,
        // addDistance,
        // addTime,
        moveExerciseDown,
        moveExerciseUp,
        deleteExercise: deleteExerciseFromBlock,
    }  


    return (
        <div className={expandedCalendarPanel ? 'routine-section-reduced' : 'routine-section-expanded'}>
            <ul className='list'>
                {(workout.blockList).map((block: BlockType, blockIndex: number) => {
                    return (
                        <li key={blockIndex} style={{ marginBottom: '30px' }}>
                            <div className='btn-group' style={{padding: '10px', margin: '5px'}}>
                                <Block
                                    {...block}
                                    blockIndex={blockIndex}
                                    series={block.series}
                                    exerciseList={block.exerciseList}
                                    modificable={workout.modificable}
                                    blockActions={blockActions}
                                    exerciseActions={exerciseActions} />
                            </div>
                            {workout.modificable && 
                                <div>
                                    <button className="btn btn-danger" onClick={() => deleteBlock(blockIndex)}><FontAwesomeIcon icon={faTrashAlt} style={{fontSize: '15px'}} /></button>
                                    <button className="btn btn-success" onClick={() => addBlock(blockIndex + 1)}><FontAwesomeIcon icon={faPlus} style={{fontSize: '15px'}} /></button>
                                </div>
                            }
                        </li>
                    )
                })}
                {workout.modificable && !workout.type && <DropDownWithSearch onChange={createWorkout} options={arrayTypes} text="Crear..." />}                        
            </ul>
        </div>
    )
}


