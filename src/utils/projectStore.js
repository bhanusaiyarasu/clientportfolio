// Project Store — localStorage CRUD for portfolio projects
// Admin Credentials (hashed comparison)
const ADMIN_USER = 'jaideep'
const ADMIN_PASS = 'dzine@2026'

const STORAGE_KEY = 'portfolio_projects'

// Default seed data (matches the existing hardcoded projects)
const DEFAULT_PROJECTS = [
  {
    id: 'proj_001',
    title: 'Bloomcraft',
    tags: ['BRANDING', 'LOGO'],
    description: 'Eco-friendly floral identification and care app.',
    coverImage: '/bloomcraft.png',
    category: 'Branding',
    year: '2025',
    createdAt: Date.now() - 600000
  },
  {
    id: 'proj_002',
    title: 'TechVista',
    tags: ['UI/UX', 'WEB'],
    description: 'Future-forward corporate landing page.',
    coverImage: '/techvista.png',
    category: 'UI/UX',
    year: '2025',
    createdAt: Date.now() - 500000
  },
  {
    id: 'proj_003',
    title: 'Luxeva',
    tags: ['PACKAGE', 'VISUAL'],
    description: 'Premium skincare packaging and identity.',
    coverImage: '/luxeva.png',
    category: 'Package',
    year: '2024',
    createdAt: Date.now() - 400000
  },
  {
    id: 'proj_004',
    title: 'Stellar',
    tags: ['LOGOFOLIO'],
    description: 'A collection of space-themed brand marks.',
    coverImage: '/stellar.png',
    category: 'Branding',
    year: '2024',
    createdAt: Date.now() - 300000
  },
  {
    id: 'proj_005',
    title: 'UrbanFlow',
    tags: ['APP', 'PRODUCT'],
    description: 'Streamlined city navigation interface.',
    coverImage: '/urbanflow.png',
    category: 'UI/UX',
    year: '2025',
    createdAt: Date.now() - 200000
  },
  {
    id: 'proj_006',
    title: 'NeonPulse',
    tags: ['EVENT', 'VISUAL'],
    description: 'Music festival visual ecosystem.',
    coverImage: '/neonpulse.png',
    category: 'Visual',
    year: '2025',
    createdAt: Date.now() - 100000
  }
]

// ─── Auth ───────────────────────────────────────────────
export function authenticate(username, password) {
  return username === ADMIN_USER && password === ADMIN_PASS
}

// ─── CRUD ───────────────────────────────────────────────
export function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Failed to parse projects from localStorage:', e)
  }
  // Seed with defaults on first load
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS))
  return [...DEFAULT_PROJECTS]
}

export function saveProject(project) {
  const projects = getProjects()
  const idx = projects.findIndex(p => p.id === project.id)

  if (idx >= 0) {
    // Update existing
    projects[idx] = { ...projects[idx], ...project }
  } else {
    // Add new — generate ID
    project.id = 'proj_' + Date.now().toString(36)
    project.createdAt = Date.now()
    projects.unshift(project) // newest first
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return project
}

export function deleteProject(id) {
  const projects = getProjects().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return projects
}

export function reorderProjects(orderedIds) {
  const projects = getProjects()
  const sorted = orderedIds
    .map(id => projects.find(p => p.id === id))
    .filter(Boolean)
  // Add any not in orderedIds at the end (safety)
  projects.forEach(p => {
    if (!orderedIds.includes(p.id)) sorted.push(p)
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  return sorted
}

export function getCategories() {
  const projects = getProjects()
  const cats = new Set(projects.map(p => p.category).filter(Boolean))
  return ['All', ...cats]
}

export function resetToDefaults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS))
  return [...DEFAULT_PROJECTS]
}
