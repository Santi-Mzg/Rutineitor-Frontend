"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import React from "react"

export function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [info, setInfo] = useState({
    name: "John Doe",
    age: "28",
    weight: "75",
    height: "180",
    goal: "Build muscle and strength",
  })

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          // variant="outline"
          className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={info.name}
              readOnly={!isEditing}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={info.age}
                readOnly={!isEditing}
                onChange={(e) => setInfo({ ...info, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                value={info.weight}
                readOnly={!isEditing}
                onChange={(e) => setInfo({ ...info, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                value={info.height}
                readOnly={!isEditing}
                onChange={(e) => setInfo({ ...info, height: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Fitness Goal</Label>
            <Input
              id="goal"
              value={info.goal}
              readOnly={!isEditing}
              onChange={(e) => setInfo({ ...info, goal: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

