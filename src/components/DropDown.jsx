import React, { useState, useEffect, useRef } from 'react';

function DropDown({ modificable, blockIndex, exerciseIndex, onClick, options, text}) {

  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const onClickLocal = (blockIndex, index, elem) => {
    onClick(blockIndex, index, elem);
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
    <div ref={containerRef} className="nav-item dropdown">
      {modificable && 
      <button className="nav-link dropdown-toggle show" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true" onClick={toggleExpanded} >{text}</button>
      || text}
      {expanded && (
        <ul className="boton-expandible-lista" style={{zIndex: 1}}>
          {options.map((elem, index) => {
            return (
              <div className="btn-group-vertical" key={index}>
                <button  type="button" className="dropdown-item" onClick={() => onClickLocal(blockIndex, exerciseIndex, elem)}>{elem}</button>
              </div>
            )
          })}
        </ul>
      )}
    </div>
  );
}

export default DropDown;