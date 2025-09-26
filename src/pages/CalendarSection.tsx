import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSave, faEdit, faCopy, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { createOrUpdateWorkout, deleteWorkout } from '../lib/actions/workout.ts';
import { formatDate } from '../lib/utils.ts';
import { WorkoutType, UserType } from '../lib/definitions.ts';

interface CalendarSectionProps {
    user: UserType;
    workout: WorkoutType;
    setWorkout: React.Dispatch<React.SetStateAction<WorkoutType>>;
    workoutList: WorkoutType[];
    setWorkoutList: React.Dispatch<React.SetStateAction<WorkoutType[]>>;
    expandedCalendarPanel: boolean;
    setExpandedCalendarPanel: React.Dispatch<React.SetStateAction<boolean>>;
    activeStartDate: string;
    setActiveStartDate: React.Dispatch<React.SetStateAction<string>>;
}

export default function CalendarSection({
    user,
    workout,
    setWorkout,
    workoutList,
    setWorkoutList,
    expandedCalendarPanel,
    setExpandedCalendarPanel,
    activeStartDate,
    setActiveStartDate
}: CalendarSectionProps) {


    const navigate = useNavigate()
    const todayDate = new Date()
    const [dateParam, setDateParam] = useState(new Date())

    useEffect(() => {
        if (dateParam < new Date(activeStartDate)) {
            setActiveStartDate(formatDate(dateParam));
        }
    }, [dateParam]);

    const handleDateClick = (date: Date) => {

        if (date.getTime() === todayDate.getTime()) {
            navigate(`/workout`)
        }
        else {
            const formattedDate = formatDate(date)
            navigate(`/workout/${formattedDate}`)
        }
    }

    const handleViewChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
        if (activeStartDate) {
            setDateParam(activeStartDate);
        }
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
            createOrUpdateWorkout(workout, user.id)
            
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
        deleteWorkout(workout.date, user.id)
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

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {

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
                                return ' pull-day';
                            case 'Pierna':
                                return 'leg-day';
                            case 'Movilidad':
                                return 'mobility-day';
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
                <div className='btn-group text-white bg-white lg:grid lg:grid-rows-2 lg:grid-cols-2 lg:gap-4 w-[50vh] mx-auto mb-16'>
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


