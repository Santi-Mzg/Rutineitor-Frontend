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
import { Progress } from "../components/ui/progress"
import { useAuth } from '../context/AuthContext'

export function Milestones() {
  const { user } = useAuth()
  
  const [milestones, setMilestones] = useState([
    { goal: "200kg Deadlift", current: 140, target: 200, deadline: "2024-06-30" },
    { goal: "100kg Bench Press", current: 80, target: 100, deadline: "2024-06-30" },
    { goal: "20 Pull-ups", current: 12, target: 20, deadline: "2024-03-31" },
  ])

  const addMilestone = (newMilestone: any) => {
    setMilestones([...milestones, newMilestone])
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-xl">Milestones</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input id="goal" placeholder="Enter your goal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current</Label>
                  <Input id="current" placeholder="Current value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input id="target" placeholder="Target value" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
              <Button type="submit" className="w-full bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90">
                Save Milestone
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
                <p className="text-sm text-gray-500">Due {milestone.deadline}</p>
              </div>
              <div className="flex items-center gap-4">
                <Progress
                  value={(milestone.current / milestone.target) * 100}
                  className="h-2 flex-grow"
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  {milestone.current}/{milestone.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

