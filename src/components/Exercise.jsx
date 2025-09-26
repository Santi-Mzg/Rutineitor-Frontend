import TextArea from './TextArea.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Exercise({ exercise, modificable, blockIndex, exerciseList, exerciseIndex, exerciseActions }) {

    const intInvalid = /[^0-9]/g; // Enteros o vacío
    const floatInvalid = /[^0-9.]|(?<=\..*)\.|(?<=\.\d{2})\d/g; // Decimales con hasta 2 dígitos o vacío
    const timeInvalid = /[^0-9:]|(?<=:.*:.*):|(?<=^\d{2}\d)/g; // Formato MM:SS o vacío
    
    function calcularKmPorMin(tiempo, distancia) {
        const [hh, mm, ss] = tiempo.split(":").map(Number);
        const minutosTotales = hh * 60 + mm + ss / 60;
        const promedio = Math.round(minutosTotales / distancia) * 100 / 100;

        const mmRet = Math.floor(promedio);
        const segundos = Math.round((promedio - Math.floor(promedio)) * 60);
        const ssRet = String(segundos).padStart(2, '0');

        console.log(promedio);
        console.log(segundos);
        console.log(ssRet);
        return `${mmRet}:${ssRet}`;
    }

    if(exercise.label==='Correr') {
        const timePerKm = calcularKmPorMin(exercise.volume, exercise.weight) || ''
        return (
            <>
                <div className='btn-group' style={{display: 'flex', flexWrap: 'wrap', marginBottom: '5px'}}>
                    
                    {exercise.label+ ":"}
                    {'\u00A0 \u00A0'}
                    {"Distancia: "}
                    <TextArea style={{ height: '25px', width: '50px', backgroundColor: 'white', textAlign: 'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={exerciseActions.addWeight} placeholder={"*"} options={[]} regex={floatInvalid}
                        value={exercise.weight}
                    />
                    {"Km"}
                
                    {'\u00A0 \u00A0'}
                    {"Tiempo: "}
                    <TextArea style={{ height: '25px', width: '70px', backgroundColor: 'white', textAlign: 'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={exerciseActions.addVolume} placeholder={"00:00:00"} options={[]} regex={timeInvalid}
                        value={exercise.volume}
                    />

                    {"( " + (timePerKm !== 'NaN' && timePerKm !== 'Infinity' ? timePerKm + " min/km" : "* min/km") + " )"}
                </div>
                {modificable && 
                    <div>
                        {(exerciseIndex < exerciseList.length - 1) && 
                        <button className="btn btn-success" onClick={() => exerciseActions.moveExerciseDown(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowDown} style={{fontSize: '15px'}} /></button>}
                        {(exerciseIndex > 0) &&
                        <button className="btn btn-success" onClick={() => exerciseActions.moveExerciseUp(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowUp} style={{fontSize: '15px'}} /></button>}
                        <button className="btn btn-danger" onClick={() => exerciseActions.deleteExercise(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faTrash} style={{fontSize: '15px'}} /></button>
                    </div>
                }
            </>
        )

    } else 
        return (
            <>
                <div className='btn-group' style={{display: 'flex', flexWrap: 'wrap', marginBottom: '5px'}}>
                    <TextArea style={{ height: '25px', width: '50px', backgroundColor: 'white', textAlign: 'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={exerciseActions.addVolume} placeholder={"*"} options={["Max"]} regex={intInvalid}
                        value={exercise.volume}
                    />

                    {(exercise.isometric && exercise.volume !== "" && exercise.volume !== "Max" && "s " || '\u00A0') + exercise.label + '\u00A0'}
                    
                    {exercise.weighted && (exercise.weight !== "" && exercise.weight !== "Libre" && "con" + '\u00A0' )}
                    {exercise.weighted &&
                        <TextArea style={{ height: '25px', width: exercise.weight === "Libre"?'80px':'35px', backgroundColor: 'white', textAlign: exercise.weight === "Libre"?'left':'center'}} modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onChange={exerciseActions.addWeight} placeholder={"+"} options={exercise.weighted && ["Libre"]} regex={floatInvalid}
                            value={exercise.weight}
                        />
                    }
                    {exercise.weighted && (exercise.weight !== "" && exercise.weight !== "Libre" && "kg" )}

                    {'\u00A0 \u00A0'}
                </div>
                {modificable && 
                    <div>
                        {(exerciseIndex < exerciseList.length - 1) && 
                        <button className="btn btn-success" onClick={() => exerciseActions.moveExerciseDown(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowDown} style={{fontSize: '15px'}} /></button>}
                        {(exerciseIndex > 0) &&
                        <button className="btn btn-success" onClick={() => exerciseActions.moveExerciseUp(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faArrowUp} style={{fontSize: '15px'}} /></button>}
                        <button className="btn btn-danger" onClick={() => exerciseActions.deleteExercise(blockIndex, exerciseIndex)}><FontAwesomeIcon icon={faTrash} style={{fontSize: '15px'}} /></button>
                    </div>
                }
            </>
        )
}