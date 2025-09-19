import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fetchWorkoutsByExercise } from '../lib/actions/workout';
import { _arrayUnique } from 'chart.js/helpers';
import { BlockType, ExerciseType } from '../lib/definitions';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const ProgressChart: React.FC<{ exercise: string }> = ({ exercise }) => {
  const [chartData, setChartData] = useState<Record<string, Record<number, number>>>({});
  const [labels, setLabels] = useState<string[]>([]);
  const [maxWeight, setMaxWeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchExerciseProgress = async () => {
      try {
        const workoutList = await fetchWorkoutsByExercise(exercise);

        const data = workoutList.flatMap(workout =>
            workout.blockList.flatMap((block: BlockType) =>
              block.exerciseList
                .filter(ex => ex.label === exercise)
                .map((ex: ExerciseType) => ({
                  date: workout.date,
                  weight: parseFloat(ex.weight || '0'),
                  reps: parseInt(ex.volume || '0', 10),
                }))
            )
          );

        // Procesar los datos
        const groupedByDateAndReps = data.reduce((acc, item) => {
          const date = new Date(item.date).toISOString().slice(0, 10); // YYYY-MM-DD
          if (!acc[date]) {
            acc[date] = {};
          }
          if (!acc[date][item.reps] || acc[date][item.reps] <  item.weight) {
            acc[date][item.reps] = item.weight; // Establece el mayor peso levantado a esas repes en ese dia
          } 
         console.log("acc "+JSON.stringify(acc))

          return acc;
        }, {} as Record<string, Record<number, number>>);

        // Calcular el mayor peso levantado
        const allWeights = data.map((item) => item.weight);
        setMaxWeight(Math.max(...allWeights));

        const uniqueLabels = Array.from(new Set(Object.keys(groupedByDateAndReps))).sort();

        setChartData(groupedByDateAndReps);
        setLabels(uniqueLabels);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchExerciseProgress();
  }, [exercise]);

const datasets = Object.keys(chartData)
  .reduce((acc, date) => {
    Object.entries(chartData[date]).forEach(([reps, weight]) => {
      if (!acc[reps]) {
        acc[reps] = [];
      }

      // Llenar con `null` para todas las etiquetas faltantes
      const index = labels.indexOf(date);
      acc[reps][index] = weight;
    });
    return acc;
  }, {} as Record<string, (number | null)[]>);

// Convertir a datasets únicos
const resultDatasets = Object.entries(datasets).map(([reps, weightData]) => {
  const maxWeight = Math.max(...weightData.filter((w) => w !== null));

  return {
    label: `Reps ${reps}`,
    data: weightData.map((w) => w || null),
    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
    borderWidth: 1,
    pointStyle: weightData.map((weight) =>
      weight === maxWeight ? "rectRot" : "circle"
    ),
    pointRadius: weightData.map((weight) =>
      weight === maxWeight ? 12 : 8
    ),
  };
});

  const data = {
    labels,
    datasets: resultDatasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Progresión de ${exercise}`,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week',
          tooltipFormat: 'MMM dd, yyyy'
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  } as const;

  return <Line data={data} options={options} />;
};

export default ProgressChart;
