import { useState, useEffect, useRef } from 'react';

export default function TextArea({ style, value, onChange, placeholder, modificable, blockIndex, exerciseIndex, options, regex}) {

    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef(null);

    const toggleExpanded = () => {
        if (options.length === 0) return;
        setExpanded(!expanded);
    };

    const handleChange = (event) => {
        const inputValue = event.target.value;
        
        // Limpia caracteres que no sean dígitos, punto o dos puntos
        const cleanedValue = inputValue.replace(regex, '');

        // Solo actualiza si matchea con decimal o MM:SS, o si está vacío (para poder borrar)
        onChangeLocal(blockIndex, exerciseIndex, cleanedValue);
    };

    const onChangeLocal = (blockIndex, exerciseIndex, option) => {
        onChange(blockIndex, exerciseIndex, option);
        setExpanded(false);
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