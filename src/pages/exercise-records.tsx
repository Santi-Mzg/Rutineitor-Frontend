"use client"

import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog.tsx"
import { Input } from "../components/ui/input.tsx"
import { Label } from "../components/ui/label.tsx"
import { useAuth } from '../context/AuthContext.tsx'
import { fetchWorkoutsByExercise } from '../lib/actions/workout.ts';
import { WorkoutType, BlockType, ExerciseType } from '../lib/definitions.ts'
import { exercises as exercisesData } from '../lib/exercises.json';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx'

interface RecordType { 
    exercise: string, 
    reps: number, 
    weight: number, 
    date: string,
}


export function ExerciseRecords() {
  const { user } = useAuth()

  const [open, setOpen] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [newReps, setNewReps] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState<{label: string, reps: number}[]>(
    [
      { label: "Dominadas", reps: 5 },
      { label: "Sentadillas", reps: 1 },
      { label: "Banco Plano", reps: 30 },
    ]);


  const [records, setRecords] = useState(() => {
      const localValue = user ? localStorage.getItem(user.username+'records') : null;
      return localValue ? JSON.parse(localValue) : []
  })

  function getMaxWeightByVolume(workout: WorkoutType, exerciseLabel: string) {
    let exerciseData = workout.blockList
      .flatMap((block: BlockType) => block.exerciseList)
      .filter((exercise: ExerciseType) => exercise.label === exerciseLabel);
  
    let volumeWeights: Record<number, number> = {};
  
    exerciseData.forEach(exercise => {
      const volume = exercise.volume !== "Max" ? exercise.volume : Infinity;
      const weight = exercise.weight !== "Libre" ? exercise.weight : 0;
  
      if (!volumeWeights[volume] || volumeWeights[volume] < weight) {
        volumeWeights[volume] = weight;
      }
    });
  
    return volumeWeights;
  }

  useEffect(() => {
    async function getRecords() {
      let bestRecords: Record<string, RecordType> = {};

      for (const exercise of selectedExercises) {
          const workouts = await fetchWorkoutsByExercise(exercise.label);
          
          workouts.forEach(workout => {
              const volumeWeights = getMaxWeightByVolume(workout, exercise.label);
              const reps = exercise.reps || 0;
              const weight = volumeWeights[reps] || 0;
              const key = `${exercise.label}-${reps}`;

              if (!bestRecords[key] || weight > bestRecords[key].weight) {
                bestRecords[key] = {
                  exercise: exercise.label,
                  weight,
                  reps,
                  date: (workout.date).split('T')[0],
                };
              }

              setRecords(Object.values(bestRecords));
          });

      };
    }

    getRecords()

  }, [selectedExercises]);


  function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (!newExercise || !newReps) return;
      setSelectedExercises([...selectedExercises, { label: newExercise, reps: newReps }]);
      setNewExercise("");
      setNewReps(0);
      setOpen(false);
  }

  function handleRemoveRecord(index: number) {
    const updated = records.filter((_: RecordType, i: number) => i !== index);
    setRecords(updated);
  }


  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div className='flex items-center justify-between gap-4'>
        
          <CardTitle className="text-xl">Records Personales</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise">Ejercicio</Label>
                  <DropDownWithSearch onChange={(exercise: any) => setNewExercise(exercise.label)} options={exercisesData} text={newExercise || "Seleccionar..."} />
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps">Repeticiones</Label>
                    <Input id="reps" type="number" value={newReps} onChange={(e) => setNewReps(Number(e.target.value))} />
                </div>
                <Button className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
                  Save Record
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record: RecordType, index: number) => (
            <div key={index} className="flex flex-col justify-between rounded-lg border p-4 gap-y-2">
              <div className='flex items-center justify-between gap-4'>
                <h4 className="font-semibold">{record.exercise} x {record.reps}</h4>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="font-bold text-xl text-right">{record.weight} kg</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveRecord(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

