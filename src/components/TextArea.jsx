import React, { useState, useEffect, useRef } from 'react';

export default function TextArea({ style, value, onChange, placeholder, modificable, blockIndex, exerciseIndex, options}) {

    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef(null);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleChange = (event) => {
        const inputValue = event.target.value;
        const filteredValue = inputValue.replace(/[^0-9.]|(?<!\d)\.|(?<=\..*)\.|(?<=\.[0-9]*)[0-9]{3,}/g, ''); // Filtra solo números
        onChangeLocal(blockIndex, exerciseIndex, filteredValue);   
    }
    
    const onChangeLocal = (blockIndex, exerciseIndex, option) => {
        onChange(blockIndex, exerciseIndex, option)
        setExpanded(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className='btn-group-vertical'>
            <textarea 
                style={style} 
                disabled={!modificable}
                onClick={toggleExpanded} 
                onChange={handleChange} 
                value={value}
                placeholder={placeholder}
            />
            {expanded && (
                <ul className="boton-expandible-lista" style={{zIndex: 1}}>
                {options.map((option, index) => {
                    return (
                    <div className="btn-group-vertical" key={index}>
                        <button  type="button" className="dropdown-item" onClick={() => onChangeLocal(blockIndex, exerciseIndex, option)}>{option}</button>
                    </div>
                    )
                })}
                </ul>
            )}
        </div>
    )
}