import React, { useState } from 'react';
import Select from 'react-select';

function DropDownWithSearch({ options, onChange, text}) {

  const [selectedOption, setSelectedOption] = useState(null);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter(option =>
    option && option.label && option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = selectedOption => {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
    setSelectedOption(null);
  };

  // Estilos personalizados para el botón desplegable
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '180px',
      backgroundColor: 'white', // Color de fondo
      border: '1px solid darkgray', // Borde del botón
      borderRadius: '8px', // Borde redondeado
      boxShadow: state.isFocused ? '0 0 0 1px darkgray' : null, // Efecto de sombra al estar enfocado
      '&:hover': {
        borderColor: 'gray', // Borde al pasar el ratón
      },
      fontSize: 14,
    }),
  };

  return (
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={filteredOptions}
        isSearchable
        onInputChange={value => setSearchText(value)}
        placeholder={text}
        styles={customStyles}
      />
  );
}

export default DropDownWithSearch;