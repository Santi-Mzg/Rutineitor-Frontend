// ordenarJson.mjs

import fs from 'fs';

const jsonData = JSON.parse(fs.readFileSync('exercises.json', 'utf-8'));

// Asegúrate de que jsonData.items sea un array
if (Array.isArray(jsonData.exercises)) {
  
  const seenLabels = new Set();
  jsonData.exercises = jsonData.exercises.filter(exercise => {
    if (seenLabels.has(exercise.label)) {
      return false;
    } else {
      seenLabels.add(exercise.label);
      return true;
    }
  });

  // Ordena el array de objetos por el atributo "label"
  jsonData.exercises.sort((a, b) => a.label.localeCompare(b.label));

  // Guarda el objeto con el array ordenado en lugar del no ordenado
  fs.writeFileSync('exercises.json', JSON.stringify(jsonData, null, 2), 'utf-8');

  console.log('JSON ordenado alfabéticamente por el atributo "label" y guardado en public/data.json');
} else {
  console.error('El objeto JSON no contiene una propiedad "items" que sea un array.');
}
