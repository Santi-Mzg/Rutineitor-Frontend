"use client"

import { Plus } from 'lucide-react'
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import React from 'react'

export function ExerciseRecords() {
  const [records, setRecords] = useState([
    { exercise: "Deadlift", weight: "140", reps: "5", date: "2024-01-05" },
    { exercise: "Squat", weight: "120", reps: "8", date: "2024-01-05" },
    { exercise: "Pull Up", weight: "BW+20", reps: "10", date: "2024-01-04" },
  ])

  const addRecord = (newRecord: any) => {
    setRecords([...records, { ...newRecord, date: new Date().toISOString().split("T")[0] }])
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-xl">Exercise Records</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Record</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Exercise</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deadlift">Deadlift</SelectItem>
                    <SelectItem value="squat">Squat</SelectItem>
                    <SelectItem value="pullup">Pull Up</SelectItem>
                    <SelectItem value="dip">Dip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" placeholder="Enter weight" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input id="reps" placeholder="Enter reps" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
                Save Record
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 space-y-2 sm:space-y-0"
            >
              <div>
                <h4 className="font-semibold">{record.exercise}</h4>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold">{record.weight} kg</p>
                <p className="text-sm text-gray-500">{record.reps} reps</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

