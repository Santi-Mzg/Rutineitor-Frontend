"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { PersonalInfo } from "./personal-info"
import { ExerciseRecords } from "./exercise-records"
import { Milestones } from "./milestones"
import { useAuth } from "../context/AuthContext"

export default function ProfilePage() {
    const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#98D8C8] p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/20">
            <TabsTrigger value="personal" className="text-xs sm:text-sm">Personal Info</TabsTrigger>
            <TabsTrigger value="records" className="text-xs sm:text-sm">Exercise Records</TabsTrigger>
            <TabsTrigger value="milestones" className="text-xs sm:text-sm">Milestones</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <PersonalInfo/>
          </TabsContent>
          <TabsContent value="records">
            <ExerciseRecords/>
          </TabsContent>
          <TabsContent value="milestones">
            <Milestones/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

