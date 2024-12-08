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
import { useAuth } from '../context/AuthContext.jsx';
import { ExerciseType, BlockType , WorkoutType } from '../lib/definitions.ts';
import { createOrUpdateWorkout, deleteWorkout } from '../lib/actions.ts';


export default function WorkoutPage( {workout, setWorkout} ) {

    
    // Código de la seccion de comentarios

    const handleChange = (event) => {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        comments: event.target.value
    }));
    };

    const [expandedCommentPanel, setExpandedCommentPanel] = useState<boolean>(false);

    const toggleCommentPanel = () => {
        setExpandedCommentPanel((prevState => !prevState));
    };

    return (
        <>
            <div className='header'>
                <h2>Entrenamiento del Día:</h2>
                <h2 style={{ color: '#f3969a', fontWeight: 'bold', textAlign: 'center' }}>{workout.type}</h2>
                <button className='more-info-button' onClick={toggleCommentPanel}><FontAwesomeIcon icon={faComment} style={{fontSize: '30px', color: 'khaki', zIndex: 1}} /></button>
            </div>
            {expandedCommentPanel && 
            <div>
                <textarea
                    className='comment-panel'
                    value={workout.comments}
                    onChange={handleChange}
                    placeholder="Comentarios..."
                />
            </div>
            }
        </>
    )
}


