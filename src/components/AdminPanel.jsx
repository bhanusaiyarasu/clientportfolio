import { useState, useEffect, useRef } from 'react'
import { authenticate, getProjects, saveProject, deleteProject, resetToDefaults } from '../utils/projectStore'
import AdminProjectForm from './AdminProjectForm'
import gsap from 'gsap'

export default function AdminPanel({ onExit }) {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null) // null = list, 'new' = new form, project obj = edit form
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [notification, setNotification] = useState(null)
  const panelRef = useRef()
  const loginRef = useRef()

  useEffect(() => {
    document.body.classList.add('admin-mode')
    return () => {
      document.body.classList.remove('admin-mode')
    }
  }, [])

  useEffect(() => {
    if (authed) {
      setProjects(getProjects())
    }
  }, [authed])

  useEffect(() => {
    if (loginRef.current) {
      gsap.from(loginRef.current, { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' })
    }
  }, [])

  useEffect(() => {
    if (panelRef.current && authed) {
      gsap.from(panelRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' })
    }
  }, [authed])

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (authenticate(username, password)) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials')
      if (loginRef.current) {
        gsap.fromTo(loginRef.current, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      }
    }
  }

  const handleSave = (project) => {
    const saved = saveProject(project)
    setProjects(getProjects())
    setEditing(null)
    showNotification(project.id ? 'Project updated!' : 'Project created!')
  }

  const handleDelete = (id) => {
    deleteProject(id)
    setProjects(getProjects())
    setDeleteConfirm(null)
    showNotification('Project deleted', 'warning')
  }

  const handleReset = () => {
    if (window.confirm('Reset all projects to defaults? This cannot be undone.')) {
      resetToDefaults()
      setProjects(getProjects())
      showNotification('Reset to defaults!')
    }
  }

  // ─── LOGIN SCREEN ───────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-bg">
          <div className="login-orb orb-1" />
          <div className="login-orb orb-2" />
          <div className="login-orb orb-3" />
        </div>
        <div className="admin-login-card" ref={loginRef}>
          <div className="login-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1>Admin Access</h1>
          <p className="login-subtitle">Portfolio Management Panel</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit" className="login-btn">
              <span>Sign In</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" />
              </svg>
            </button>
          </form>

          <button className="login-back" onClick={onExit}>
            ← Back to Portfolio
          </button>
        </div>
      </div>
    )
  }

  // ─── EDIT / CREATE FORM ─────────────────────────────────
  if (editing !== null) {
    return (
      <AdminProjectForm
        project={editing === 'new' ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    )
  }

  // ─── ADMIN DASHBOARD ───────────────────────────────────
  return (
    <div className="admin-panel" ref={panelRef}>
      {/* Notification Toast */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          {notification.type === 'success' ? '✓' : '⚠'} {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1>Project Manager</h1>
            <p>Manage your portfolio projects</p>
          </div>
        </div>
        <div className="admin-header-actions">
          <button className="admin-btn-ghost" onClick={handleReset} title="Reset to default projects">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23,4 23,10 17,10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Reset
          </button>
          <button className="admin-btn-ghost" onClick={onExit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Portfolio
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="stat-num">{projects.length}</span>
          <span className="stat-label">Total Projects</span>
        </div>
        <div className="admin-stat">
          <span className="stat-num">{new Set(projects.map(p => p.category)).size}</span>
          <span className="stat-label">Categories</span>
        </div>
        <div className="admin-stat">
          <span className="stat-num">{projects.filter(p => p.year === new Date().getFullYear().toString()).length}</span>
          <span className="stat-label">This Year</span>
        </div>
      </div>

      {/* Add New Button */}
      <div className="admin-toolbar">
        <h2>All Projects</h2>
        <button className="admin-btn-primary" onClick={() => setEditing('new')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="admin-project-list">
        {projects.length === 0 ? (
          <div className="admin-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
            </svg>
            <h3>No projects yet</h3>
            <p>Click "Add Project" to create your first project.</p>
          </div>
        ) : (
          projects.map((p, i) => (
            <div className="admin-project-item" key={p.id} style={{ '--delay': `${i * 0.05}s` }}>
              <div className="admin-project-thumb">
                <img src={p.coverImage} alt={p.title} />
              </div>
              <div className="admin-project-info">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <div className="admin-project-meta">
                  <span className="meta-category">{p.category}</span>
                  <span className="meta-year">{p.year}</span>
                  <div className="meta-tags">
                    {p.tags?.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="admin-project-actions">
                <button className="action-edit" onClick={() => setEditing(p)} title="Edit project">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {deleteConfirm === p.id ? (
                  <div className="delete-confirm">
                    <button className="confirm-yes" onClick={() => handleDelete(p.id)}>Delete</button>
                    <button className="confirm-no" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className="action-delete" onClick={() => setDeleteConfirm(p.id)} title="Delete project">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
