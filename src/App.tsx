import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowDownWideNarrow, ArrowLeft, ArrowRight, CalendarDays, Check, CheckCheck,
  Circle, Clock3, FolderKanban, Inbox, Languages, LayoutDashboard,
  ListTodo, Menu, Moon, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings2, Sun, Trash2,
  X, Zap
} from 'lucide-react'
import { db, type Priority, type Project, type Task } from './db'

type RouteKey = 'inbox' | 'today' | 'upcoming' | 'calendar' | 'tasks' | 'completed' | 'projects' | 'productivity' | 'settings'
type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'completed'>
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}
const navItems: { key: RouteKey; path: string; icon: typeof Inbox }[] = [
  { key: 'inbox', path: '/inbox', icon: Inbox },
  { key: 'today', path: '/today', icon: CheckCheck },
  { key: 'upcoming', path: '/upcoming', icon: CalendarDays },
  { key: 'calendar', path: '/calendar', icon: CalendarDays },
  { key: 'tasks', path: '/tasks', icon: ListTodo },
  { key: 'completed', path: '/completed', icon: Check },
  { key: 'projects', path: '/projects', icon: FolderKanban },
  { key: 'productivity', path: '/productivity', icon: LayoutDashboard },
  { key: 'settings', path: '/settings', icon: Settings2 }
]

const localDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function App() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [online, setOnline] = useState(navigator.onLine)
  const [dark, setDark] = useState(localStorage.getItem('kk-theme') === 'dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('kk-sidebar-collapsed') === 'yes')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Task | null | 'new'>(null)
  const [projectEditor, setProjectEditor] = useState(false)
  const [projectView, setProjectView] = useState<string | null>(null)
  const [quickTitle, setQuickTitle] = useState('')
  const [editorDueDate, setEditorDueDate] = useState('')
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [standalone, setStandalone] = useState(() => window.matchMedia('(display-mode: standalone)').matches)
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [toast, setToast] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const route = location.pathname.split('/')[1] as RouteKey

  const refresh = useCallback(async () => {
    const [nextTasks, nextProjects] = await Promise.all([
      db.tasks.orderBy('createdAt').reverse().toArray(),
      db.projects.orderBy('createdAt').toArray()
    ])
    setTasks(nextTasks)
    setProjects(nextProjects)
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => {
    const onOn = () => setOnline(true)
    const onOff = () => setOnline(false)
    window.addEventListener('online', onOn)
    window.addEventListener('offline', onOff)
    return () => {
      window.removeEventListener('online', onOn)
      window.removeEventListener('offline', onOff)
    }
  }, [])
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])
  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      if (localStorage.getItem('kk-install-dismissed') !== 'yes') setInstallPrompt(event as InstallPromptEvent)
    }
    const onInstalled = () => { setStandalone(true); setInstallPrompt(null) }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('kk-theme', dark ? 'dark' : 'light')
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f2119' : '#102a20')
  }, [dark])
  useEffect(() => {
    localStorage.setItem('kk-sidebar-collapsed', sidebarCollapsed ? 'yes' : 'no')
  }, [sidebarCollapsed])
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setDrawerOpen(false)
  }, [location.pathname])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredTasks = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase()
    const today = localDate()
    return tasks.filter(task => {
      const matchesSearch = !needle || `${task.title} ${task.description}`.toLocaleLowerCase().includes(needle)
      if (!matchesSearch) return false
      if (route === 'completed') return task.completed
      if (route === 'today') return !task.completed && Boolean(task.dueDate) && task.dueDate <= today
      if (route === 'upcoming') return !task.completed && Boolean(task.dueDate)
      if (route === 'inbox') return !task.completed && !task.dueDate && !task.projectId
      if (route === 'projects') return !task.completed
      return !task.completed
    }).sort((a, b) => {
      if (!a.dueDate) return b.dueDate ? 1 : 0
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  }, [tasks, route, search])

  const changeLanguage = (value: string) => {
    void i18n.changeLanguage(value)
    localStorage.setItem('kk-language', value)
    document.documentElement.lang = value
  }

  const saveTask = async (draft: TaskDraft, id?: string) => {
    const now = new Date().toISOString()
    if (id) {
      const current = await db.tasks.get(id)
      if (!current) throw new Error('Task no longer exists')
      await db.tasks.put({ ...current, ...draft, updatedAt: now })
    } else {
      await db.tasks.add({
        ...draft, id: crypto.randomUUID(), completed: false,
        createdAt: now, updatedAt: now, completedAt: null
      })
    }
    await refresh()
    setEditor(null)
    setEditorDueDate('')
    setToast(t('labels.saved'))
  }

  const startNewTask = (dueDate = '') => {
    setEditorDueDate(dueDate)
    setEditor('new')
  }
  const closeEditor = () => {
    setEditor(null)
    setEditorDueDate('')
  }
  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'dismissed') localStorage.setItem('kk-install-dismissed', 'yes')
    setInstallPrompt(null)
  }

  const toggleTask = async (task: Task) => {
    const completed = !task.completed
    await db.tasks.update(task.id, {
      completed, completedAt: completed ? new Date().toISOString() : null, updatedAt: new Date().toISOString()
    })
    await refresh()
  }

  const deleteTask = async (task: Task) => {
    if (!window.confirm(t('labels.deleteConfirm'))) return
    await db.tasks.delete(task.id)
    await refresh()
  }

  const addQuickTask = async (event: FormEvent) => {
    event.preventDefault()
    const title = quickTitle.trim()
    if (!title) return
    await saveTask({ title, description: '', dueDate: route === 'today' ? localDate() : '', priority: 'medium', projectId: '' })
    setQuickTitle('')
  }

  const addProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    if (!name) return
    await db.projects.add({ id: crypto.randomUUID(), name, createdAt: new Date().toISOString() })
    await refresh()
    setProjectEditor(false)
  }

  const title = t(`nav.${route}`, { defaultValue: t('nav.today') })
  const pendingCount = tasks.filter(task => !task.completed).length
  const doneCount = tasks.filter(task => task.completed).length
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))
  weekStart.setHours(0, 0, 0, 0)
  const finishedToday = tasks.filter(task => task.completedAt?.slice(0, 10) === localDate()).length
  const finishedWeek = tasks.filter(task => task.completedAt && new Date(task.completedAt) >= weekStart).length
  const completionRate = tasks.length ? Math.round(doneCount / tasks.length * 100) : 0

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${drawerOpen ? 'sidebar-open' : ''}`}>
        <Link className="brand" to="/today" onClick={() => setDrawerOpen(false)} aria-label={t('brand')}>
          <img className="brand-wordmark" src="/brand/kriya-kram-logo.png" alt={t('brand')} />
          <img className="brand-symbol" src="/icons/icon-192.png" alt="" />
        </Link>
        <p className="tagline">{t('tagline')}</p>
        <div className="sidebar-controls"><button className="sidebar-collapse icon-button" onClick={() => setSidebarCollapsed(value => !value)} aria-label={sidebarCollapsed ? t('labels.expandSidebar') : t('labels.collapseSidebar')} title={sidebarCollapsed ? t('labels.expandSidebar') : t('labels.collapseSidebar')}>
          {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        </button></div>
        <button className="button button-primary add-task-button" onClick={() => startNewTask()}>
          <Plus size={17} strokeWidth={2.5} /> {t('labels.addTask')}
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(({ key, path, icon: Icon }) => (
            <Link key={key} aria-label={t(`nav.${key}`)} title={sidebarCollapsed ? t(`nav.${key}`) : undefined} to={path} onClick={() => { setDrawerOpen(false); if (key === 'projects') setProjectView(null) }} className={`nav-link ${route === key ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{t(`nav.${key}`)}</span>
              {key === 'today' && pendingCount > 0 && <span className="nav-count">{tasks.filter(task => !task.completed && task.dueDate <= localDate()).length}</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-projects">
          <div className="section-label"><span>{t('nav.projects')}</span><button aria-label={t('labels.createProject')} onClick={() => setProjectEditor(true)}><Plus size={16} /></button></div>
          {projects.slice(0, 4).map(project => <button className="project-shortcut" key={project.id} onClick={() => { setProjectView(project.id); navigate('/projects'); setDrawerOpen(false) }}><span className="project-dot" />{project.name}</button>)}
        </div>
        <div className="sidebar-footer">
          <div className={`connection-pill ${online ? '' : 'is-offline'}`}><span />{online ? t('labels.online') : t('labels.offline')}</div>
          <div className="local-note"><span className="local-check"><Check size={12} /></span><span>{t('labels.localOnly')}</span></div>
        </div>
      </aside>

      {drawerOpen && <button className="drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-label={t('labels.closeMenu')} />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setDrawerOpen(true)} aria-label={t('labels.menu')}><Menu size={21} /></button>
          <div className="breadcrumb"><span>{t('brand')}</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div>
          <div className="topbar-actions">
            <label className="search-box"><Search size={17} /><input ref={searchInputRef} value={search} onChange={event => setSearch(event.target.value)} placeholder={t('labels.search')} aria-label={t('labels.search')} />{search && <button onClick={() => setSearch('')} aria-label={t('labels.clearSearch')}><X size={15} /></button>}<kbd>⌘ K</kbd></label>
            <button className="icon-button theme-toggle" onClick={() => setDark(value => !value)} aria-label={dark ? t('labels.light') : t('labels.dark')}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <select className="language-select" value={i18n.language} onChange={event => changeLanguage(event.target.value)} aria-label={t('labels.language')}>
              <option value="en">English</option><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option>
            </select>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="*" element={
            <div className="page-wrap">
              <Routes>
                <Route path="/calendar" element={
                  <CalendarPage date={calendarDate} onChange={setCalendarDate} tasks={tasks} onAdd={startNewTask} onEdit={task => setEditor(task)} />
                } />
                <Route path="/projects" element={
                  <ProjectsPage projects={projects} tasks={tasks} selected={projectView} onSelect={setProjectView} onAdd={() => setProjectEditor(true)} onEdit={task => setEditor(task)} onComplete={toggleTask} onDeleteTask={deleteTask} onDeleteProject={async project => {
                    if (!window.confirm(t('labels.projectDeleteConfirm'))) return
                    await db.transaction('rw', db.projects, db.tasks, async () => {
                      await db.tasks.where('projectId').equals(project.id).modify({ projectId: '' })
                      await db.projects.delete(project.id)
                    })
                    await refresh()
                  }} />
                } />
                <Route path="/productivity" element={<ProductivityPage tasks={tasks} finishedToday={finishedToday} finishedWeek={finishedWeek} pending={pendingCount} completionRate={completionRate} onNew={() => startNewTask()} />} />
                <Route path="/settings" element={<SettingsPage dark={dark} setDark={setDark} language={i18n.language} onLanguage={changeLanguage} installAvailable={Boolean(installPrompt)} standalone={standalone} onInstall={() => void installApp()} />} />
                <Route path="*" element={<TaskPage title={title} route={route} tasks={filteredTasks} allTasks={tasks} projects={projects} loading={loading} query={search} onQuick={addQuickTask} quickTitle={quickTitle} setQuickTitle={setQuickTitle} onNew={() => startNewTask()} onEdit={task => setEditor(task)} onComplete={toggleTask} onDelete={deleteTask} onClear={() => setSearch('')} />} />
              </Routes>
            </div>
          } />
        </Routes>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[navItems[0], navItems[1], navItems[2], navItems[7]].map(({ key, path, icon: Icon }) => <Link key={key} to={path} className={route === key ? 'active' : ''}><Icon size={19} /><span>{t(`nav.${key}`)}</span></Link>)}
        <button onClick={() => startNewTask()} aria-label={t('labels.addTask')}><Plus size={21} /></button>
      </nav>

      {editor && <TaskEditor task={editor === 'new' ? null : editor} projects={projects} initialDueDate={editorDueDate} onSave={saveTask} onClose={closeEditor} />}
      {projectEditor && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setProjectEditor(false) }}><form className="modal project-modal" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onSubmit={addProject}><div className="modal-top"><h2 id="project-dialog-title">{t('labels.createProject')}</h2><button type="button" className="icon-button" onClick={() => setProjectEditor(false)} aria-label={t('labels.close')}><X size={19} /></button></div><label>{t('labels.projectName')}<input name="name" autoFocus required maxLength={80} /></label><div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setProjectEditor(false)}>{t('labels.cancel')}</button><button className="button button-primary">{t('labels.createProject')}</button></div></form></div>}
      {toast && <div className="toast"><Check size={15} />{toast}</div>}
    </div>
  )
}

function TaskPage({ title, route, tasks, allTasks, projects, loading, query, onQuick, quickTitle, setQuickTitle, onNew, onEdit, onComplete, onDelete, onClear }: {
  title: string; route: RouteKey; tasks: Task[]; allTasks: Task[]; projects: Project[]; loading: boolean; query: string
  onQuick: (event: FormEvent) => void; quickTitle: string; setQuickTitle: (value: string) => void
  onNew: () => void; onEdit: (task: Task) => void; onComplete: (task: Task) => void; onDelete: (task: Task) => void; onClear: () => void
}) {
  const { t, i18n } = useTranslation()
  const today = localDate()
  const heading = route === 'today' ? new Intl.DateTimeFormat(i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()) : ''
  const emptyKeys: Partial<Record<RouteKey, [string, string]>> = {
    inbox: ['emptyInboxTitle', 'emptyInboxHint'],
    today: ['emptyTodayTitle', 'emptyTodayHint'],
    upcoming: ['emptyUpcomingTitle', 'emptyUpcomingHint'],
    tasks: ['emptyTasksTitle', 'emptyTasksHint'],
    completed: ['emptyCompletedTitle', 'emptyCompletedHint']
  }
  const [emptyTitleKey, emptyHintKey] = emptyKeys[route] ?? ['noTasks', 'noTasksHint']
  const todayOpen = tasks.filter(task => task.dueDate === today || (task.dueDate && task.dueDate < today))
  const todayDone = allTasks.filter(task => task.completedAt?.slice(0, 10) === today).length
  const todayTotal = todayOpen.length + todayDone
  const todayProgress = todayTotal ? Math.round(todayDone / todayTotal * 100) : 0
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowKey = localDate(tomorrow)
  const endOfWeek = new Date()
  endOfWeek.setDate(endOfWeek.getDate() + ((7 - endOfWeek.getDay()) % 7))
  const weekEndKey = localDate(endOfWeek)
  const upcomingSections = [
    { key: 'overdueGroup', items: tasks.filter(task => task.dueDate < today) },
    { key: 'todayGroup', items: tasks.filter(task => task.dueDate === today) },
    { key: 'tomorrowGroup', items: tasks.filter(task => task.dueDate === tomorrowKey) },
    { key: 'laterWeekGroup', items: tasks.filter(task => task.dueDate > tomorrowKey && task.dueDate <= weekEndKey) },
    { key: 'futureGroup', items: tasks.filter(task => task.dueDate > weekEndKey) }
  ].filter(section => section.items.length > 0)
  return <section className="task-page">
    <div className="page-heading">
      <div><div className="eyebrow">{route === 'today' ? t('labels.today') : t('brand')}</div><h1>{title}</h1><p className="page-subtitle">{route === 'today' ? heading : `${tasks.length} ${tasks.length === 1 ? t('labels.task') : t('labels.tasks')}`}</p></div>
      <button className="button button-primary desktop-add" onClick={onNew}><Plus size={17} />{t('labels.addTask')}</button>
    </div>
    {route === 'today' && todayTotal > 0 && <div className="today-summary">
      <div className="today-summary-copy"><strong>{t('labels.todayProgress', { completed: todayDone, total: todayTotal })}</strong><span>{t('labels.completedToday')}</span></div>
      <div className="today-progress" role="progressbar" aria-label={t('labels.todayProgress', { completed: todayDone, total: todayTotal })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={todayProgress}><span style={{ width: `${todayProgress}%` }} /></div>
      <span className="today-progress-value">{todayProgress}%</span>
    </div>}
    {route !== 'completed' && <form className="quick-add" onSubmit={onQuick}><Plus size={17} /><input value={quickTitle} onChange={event => setQuickTitle(event.target.value)} placeholder={`${t('labels.addTask')}…`} aria-label={t('labels.addTask')} /><span>↵</span></form>}
    {loading ? <div className="loading-state">{t('labels.localOnly')}</div> : tasks.length === 0 ? <div className="empty-state"><div className="empty-mark"><ListTodo size={24} /></div><h2>{t(query ? 'labels.searchEmpty' : `labels.${emptyTitleKey}`)}</h2><p>{query ? '' : t(`labels.${emptyHintKey}`)}</p>{query ? <button className="button button-quiet" onClick={onClear}>{t('labels.clearSearch')}</button> : route !== 'completed' && <button className="button button-primary" onClick={onNew}><Plus size={16} />{t('labels.addTask')}</button>}</div> :
      route === 'upcoming' ? <div className="upcoming-groups">{upcomingSections.map(section => <section className="task-section" key={section.key}><div className={`task-section-heading ${section.key === 'overdueGroup' ? 'section-overdue' : ''}`}><h2>{t(`labels.${section.key}`)}</h2><span>{section.items.length}</span></div><div className="task-list">{section.items.map(task => <TaskRow key={task.id} task={task} projects={projects} onEdit={onEdit} onComplete={onComplete} onDelete={onDelete} />)}</div></section>)}</div> :
      <div className="task-list">{tasks.map(task => <TaskRow key={task.id} task={task} projects={projects} onEdit={onEdit} onComplete={onComplete} onDelete={onDelete} />)}</div>}
    {route === 'today' && tasks.some(task => task.dueDate && task.dueDate < today) && <p className="overdue-note"><Clock3 size={14} />{t('labels.overdueHint')}</p>}
  </section>
}

function TaskRow({ task, projects = [], onEdit, onComplete, onDelete }: { task: Task; projects?: Project[]; onEdit: (task: Task) => void; onComplete: (task: Task) => void; onDelete: (task: Task) => void }) {
  const { t, i18n } = useTranslation()
  const [menu, setMenu] = useState(false)
  const priorities: Record<Priority, string> = { urgent: t('labels.urgent'), high: t('labels.high'), medium: t('labels.medium'), low: t('labels.low') }
  return <article className={`task-row ${task.completed ? 'task-done' : ''}`}>
    <button className={`task-check ${task.completed ? 'checked' : ''}`} onClick={() => onComplete(task)} aria-label={task.completed ? t('labels.reopen') : t('labels.complete')}>{task.completed ? <Check size={14} /> : <Circle size={19} />}</button>
    <button className="task-main" onClick={() => onEdit(task)}><span className="task-title">{task.title}</span>{task.description && <span className="task-description">{task.description}</span>}<span className="task-meta">
      {task.dueDate && <span className={`due-chip ${task.dueDate < localDate() && !task.completed ? 'late' : ''}`}><CalendarDays size={13} />{new Intl.DateTimeFormat(i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN', { month: 'short', day: 'numeric' }).format(new Date(`${task.dueDate}T12:00:00`))}</span>}
      {task.priority !== 'medium' && <span className={`priority-chip priority-${task.priority}`}><span />{priorities[task.priority]}</span>}
      {task.projectId && <span className="project-chip"><FolderKanban size={13} />{projects.find(project => project.id === task.projectId)?.name ?? ''}</span>}
    </span></button>
    <div className="task-actions"><button className="icon-button task-more" onClick={() => setMenu(value => !value)} aria-label={t('labels.edit')}><MoreHorizontal size={19} /></button>{menu && <div className="task-menu"><button onClick={() => { onEdit(task); setMenu(false) }}>{t('labels.edit')}</button><button className="danger-text" onClick={() => onDelete(task)}><Trash2 size={14} />{t('labels.delete')}</button></div>}</div>
  </article>
}

function TaskEditor({ task, projects, initialDueDate, onSave, onClose }: { task: Task | null; projects: Project[]; initialDueDate: string; onSave: (draft: TaskDraft, id?: string) => Promise<void>; onClose: () => void }) {
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    if (!title) { setError(t('labels.title')); return }
    setSaving(true)
    setError('')
    try {
      await onSave({
        title, description: String(form.get('description') ?? '').trim(),
        dueDate: String(form.get('dueDate') ?? ''),
        priority: String(form.get('priority') ?? 'medium') as Priority,
        projectId: String(form.get('projectId') ?? '')
      }, task?.id)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('labels.saveError'))
    } finally { setSaving(false) }
  }
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><form className="modal task-modal" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" onSubmit={submit}>
    <div className="modal-top"><h2 id="task-dialog-title">{task ? t('labels.edit') : t('labels.addTask')}</h2><button type="button" className="icon-button" onClick={onClose} aria-label={t('labels.close')}><X size={19} /></button></div>
    <label>{t('labels.title')}<input name="title" defaultValue={task?.title ?? ''} required maxLength={240} autoFocus placeholder={t('labels.title')} /></label>
    <label>{t('labels.description')}<textarea name="description" defaultValue={task?.description ?? ''} rows={3} maxLength={2000} /></label>
    <div className="form-grid"><label>{t('labels.dueDate')}<input type="date" name="dueDate" defaultValue={task?.dueDate ?? initialDueDate} /></label>
      <label>{t('labels.priority')}<select name="priority" defaultValue={task?.priority ?? 'medium'}><option value="low">{t('labels.low')}</option><option value="medium">{t('labels.medium')}</option><option value="high">{t('labels.high')}</option><option value="urgent">{t('labels.urgent')}</option></select></label></div>
    <label>{t('labels.project')}<select name="projectId" defaultValue={task?.projectId ?? ''}><option value="">{t('labels.noProject')}</option>{projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>{t('labels.cancel')}</button><button className="button button-primary" disabled={saving}>{saving ? '…' : t('labels.save')}</button></div>
  </form></div>
}

function CalendarPage({ date, onChange, tasks, onAdd, onEdit }: { date: Date; onChange: (date: Date) => void; tasks: Task[]; onAdd: (date?: string) => void; onEdit: (task: Task) => void }) {
  const { t, i18n } = useTranslation()
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysCount = new Date(year, month + 1, 0).getDate()
  const locale = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN'
  const header = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
  const prev = () => onChange(new Date(year, month - 1, 1))
  const next = () => onChange(new Date(year, month + 1, 1))
  const dayLabels = t('days', { returnObjects: true }) as string[]
  return <section className="calendar-page">
    <div className="page-heading"><div><div className="eyebrow">{t('brand')}</div><h1>{t('nav.calendar')}</h1><p className="page-subtitle">{header}</p></div><div className="calendar-actions"><button className="button button-quiet" onClick={() => onChange(new Date())}>{t('labels.todayButton')}</button><button className="button button-primary" onClick={() => onAdd(localDate(date))}><Plus size={16} />{t('labels.addTask')}</button></div></div>
    <div className="calendar-card"><div className="calendar-toolbar"><button className="icon-button" onClick={prev} aria-label={t('labels.back')}><ArrowLeft size={18} /></button><strong>{header}</strong><button className="icon-button" onClick={next} aria-label={t('labels.next')}><ArrowRight size={18} /></button></div>
      <div className="calendar-grid">{dayLabels.map((label, index) => <div className="calendar-weekday" key={`${label}-${index}`}>{label}</div>)}{Array.from({ length: firstWeekday }, (_, index) => <div className="calendar-blank" key={`blank-${index}`} />)}{Array.from({ length: daysCount }, (_, index) => {
        const day = index + 1
        const dateKey = `${year}-${`${month + 1}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
        const datedTasks = tasks.filter(task => task.dueDate === dateKey && !task.completed)
        return <button key={dateKey} className={`calendar-day ${dateKey === localDate() ? 'is-today' : ''}`} onClick={() => datedTasks[0] ? onEdit(datedTasks[0]) : onAdd(dateKey)} aria-label={`${day}, ${datedTasks.length} ${t('labels.tasks')}`}>
          <span className="calendar-date">{new Intl.NumberFormat(locale).format(day)}</span>{datedTasks.slice(0, 2).map(task => <span className="calendar-event" key={task.id}>{task.title}</span>)}{datedTasks.length > 2 && <span className="calendar-extra">+{datedTasks.length - 2}</span>}
        </button>
      })}</div>
    </div>
  </section>
}

function ProjectsPage({ projects, tasks, selected, onSelect, onAdd, onEdit, onComplete, onDeleteTask, onDeleteProject }: { projects: Project[]; tasks: Task[]; selected: string | null; onSelect: (id: string | null) => void; onAdd: () => void; onEdit: (task: Task) => void; onComplete: (task: Task) => void; onDeleteTask: (task: Task) => void; onDeleteProject: (project: Project) => void }) {
  const { t } = useTranslation()
  const activeProject = projects.find(project => project.id === selected)
  const projectTasks = activeProject ? tasks.filter(task => task.projectId === activeProject.id) : []
  return <section className="projects-page"><div className="page-heading"><div><div className="eyebrow">{t('brand')}</div><h1>{activeProject?.name ?? t('nav.projects')}</h1><p className="page-subtitle">{activeProject ? `${projectTasks.filter(task => task.completed).length} / ${projectTasks.length} ${t('labels.tasks')}` : t('labels.projectHint')}</p></div><button className="button button-primary" onClick={onAdd}><Plus size={16} />{t('labels.createProject')}</button></div>
    {activeProject && <button className="back-link" onClick={() => onSelect(null)}><ArrowLeft size={15} />{t('nav.projects')}</button>}
    {!activeProject ? projects.length ? <div className="project-grid">{projects.map(project => { const list = tasks.filter(task => task.projectId === project.id); return <button className="project-card" key={project.id} onClick={() => onSelect(project.id)}><div className="project-card-icon"><FolderKanban size={19} /></div><h3>{project.name}</h3><p>{list.filter(task => !task.completed).length} {t('labels.pending').toLocaleLowerCase()} · {list.length} {t('labels.tasks')}</p><div className="progress-track"><span style={{ width: `${list.length ? list.filter(task => task.completed).length / list.length * 100 : 0}%` }} /></div><span className="project-delete" onClick={event => { event.stopPropagation(); onDeleteProject(project) }}><Trash2 size={14} /></span></button> })}</div> : <div className="empty-state"><div className="empty-mark"><FolderKanban size={23} /></div><h2>{t('labels.projectEmpty')}</h2><p>{t('labels.projectHint')}</p><button className="button button-primary" onClick={onAdd}><Plus size={16} />{t('labels.createProject')}</button>    </div> : <div className="task-list">{projectTasks.map(task => <TaskRow key={task.id} task={task} projects={projects} onEdit={onEdit} onComplete={onComplete} onDelete={onDeleteTask} />)}</div>}
  </section>
}

function ProductivityPage({ tasks, finishedToday, finishedWeek, pending, completionRate, onNew }: { tasks: Task[]; finishedToday: number; finishedWeek: number; pending: number; completionRate: number; onNew: () => void }) {
  const { t, i18n } = useTranslation()
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + offset)
    const key = localDate(date)
    return { key, label: new Intl.DateTimeFormat(i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'gu' ? 'gu-IN' : 'en-IN', { weekday: 'short' }).format(date), count: tasks.filter(task => task.completedAt?.slice(0, 10) === key).length }
  })
  const maximum = Math.max(1, ...days.map(day => day.count))
  return <section className="productivity-page"><div className="page-heading"><div><div className="eyebrow">{t('brand')}</div><h1>{t('nav.productivity')}</h1><p className="page-subtitle">{t('labels.weekly')}</p></div><span className="productive-mark"><Zap size={17} />{t('labels.completionRate')} <b>{completionRate}%</b></span></div>
    {tasks.length === 0 ? <div className="empty-state productivity-empty"><div className="empty-mark"><LayoutDashboard size={23} /></div><h2>{t('labels.productivityEmpty')}</h2><p>{t('labels.productivityHint')}</p><button className="button button-primary" onClick={onNew}><Plus size={16} />{t('labels.addTask')}</button></div> :
      <><div className="stats-grid"><Stat icon={CheckCheck} label={t('labels.completedToday')} value={finishedToday} accent /><Stat icon={CalendarDays} label={t('labels.completedWeek')} value={finishedWeek} /><Stat icon={ListTodo} label={t('labels.pending')} value={pending} /><Stat icon={ArrowDownWideNarrow} label={t('labels.completionRate')} value={`${completionRate}%`} /></div>
      <div className="chart-card"><div className="chart-heading"><div><h2>{t('labels.weekly')}</h2><p>{t('labels.completedWeek')}</p></div><span className="chart-total">{finishedWeek}</span></div><div className="bar-chart">{days.map(day => <div className="bar-column" key={day.key}><span className="bar-value">{day.count || ''}</span><div className="bar-track"><span style={{ height: `${day.count ? Math.max(8, day.count / maximum * 100) : 0}%` }} /></div><span className="bar-label">{day.label}</span></div>)}</div></div></>}
  </section>
}

function Stat({ icon: Icon, label, value, accent = false }: { icon: typeof CheckCheck; label: string; value: number | string; accent?: boolean }) {
  return <div className={`stat-card ${accent ? 'stat-accent' : ''}`}><span className="stat-icon"><Icon size={17} /></span><span className="stat-label">{label}</span><strong>{value}</strong></div>
}

function SettingsPage({ dark, setDark, language, onLanguage, installAvailable, standalone, onInstall }: { dark: boolean; setDark: (value: boolean) => void; language: string; onLanguage: (value: string) => void; installAvailable: boolean; standalone: boolean; onInstall: () => void }) {
  const { t } = useTranslation()
  return <section className="settings-page"><div className="page-heading"><div><div className="eyebrow">{t('brand')}</div><h1>{t('nav.settings')}</h1><p className="page-subtitle">{t('labels.settingsInfo')}</p></div></div>
    <div className="settings-card"><div className="setting-row"><span className="setting-icon"><Languages size={18} /></span><div className="setting-copy"><strong>{t('labels.language')}</strong><span>हिन्दी · ગુજરાતી · English</span></div><select value={language} onChange={event => onLanguage(event.target.value)} aria-label={t('labels.language')}><option value="en">English</option><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option></select></div>
      <div className="setting-row"><span className="setting-icon">{dark ? <Moon size={18} /> : <Sun size={18} />}</span><div className="setting-copy"><strong>{t('labels.theme')}</strong><span>{dark ? t('labels.dark') : t('labels.light')}</span></div><button className={`switch ${dark ? 'switch-on' : ''}`} role="switch" aria-checked={dark} onClick={() => setDark(!dark)}><span /></button></div>
      {!standalone && <div className="setting-row"><span className="setting-icon"><Plus size={18} /></span><div className="setting-copy"><strong>{t('labels.install')}</strong><span>{installAvailable ? '' : t('labels.installHelp')}</span></div>{installAvailable && <button className="button button-primary" onClick={onInstall}>{t('labels.install')}</button>}</div>}
    </div>
    <div className="settings-note"><span className="local-check"><Check size={12} /></span><div><strong>{t('labels.localOnly')}</strong><p>{t('labels.cloudNotice')}</p></div></div>
  </section>
}

export default App
