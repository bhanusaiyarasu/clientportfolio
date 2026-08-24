import { useState, useRef, useEffect } from 'react'

export default function AdminProjectForm({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [tagsStr, setTagsStr] = useState(project?.tags?.join(', ') || '')
  const [category, setCategory] = useState(project?.category || 'Branding')
  const [year, setYear] = useState(project?.year || new Date().getFullYear().toString())
  const [coverImage, setCoverImage] = useState(project?.coverImage || '')
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()
  const formRef = useRef()

  const categories = ['Branding', 'UI/UX', 'Package', 'Visual', 'App', 'Product', 'Event', 'Logofolio', 'Web', 'Other']

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTop = 0
    }
  }, [])

  const handleImageUpload = (file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setErrors(e => ({ ...e, image: 'Image must be under 5MB' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setCoverImage(e.target.result)
      setErrors(e2 => ({ ...e2, image: null }))
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave = () => setDragOver(false)

  const validate = () => {
    const errs = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!description.trim()) errs.description = 'Description is required'
    if (!coverImage) errs.image = 'Cover image is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const tags = tagsStr
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(Boolean)

    onSave({
      ...(project || {}),
      title: title.trim(),
      description: description.trim(),
      tags,
      category,
      year,
      coverImage
    })
  }

  return (
    <div className="admin-form-overlay" ref={formRef}>
      <div className="admin-form-container">
        <div className="admin-form-header">
          <h2>{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="admin-form-close" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="admin-form-body">
          {/* Left: Form Fields */}
          <form className="admin-form-fields" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label>Project Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bloomcraft"
                className={errors.title ? 'field-error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="admin-field">
              <label>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project..."
                rows={3}
                className={errors.description ? 'field-error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="admin-field-row">
              <div className="admin-field">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label>Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
            </div>

            <div className="admin-field">
              <label>Tags <span className="field-hint">(comma-separated)</span></label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="BRANDING, LOGO, UI/UX"
              />
            </div>

            <div className="admin-field">
              <label>Cover Image *</label>
              <div
                className={`admin-dropzone ${dragOver ? 'drag-over' : ''} ${coverImage ? 'has-image' : ''} ${errors.image ? 'field-error' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileRef.current?.click()}
              >
                {coverImage ? (
                  <div className="dropzone-preview">
                    <img src={coverImage} alt="Preview" />
                    <div className="dropzone-replace">Click or drag to replace</div>
                  </div>
                ) : (
                  <div className="dropzone-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17,8 12,3 7,8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p>Drag & drop image or click to browse</p>
                    <span>PNG, JPG, WebP — Max 5MB</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </div>
              {errors.image && <span className="error-text">{errors.image}</span>}
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={onCancel}>Cancel</button>
              <button type="submit" className="admin-btn-primary">
                {project ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>

          {/* Right: Live Preview */}
          <div className="admin-preview-panel">
            <div className="preview-label">LIVE PREVIEW</div>
            <div className="admin-preview-card">
              <div className="preview-card-visual">
                {coverImage ? (
                  <img src={coverImage} alt="Preview" />
                ) : (
                  <div className="preview-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="preview-card-info">
                <h4>{title || 'Project Title'}</h4>
                <p>{description || 'Project description will appear here...'}</p>
                <div className="preview-card-tags">
                  {(tagsStr || 'TAG').split(',').filter(t => t.trim()).map((t, i) => (
                    <span key={i}>{t.trim().toUpperCase()}</span>
                  ))}
                </div>
                <div className="preview-card-meta">
                  <span>{category}</span>
                  <span>{year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
