import React, { useEffect, useState } from 'react';
import Block from '../components/Block.jsx';
import Toolbar from '../components/Toolbar.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { arrayTypes, formatDate } from '../utils/utils.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPlus, faTrashAlt, faSave, faEdit, faCopy, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { useWorkout } from '../context/WorkoutContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';


export default function MainPage() {
    
    // Constantes
    const { user } = useAuth()
    const { workout, setWorkout, getWorkout, createOrUpdateWorkout, deleteWorkout } = useWorkout()
    const { date } = useParams() // Obtiene la fecha pasada en la URL de la página


    const todayDate = new Date() // Obtiene la fecha de hoy
    todayDate.setHours(0, 0, 0, 0)

    const actualDate = date ?? formatDate(todayDate) // Si date es undefined se iguala a todayDate

    const [modificable, setModificable] = useState(() => {
        const localState = localStorage.getItem(actualDate + user.username + "modificable")
        // if(localState) 
        //     return JSON.parse(localState)
        // else 
        //     return workout.blockList.length === 0 // True si no hay rutina, False si hay rutina
        return localState ? JSON.parse(localState) : true
    })  
    console.log("mod "+modificable)

    // Hooks de actualización
    useEffect(() => {
        getWorkout(actualDate);  // Invoca getWorkout cuando la página se carga o cambia la fecha
    }, [actualDate]);  

    useEffect(() => {
        // La función del estado se ejecutará cada vez que cambie la fecha cargando los estados correpondientes
        const localState = localStorage.getItem(actualDate + user.username + "modificable");
        if (localState) {
            setModificable(JSON.parse(localState));
        } else {
            setModificable(workout.blockList.length === 0);
        }
    }, [workout, actualDate])

    useEffect(() => { // Guarda la rutina cuando se modifica
        console.log("wod "+JSON.stringify(workout))
        localStorage.setItem(actualDate + user.username, JSON.stringify(workout))
    }, [workout])

    useEffect(() => { // Guarda el booleano modificable cuando se modifica
        localStorage.setItem(actualDate + user.username + "modificable", JSON.stringify(modificable))
    }, [modificable])


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
        const newBlock = {
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

    const updateSeries = (blockIndex, option) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].series = option
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    // const updateExerciseList = (blockIndex, newExerciseList) => {
    //     const updatedBlocks = [...workout.blockList]
    //     updatedBlocks[blockIndex].exerciseList = newExerciseList
    //     setWorkout(prevWorkout => ({
    //         ...prevWorkout,
    //         blockList: updatedBlocks
    //     }))
    // }

    const deleteBlock = (blockIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }


    // Funciones para manejo de ejercicios
    const addExerciseToBlock = (blockIndex, exercise) => {
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

    const addVolume = (blockIndex, exerciseIndex, volume) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].volume = volume
        console.log("volume "+volume)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addWeight = (blockIndex, exerciseIndex, weight) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].weight = weight
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const moveExerciseDown = (blockIndex, exerciseIndex) => {
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

    // Código de la seccion de comentarios

    const handleChange = (event) => {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        comments: event.target.value
    }));
    };

    const [expandedCommentPanel, setExpandedCommentPanel] = useState(false);

    const toggleCommentPanel = () => {
        setExpandedCommentPanel(!expandedCommentPanel);
    };

    // Código de la seccion del calendario
    const [expandedCalendarPanel, setExpandedCalendarPanel] = useState(false);

    const toggleCalendarPanel = () => {
        setExpandedCalendarPanel(!expandedCalendarPanel);
    };

    const saveWorkout = () => {
        if (modificable)
            createOrUpdateWorkout(workout)
        setModificable(!modificable)
    }

    const copyWorkout = () => {
        localStorage.setItem(user.username + "clipboard", JSON.stringify(workout))
    }

    const pasteWorkout = () => {
        const prevWorkout = workout
        const clipboardType = localStorage.getItem(user.username + "clipboard").type
        const clipboardBlocklist = localStorage.getItem(user.username + "clipboard").blockList

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: clipboardType ? JSON.parse(clipboardType) : prevWorkout.type,
            blockList: clipboardBlocklist ? JSON.parse(clipboardBlocklist) : prevWorkout.blockList
        }))
    }

    const cleanWorkout = () => {
        deleteWorkout(actualDate)
        setModificable(true)
        // setWorkout(prevWorkout => ({
        //     ...prevWorkout,
        //     type: null,
        //     blockList: [],
        //     modificable: true,
        // }))
        // setCommentText('')
        // localStorage.removeItem(workout.date + "tipo")
        // localStorage.removeItem(workout.date + "blocklist")
        // localStorage.removeItem(workout.date + "modificable")
        // localStorage.removeItem(workout.date + "comments")
    }


    // Función del calendario
    const navigate = useNavigate()

    const handleDateClick = date => {
        if (date.getTime() === todayDate.getTime()) {
            navigate(`/workout`)
        }
        else {
            const formattedDate = formatDate(date)
            navigate(`/workout/${formattedDate}`)
        }
    }

    const tileClassName = ({ date, view }) => {

        // Check if the tile represents the current date
        const formattedDate = formatDate(date)

        if (view === 'month' && formattedDate === workout.date) {
            // Return the class name for the selected date
            return 'selected-day';
        }
        else if (view === 'month' && date.getTime() === todayDate.getTime()) {
            // Return the class name for the current date
            return 'current-day';
        }
        // else {
        //     const localValue = localStorage.getItem(formattedDate + user.username + "type")
        //     const parseValue = localValue ? JSON.parse(localValue) : ""

        //     if (view === 'month' && parseValue && parseValue.length > 0) {
        //         return 'workout-day';
        //     }
        // };
        return null;
    }

    return (
        <>
            <Toolbar />
            <div className='parent-section'>
                <div className='header'>
                    <h2>Entrenamiento del Día:</h2>
                    <h2 style={{ color: '#f3969a', fontWeight: 'bold', textAlign: 'center' }}>{workout.type}</h2>
                    <button className='more-info-button' onClick={toggleCommentPanel}><FontAwesomeIcon icon={faComment} style={{fontSize: '30px', color: 'khaki'}} /></button>
                </div>
                {expandedCommentPanel && 
                <div>
                    <textarea
                        className='comment-panel'
                        value={commentText}
                        onChange={handleChange}
                        placeholder="Comentarios sobre la rutina..."
                    />
                </div>
                ||
                <>
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
                                                modificable={modificable}
                                                updateSeries={updateSeries}
                                                addVolume={addVolume}
                                                addExercise={(exercise) => addExerciseToBlock(blockIndex, exercise)}
                                                addWeight={addWeight}
                                                moveExerciseDown={moveExerciseDown}
                                                moveExerciseUp={moveExerciseUp}
                                                deleteExercise={deleteExerciseFromBlock} />
                                        </div>
                                        {modificable && 
                                            <div>
                                                <button className="btn btn-danger" onClick={() => deleteBlock(blockIndex)}><FontAwesomeIcon icon={faTrashAlt} style={{fontSize: '15px'}} /></button>
                                                <button className="btn btn-success" onClick={() => addBlock(blockIndex + 1)}><FontAwesomeIcon icon={faPlus} style={{fontSize: '15px'}} /></button>
                                            </div>
                                        }
                                    </li>
                                )
                            })}
                            {modificable && !workout.type && <DropDownWithSearch onChange={createWorkout} options={arrayTypes} text="Crear..." />}                        
                        </ul>
                    </div>
                    {expandedCalendarPanel &&
                    <div className='calendar-panel'>
                        <button className="panel-button" type="button" onClick={toggleCalendarPanel} >{"v"}</button>
                        <div className='btn-group text-white' style={{ width: '50vh'}}>
                            <button className="big-button" type="button" onClick={saveWorkout}><FontAwesomeIcon icon={(modificable && faSave || faEdit)} style={{fontSize: '30px'}} /></button>
                            <button className="big-button" type="button" onClick={copyWorkout}><FontAwesomeIcon icon={faCopy} style={{fontSize: '30px'}} /></button>
                            <button className="big-button" type="button" onClick={pasteWorkout}><FontAwesomeIcon icon={faClipboard} style={{fontSize: '30px'}} /></button>
                            <button className="big-button" type="button" onClick={cleanWorkout}><FontAwesomeIcon icon={faTrashAlt} style={{fontSize: '30px'}} /></button>
                        </div>
                        <Calendar
                            onClickDay={handleDateClick}
                            tileClassName={tileClassName}
                        />
                    </div>  
                    || 
                    <button className="panel-button" type="button" onClick={toggleCalendarPanel} style={{ position: 'fixed', bottom: '0'}}>{"^"}</button>
                    }
                </>
                }
            </div>
        </>
    )
}

