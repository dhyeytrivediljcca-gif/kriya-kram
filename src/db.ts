import Dexie, { type EntityTable } from 'dexie'

export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: Priority
  projectId: string
  completed: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface Project {
  id: string
  name: string
  createdAt: string
}

class KriyaDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  projects!: EntityTable<Project, 'id'>

  constructor() {
    super('kriya-kram')
    this.version(1).stores({
      tasks: 'id, completed, dueDate, projectId, priority, updatedAt',
      projects: 'id, name'
    })
    this.version(2).stores({
      tasks: 'id, completed, dueDate, projectId, priority, createdAt, updatedAt',
      projects: 'id, name, createdAt'
    })
  }
}

export const db = new KriyaDatabase()
