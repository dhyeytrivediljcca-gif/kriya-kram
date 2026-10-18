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

interface LocalSetting {
  key: string
  value: string
}

export class KriyaDatabase extends Dexie {
  tasks!: EntityTable<Task, 'id'>
  projects!: EntityTable<Project, 'id'>
  settings!: EntityTable<LocalSetting, 'key'>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      tasks: 'id, completed, dueDate, projectId, priority, updatedAt',
      projects: 'id, name'
    })
    this.version(2).stores({
      tasks: 'id, completed, dueDate, projectId, priority, createdAt, updatedAt',
      projects: 'id, name, createdAt'
    })
    this.version(3).stores({
      tasks: 'id, completed, dueDate, projectId, priority, createdAt, updatedAt',
      projects: 'id, name, createdAt',
      settings: 'key'
    })
  }
}

const legacyDatabase = new KriyaDatabase('kriya-kram')
const userDatabases = new Map<string, Promise<KriyaDatabase>>()

export function getUserDatabase(userId: string) {
  const existing = userDatabases.get(userId)
  if (existing) return existing

  const opening = openUserDatabase(userId)
  userDatabases.set(userId, opening)
  void opening.catch(() => userDatabases.delete(userId))
  return opening
}

async function openUserDatabase(userId: string) {
  const database = new KriyaDatabase(`kriya-kram-user-${userId}`)
  await database.open()

  const legacyOwner = await legacyDatabase.transaction('rw', legacyDatabase.settings, async () => {
    const owner = await legacyDatabase.settings.get('legacyOwner')
    if (owner) return owner.value
    await legacyDatabase.settings.add({ key: 'legacyOwner', value: userId })
    return userId
  })

  if (legacyOwner === userId) {
    await legacyDatabase.open()
    const [legacyTasks, legacyProjects] = await Promise.all([
      legacyDatabase.tasks.toArray(),
      legacyDatabase.projects.toArray()
    ])
    await database.transaction('rw', database.tasks, database.projects, database.settings, async () => {
      if (await database.settings.get('legacyImported')) return
      if (legacyTasks.length) await database.tasks.bulkPut(legacyTasks)
      if (legacyProjects.length) await database.projects.bulkPut(legacyProjects)
      await database.settings.add({ key: 'legacyImported', value: 'yes' })
    })
  }

  return database
}
