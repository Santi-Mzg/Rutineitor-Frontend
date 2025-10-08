"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import React from "react"
import { useAuth } from "../context/AuthContext"
import { useForm } from "react-hook-form"
import { UserType } from "../lib/definitions"

export function PersonalInfo() {
  const { user, modify } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<UserType>()
  const [isEditing, setIsEditing] = useState(false)

  const onSubmit = handleSubmit(data => {
    if(!isEditing)
      modify(data)
  })

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-xl">Información Personal</CardTitle>
        
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de Usuario</Label>
              <Input
                {...register('username')}
                id="username"
                defaultValue={user ? user.username : ''}
                readOnly={!isEditing}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  {...register('age')}
                  id="age"
                  defaultValue={user ? user.age : ''}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso corporal (kg)</Label>
                <Input
                  {...register('weight')}
                  id="weight"
                  defaultValue={user ? user.weight : ''}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  {...register('height')}
                  id="height"
                  defaultValue={user ? user.height : ''}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Objetivo Deportivo</Label>
              <Input
                {...register('goal')}
                id="goal"
                defaultValue={user ? user.goal : ''}
                readOnly={!isEditing}
              />
            </div>
          </div>
            <Button
              type="submit"
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="bg-[#F8A5A5] text-white hover:bg-[#F8A5A5]/90"
            >
              {isEditing ? "Guardar" : "Editar"}
            </Button>
        </CardContent>
      </form>
    </Card>
  )
}

