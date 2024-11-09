import React from 'react';
import DropDown from "./DropDown";
import DropDownWithSearch from "./DropDownWithSearch";
import TextArea from './TextArea.jsx';
import { exercises } from '../utils/exercises.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Block({ blockIndex, series, exerciseList, modificable, updateSeries, addVolume, addExercise, addWeight, moveExerciseDown, moveExerciseUp, deleteExercise }) {

    const optionsVolumeNaN = ["Max", "RIR-1", "RIR-2"]
    const optionsWeigthNaN = ["Libre", "Banda Sup", "Banda Res"]

    return (
        <>
            <div className="btn-group" style={{padding: '5px', margin: '3px', alignItems: 'center', fontWeight: 'bold'}}>
                <DropDown modificable={modificable} blockIndex={blockIndex} onClick={updateSeries} options={[1, 2, 3, 4, 5, 6]}
                    text={series+" x"}
                />
                
            </div>
            <div className='btn-group-vertical'>
                <ul className='list' style={{borderLeft: '2px solid black', borderRadius: '15px 0 0 15px', padding: '10px', margin: '5px' }}>
                    {exerciseList && exerciseList.map((exercise, exerciseIndex) => {
                        
                        const weightNaN = optionsWeigthNaN.includes(exercise.weight)
                        return (
                            <li key={exerciseIndex} style={{ marginBottom: '5px' }}>
                                <div className='btn-group' style={{display: 'flex', flexWrap: 'wrap', marginBottom: '5px'}}>
                                    <TextArea style={{ height: '25px', width: '40px', backgroundColor: 'white', textAlign: 'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={addVolume} placeholder={"*"} options={exercise.isometric && ["Max"] || optionsVolumeNaN}
                                        value={exercise.volume}
                                    />

                                    {(exercise.isometric && exercise.volume !== "" && exercise.volume !== "Max" && "s " || '\u00A0') + exercise.label + '\u00A0'}
                                    
                                    {exercise.weighted && (exercise.weight !== "" && exercise.weight !== "Libre" && "con" + '\u00A0' )}
                                    {exercise.weighted &&
                                    <TextArea style={{ height: '25px', width: weightNaN?'80px':'35px', backgroundColor: 'white', textAlign: weightNaN?'left':'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={addWeight} placeholder={"+"} options={exercise.weighted && optionsWeigthNaN}
                                    value={exercise.weight}
                                    />}
                                    {exercise.weighted && (exercise.weight !== "" && exercise.weight !== "Libre" && exercise.weight !== "Banda Sup" && exercise.weight !== "Banda Res" && "kg" )}

                                    {'\u00A0 \u00A0'}

                                    
                                </div>
                                {modificable && 
                                    <div>
                                        {(exerciseIndex < exerciseList.length - 1) && 
                                        <button className="btn btn-success" onClick={() => moveExerciseDown(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowDown} style={{fontSize: '15px'}} /></button>}
                                        {(exerciseIndex > 0) &&
                                        <button className="btn btn-success" onClick={() => moveExerciseUp(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowUp} style={{fontSize: '15px'}} /></button>}
                                        <button className="btn btn-danger" onClick={() => deleteExercise(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faTrash} style={{fontSize: '15px'}} /></button>
                                    </div>
                                }
                            </li>
                        )
                    })}
                    {modificable && <DropDownWithSearch onChange={addExercise} options={exercises} text={"Agregar Ejercicio..."} />}
                </ul>
            </div>
        </>
    )
}