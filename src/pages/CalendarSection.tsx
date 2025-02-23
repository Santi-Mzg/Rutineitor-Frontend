import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSave, faEdit, faCopy, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { createOrUpdateWorkout, deleteWorkout } from '../lib/actions/workout.ts';
import { formatDate } from '../lib/utils.ts';


export default function CalendarSection({ user, workout, setWorkout, workoutList, setWorkoutList, expandedCalendarPanel, setExpandedCalendarPanel, activeStartDate, setActiveStartDate}) {


    const navigate = useNavigate()
    const todayDate = new Date()
    const [dateParam, setDateParam] = useState(new Date())


    
    useEffect(() => {
        if (dateParam < new Date(activeStartDate)) {
            setActiveStartDate(formatDate(dateParam));
        }
    }, [dateParam]);



    const handleDateClick = date => {
        
        console.log("Calendar ")
        if (date.getTime() === todayDate.getTime()) {
            navigate(`/workout`)
        }
        else {
            const formattedDate = formatDate(date)
            navigate(`/workout/${formattedDate}`)
        }
    }

    const handleViewChange = event => {
        setDateParam(event.activeStartDate)
    }
    
    const toggleCalendarPanel = () => {
        setExpandedCalendarPanel((prevState => !prevState));
    };

    const saveOrEditWorkout = () => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            modificable: !prevWorkout.modificable
        })) 

        if (workout.modificable && workout.type !== '' && workout.blockList[0].exerciseList.length > 0) {
            createOrUpdateWorkout(workout, user._id)
            
            setWorkoutList(prevWorkoutList => {
                const updatedWorkoutList = [...prevWorkoutList, workout];
                return updatedWorkoutList;
            });
        }
    }

    const copyWorkout = () => {
        localStorage.setItem(user.username + "clipboard", JSON.stringify(workout))
    }

    const pasteWorkout = () => {
        const clipboardWorkoutJSON = localStorage.getItem(user.username + "clipboard")
        const clipboardWorkout = clipboardWorkoutJSON ? JSON.parse(clipboardWorkoutJSON) : null

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: clipboardWorkout ? clipboardWorkout.type : prevWorkout.type,
            blockList: clipboardWorkout ? clipboardWorkout.blockList : prevWorkout.blockList
        }))
    }

    const cleanWorkout = () => {
        localStorage.removeItem(workout.date + user.username)
        deleteWorkout(workout.date, user._id)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: '',
            blockList: [],
            modificable: true,
            comments: ''
        }))
        setWorkoutList(prevWorkoutList => {
            const updatedWorkoutList = [...prevWorkoutList].filter(wod => wod.date !== workout.date);
            return updatedWorkoutList;
        });
    }

    const tileClassName = ({ date, view }) => {

        // Check if the tile represents the current date
        const formattedDate = formatDate(date)

        if(view === 'month') {
            if (formattedDate === workout.date) {
                // Return the class name for the selected date
                return 'selected-day';
            }
            else if (formattedDate === formatDate(todayDate)) {
                // Return the class name for the current date
                return 'current-day';
            }
            else {
                    const foundWorkout = workoutList.find(workout => workout.date.includes(formattedDate))

                    if (foundWorkout) {
                        switch (foundWorkout.type) {
                            case 'Fullbody':
                                return 'fullbody-day';
                            case 'Empuje':
                                return 'push-day';
                            case 'Tire':
                                return 'pull-day';
                            case 'Pierna':
                                return 'leg-day';
                            case 'Skills':
                                return 'skill-day';
                            case 'Movilidad':
                                return 'mobility-day';
                            case 'Core':
                                return 'core-day';
                            case 'Potencia':
                                return 'power-day';
                            case 'Cardio':
                                return 'cardio-day';
                    }
                }
            }
        }
        return null;
    }

    return (
        <>
            {expandedCalendarPanel &&
            <div className='calendar-panel'>
                <button className="panel-button" type="button" onClick={toggleCalendarPanel} >{"v"}</button>
                <div className='btn-group text-white bg-white' style={{ width: '50vh'}}>
                    <button className="big-button" type="button" onClick={saveOrEditWorkout}><FontAwesomeIcon icon={(workout.modificable && faSave || faEdit)} style={{fontSize: '30px'}} /></button>
                    <button className="big-button" type="button" onClick={copyWorkout}><FontAwesomeIcon icon={faCopy} style={{fontSize: '30px'}} /></button>
                    <button className="big-button" type="button" onClick={pasteWorkout}><FontAwesomeIcon icon={faClipboard} style={{fontSize: '30px'}} /></button>
                    <button className="big-button" type="button" onClick={cleanWorkout}><FontAwesomeIcon icon={faTrashAlt} style={{fontSize: '30px'}} /></button>
                </div>
                <Calendar
                    onClickDay={handleDateClick}
                    activeStartDate={dateParam}
                    onActiveStartDateChange={handleViewChange}
                    tileClassName={tileClassName}
                />
            </div>  
            || 
            <button className="panel-button" type="button" onClick={toggleCalendarPanel} style={{ position: 'fixed', bottom: '0'}}>{"^"}</button>
            }
        </>
    )
}


