"use client"

import { Plus } from 'lucide-react'
import { useState, useEffect } from "react"
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
import { Progress } from "../components/ui/progress.tsx"
import { useAuth } from '../context/AuthContext.tsx'
import { Link } from 'react-router-dom';
import { fetchWorkoutsByExercise } from '../lib/actions/workout.ts';
import { BlockType, ExerciseType, WorkoutType } from '../lib/definitions.ts'

interface MilestoneType {
  goal: string,
  volume: number,
  targetWeight: number,
  currentWeight: number
}

export function Milestones() {
  const { user } = useAuth()

  const [newExercise, setNewExercise] = useState("");
  const [newWeight, setNewWeight] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<{label: string, targetWeight: number}[]>(
    [
      { label: "Dominadas", targetWeight: 60 },
      { label: "Sentadillas", targetWeight: 175 },
      { label: "Peso Muerto", targetWeight: 200 },
    ]
  );


  // Sample milestones data
  const [milestones, setMilestones] = useState<MilestoneType[]>(() => {
    const localValue = user ? localStorage.getItem(user.username+'milestones') : null;
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
      let milestones: Record<string, MilestoneType> = {};

      for (const exercise of selectedExercises) {
          const workouts = await fetchWorkoutsByExercise(exercise.label);
          
          workouts.forEach(workout => {
              const volumeWeights = getMaxWeightByVolume(workout, exercise.label);
              // const reps = exercise.reps || 0;
              const weight = volumeWeights[1] || 0;
              const key = `${exercise.label}-${1}`;

              if (!milestones[key] || weight > milestones[key].currentWeight) {
                milestones[key] = {
                  goal: exercise.targetWeight +'kg '+ exercise.label,
                  volume: 1,
                  targetWeight: exercise.targetWeight || weight,
                  currentWeight: weight,
                };
              }

              setMilestones(Object.values(milestones));
          });

      };
    }

    getRecords()

  }, [selectedExercises]);

  
  function handleSubmit(event: React.FormEvent) {
      event.preventDefault();
      if (!newExercise || !newWeight) return;
      setSelectedExercises([...selectedExercises, { label: newExercise, targetWeight: newWeight }]);
      setNewExercise("");
      setNewWeight(0);
      setOpen(false);
  }
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-xl">Milestones</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuevo Objetivo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Objetivo</Label>
                <Input id="goal" placeholder="Ingresa tu objetivo" onChange={(e) => setNewExercise(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Peso Objetivo</Label>
                  <Input id="target" placeholder="Valor objetivo" onChange={(e) => setNewWeight(Number(e.target.value))} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0">
                <h4 className="font-semibold">{milestone.goal}</h4>
              </div>
              <div className="flex items-center gap-4">
                <Progress
                  value={(milestone.currentWeight / milestone.targetWeight) * 100}
                  className="h-2 flex-grow"
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  {milestone.currentWeight}/{milestone.targetWeight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

