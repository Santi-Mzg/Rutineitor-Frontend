import DropDown from "./DropDown";
import DropDownWithSearch from "./DropDownWithSearch";
import { exercises } from '../lib/exercises.json';
import Exercise from "./Exercise";

export default function Block({ blockIndex, series, exerciseList, modificable, blockActions, exerciseActions }) {

    const addExercise = (exercise) => {
        blockActions.addExercise(blockIndex, exercise)
    }

    return (
        <>
            <div className="btn-group" style={{padding: '5px', margin: '3px', alignItems: 'center', fontWeight: 'bold'}}>
                <DropDown modificable={modificable} blockIndex={blockIndex} onClick={blockActions.updateSeries} options={[1, 2, 3, 4, 5, 6]}
                    text={series+" x"}
                />
                
            </div>
            <div className='btn-group-vertical'>
                <ul className='list' style={{borderLeft: '2px solid black', borderRadius: '15px 0 0 15px', padding: '10px', margin: '5px' }}>
                    {exerciseList && exerciseList.map((exercise, exerciseIndex) => {
                        
                        return (
                            <li key={exerciseIndex} style={{ marginBottom: '5px' }}>
                                <Exercise exercise={exercise} modificable={modificable} blockIndex={blockIndex} exerciseList={exerciseList} exerciseIndex={exerciseIndex}  exerciseActions={exerciseActions} />
                            </li>
                        )
                    })}
                    {modificable && <DropDownWithSearch onChange={addExercise} options={exercises} text={"Agregar Ejercicio..."} />}
                </ul>
            </div>
        </>
    )
}