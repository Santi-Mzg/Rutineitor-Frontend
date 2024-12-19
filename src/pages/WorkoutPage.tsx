import React, { useEffect } from 'react';
import Block from '../components/Block.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import 'react-calendar/dist/Calendar.css';
import { arrayTypes } from '../lib/utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ExerciseType, BlockType } from '../lib/definitions.ts';

export default function WorkoutPage( {user, workout, setWorkout, expandedCalendarPanel} ) {

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
    const createWorkout = (option) => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: option.value
        }));
        addBlock(0)
    }

    const addBlock = (blockIndex) => {
        const newBlock: BlockType = {
            series: 3,
            exerciseList: [],
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 0, newBlock)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }

    const updateSeries = (blockIndex, exerciseIndex, option) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].series = option
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const deleteBlock = (blockIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }


    // Funciones para manejo de ejercicios
    const addExerciseToBlock = (blockIndex: number, exercise: ExerciseType) => {
        const newExercise = {
            label: exercise.label,
            isometric: exercise.isometric,
            weighted: exercise.weighted,
            volume: "",
            weight: "",
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.push(newExercise)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addVolume = (blockIndex: number, exerciseIndex: number, volume: string) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].volume = volume
        console.log("volume "+volume)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addWeight = (blockIndex: number, exerciseIndex: number, weight: string) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].weight = weight
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const moveExerciseDown = (blockIndex: number, exerciseIndex: number) => {
        if(exerciseIndex < workout.blockList[blockIndex].exerciseList.length - 1) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex + 1]
            updatedExercises[exerciseIndex + 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout(prevWorkout => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }
        
    }

    const moveExerciseUp = (blockIndex, exerciseIndex) => {
        if(exerciseIndex > 0) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex - 1]
            updatedExercises[exerciseIndex - 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout(prevWorkout => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }   
    }

    const deleteExerciseFromBlock = (blockIndex, exerciseIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.splice(exerciseIndex, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }


    return (
        <div className={expandedCalendarPanel ? 'routine-section-reduced' : 'routine-section-expanded'}>
            <ul className='list'>
                {(workout.blockList).map((block, blockIndex) => {
                    return (
                        <li key={blockIndex} style={{ marginBottom: '30px' }}>
                            <div className='btn-group' style={{padding: '10px', margin: '5px'}}>
                                <Block
                                    {...block}
                                    blockIndex={blockIndex}
                                    series={block.series}
                                    exerciseList={block.exerciseList}
                                    modificable={workout.modificable}
                                    updateSeries={updateSeries}
                                    addVolume={addVolume}
                                    addExercise={(exercise) => addExerciseToBlock(blockIndex, exercise)}
                                    addWeight={addWeight}
                                    moveExerciseDown={moveExerciseDown}
                                    moveExerciseUp={moveExerciseUp}
                                    deleteExercise={deleteExerciseFromBlock} />
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


