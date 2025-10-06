'use client'

import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Check, Pencil, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { UserType } from '../lib/definitions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { deleteUser, fetchUsers } from '../lib/actions/user'
import Toolbar from '../components/Toolbar'


export default function UsersList() {
  const [usuarios, setUsuarios] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [toDeleteUser, setToDeleteOrder] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
    const fetchUsuarios = async () => {
        try {
            const data = await fetchUsers();
            setUsuarios(data); // Asigna los datos de los entrenamientos
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchUsuarios();
    
}, []);

  type SortField = 'username' | 'email' | 'genre' | 'isTrainer' | 'height' | 'weight' | 'age'
  type SortOrder = 'asc' | 'desc'

  const [sortField, setSortField] = useState<SortField>('username')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return ''
    }
    return sortOrder === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />
  }

  // Sorting function
  const sortUsuarios = (usuarios: UserType[]) => {
    return [...usuarios].sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'username':
        case 'email':
        case 'genre':
        case 'isTrainer':
          comparison = (a.isTrainer === b.isTrainer) ? 0 : a.isTrainer ? 1 : -1
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }

  const filteredusuarios = sortUsuarios(usuarios.filter(usuario => 
    usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  ))

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleDelete = async () => {
    if (toDeleteUser) {
      try {
        console.log('Deleting user:', toDeleteUser.id)
        await deleteUser(toDeleteUser.id);

      } catch (error) {
        console.log(error)
      }
      setToDeleteOrder(null)
    }
  }

  return (
    <div className='w-screen'>
      <Toolbar />
      <div className="container mx-auto py-10">
        <div className="rounded-md border">
          <div className="p-4 flex items-center justify-between gap-4 border-b">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Buscar Usuario"
                  className="max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('username')}>
                  <div className='flex items-center'>
                    Nombre de Usuario <SortIndicator field="username" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('email')}>
                  <div className='flex items-center'>
                    Email <SortIndicator field="email" />
                  </div>
                </TableHead>   
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('age')}>
                  <div className='flex items-center'>
                    Edad <SortIndicator field="age" />
                  </div>
                </TableHead>    
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('genre')}>
                  <div className='flex items-center'>
                    Género <SortIndicator field="genre" />
                  </div>
                </TableHead>   
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('height')}>
                  <div className='flex items-center'>
                    Altura <SortIndicator field="height" />
                  </div>
                </TableHead> 
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('weight')}>
                  <div className='flex items-center'>
                    Peso <SortIndicator field="weight" />
                  </div>
                </TableHead>            
                <TableHead className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('isTrainer')}>
                  <div className='flex items-center justify-center'>
                    Entrenador <SortIndicator field="isTrainer" />
                  </div>
                </TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {filteredusuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.username}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.age}</TableCell>
                  <TableCell>{usuario.height}</TableCell>
                  <TableCell>{usuario.weight}</TableCell>
                  <TableCell>{usuario.isTrainer}</TableCell>
                  <TableCell className="text-center">
                    <span className={`flex justify-center px-2 py-1 rounded-full text-xs items-center`}>
                      {usuario.isTrainer ? <Check className="text-green-800" /> : <X className="text-red-800" />}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={{
                      pathname: `/users/${usuario.username}/workout`,
                    }}>
                      <Button size="sm" variant="default">
                        <Pencil className="h-4 w-4 mr-2" />
                        Gestionar Entrenamientos
                      </Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => setToDeleteOrder(usuario)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>

                    <Dialog open={!!toDeleteUser} onOpenChange={() => setToDeleteOrder(null)}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirma que desea eliminar del sistema el usuario:</DialogTitle>
                          <DialogDescription className='text-center'>
                            {toDeleteUser && (
                              <>
                                <span>{toDeleteUser.username}</span>
                                <p>Email: {toDeleteUser.email}</p>
                              </>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setToDeleteOrder(null)}>Cancelar</Button>
                          <Button variant="destructive" onClick={handleDelete}>Eliminar Usuario</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

