import React from 'react';

export default function WorkoutCard({ workout }) {

    return (
        <>
            <div className='btn-group-vertical'>
                <ul className='list' style={{borderLeft: '2px solid black', borderRadius: '15px 0 0 15px', padding: '10px', margin: '5px' }}>
                    <li>
                        {(workout.date).slice(0, 10)}
                    </li>
                    <li>
                        {workout.type}
                    </li>
                </ul>
            </div>
        </>
    )
}