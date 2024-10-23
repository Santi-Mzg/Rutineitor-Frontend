import React, { useEffect, useState } from 'react';
import DropDown from "./DropDown";
import DropDownWithSearch from "./DropDownWithSearch";
import { exercises } from '../utils/exercises.json';
import { arrayReps, arrayTime, arrayWeights } from '../utils/utils.js'

export default function Block({ blockIndex, series, exerciseList, modificable, addVolume, addExercise, addWeight, deleteExercise }) {

    return (
        <>
            {series + " x { "}
            <ul className="list">
                {exerciseList && exerciseList.map((exercise, exerciseIndex) => {
                    return (
                        <li key={exerciseIndex} style={{ marginBottom: '5px' }}>
                            <div className="btn-group">
                                <DropDown modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onClick={addVolume} options={exercise.isometric && arrayTime || arrayReps}
                                    text={exercise.volume === 0 && "*" ||
                                        exercise.isometric && exercise.volume !== "Max" && (exercise.volume + "s") ||
                                        (exercise.volume)}
                                />

                                {'\u00A0' + exercise.label + '\u00A0'}
                                {exercise.weighted &&
                                    <DropDown modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onClick={addWeight} options={exercise.weighted && arrayWeights}
                                        text={exercise.weight === null && "Lastre" ||
                                            exercise.weight === "Libre" && exercise.weight ||
                                            exercise.weight === "Banda" && ("con " + exercise.weight) ||
                                            ("con " + exercise.weight + " kg")}
                                    />}

                                {'\u00A0 \u00A0'}

                                {modificable && <button className="btn btn-danger" onClick={() => deleteExercise(blockIndex, exerciseIndex)}>X</button>}
                            </div>
                        </li>
                    )
                })}
                {modificable && <DropDownWithSearch onChange={addExercise} options={exercises} text={"Agregar Ejercicio..."} />}
            </ul>
        </>
    )
}