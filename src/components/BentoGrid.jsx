import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function BentoGrid() {
  // Accent color state for the Bento Grid (dynamic glow theme)
  const [accent, setAccent] = useState('#7fd959') // Green, Purple, Blue, Pink
  const [accentName, setAccentName] = useState('Green Glow')

  // Glass Sandbox states
  const [blur, setBlur] = useState(20)
  const [opacity, setOpacity] = useState(15)
  const [radius, setRadius] = useState(24)

  // Clock state
  const [time, setTime] = useState('')
  const [dateStr, setDateStr] = useState('')

  // Micro-interaction states
  const [toggleActive, setToggleActive] = useState(true)
  const [progress, setProgress] = useState(65)
  const [selectedRating, setSelectedRating] = useState(5)
  const ratingText = ['Design', 'UX Flow', 'Details', 'Premium', 'Perfect!']

  const bentoRef = useRef()

  useEffect(() => {
    // Update live clock
    const updateTime = () => {
      const d = new Date()
      const hh = String(d.getHours()).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      const ss = String(d.getSeconds()).padStart(2, '0')
      setTime(`${hh}:${mm}:${ss}`)

      const options = { weekday: 'short', month: 'short', day: 'numeric' }
      setDateStr(d.toLocaleDateString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // Apply the CSS variable accent color to the Bento Grid container
  useEffect(() => {
    if (bentoRef.current) {
      bentoRef.current.style.setProperty('--bento-accent', accent)
      bentoRef.current.style.setProperty('--bento-accent-glow', `${accent}40`)
    }
  }, [accent])

  // GSAP Hover animations for bento cards
  const onCardMouseEnter = (e) => {
    const card = e.currentTarget
    gsap.to(card, {
      y: -6,
      borderColor: accent,
      boxShadow: `0 10px 30px ${accent}25`,
      duration: 0.35,
      ease: 'power2.out'
    })
  }

  const onCardMouseLeave = (e) => {
    const card = e.currentTarget
    gsap.to(card, {
      y: 0,
      borderColor: 'rgba(255, 255, 255, 0.06)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      duration: 0.35,
      ease: 'power2.out'
    })
  }

  const palettes = [
    { name: 'Green Glow', color: '#7fd959' },
    { name: 'Royal Purple', color: '#a855f7' },
    { name: 'Cyber Blue', color: '#0ea5e9' },
    { name: 'Sunset Pink', color: '#f43f5e' }
  ]

  return (
    <section className="bento-section" id="bento-spotlight" ref={bentoRef}>
      <div className="bento-container">
        
        {/* SECTION HEADER */}
        <div className="bento-header">
          <span className="tag">SPOTLIGHT</span>
          <h2>CREATIVE <em>SANDBOX</em></h2>
          <p>An interactive, premium playground demonstrating pixel-perfect UI/UX micro-dynamics, live sandbox properties, and visual design layouts.</p>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid">

          {/* CARD 1: 2x2 Glass Sandbox */}
          <div 
            className="bento-card col-span-2 row-span-2 bento-sandbox-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content">
              <div className="card-top">
                <span className="card-tag">UI DRAG & STYLE</span>
                <h3>Glassmorphic Engine</h3>
              </div>
              
              <div className="sandbox-workspace">
                {/* Dynamic Preview Card */}
                <div 
                  className="glass-preview-container"
                  style={{
                    backdropFilter: `blur(${blur}px)`,
                    backgroundColor: `rgba(255, 255, 255, ${opacity / 1000})`,
                    borderRadius: `${radius}px`,
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div className="preview-header">
                    <div className="circle red"></div>
                    <div className="circle yellow"></div>
                    <div className="circle green"></div>
                  </div>
                  <div className="preview-body">
                    <h4>Interactive Canvas</h4>
                    <p>Real-time styling values computed below.</p>
                    <div className="css-output">
                      <code>
                        blur: {blur}px<br />
                        opacity: {opacity / 1000}<br />
                        radius: {radius}px
                      </code>
                    </div>
                  </div>
                </div>

                {/* Styled Slider Controls */}
                <div className="sandbox-controls">
                  <div className="control-row">
                    <label>Backdrop Blur: <span>{blur}px</span></label>
                    <input 
                      type="range" min="4" max="40" value={blur} 
                      onChange={(e) => setBlur(parseInt(e.target.value))} 
                    />
                  </div>

                  <div className="control-row">
                    <label>Glass Opacity: <span>{opacity / 1000}</span></label>
                    <input 
                      type="range" min="5" max="80" value={opacity} 
                      onChange={(e) => setOpacity(parseInt(e.target.value))} 
                    />
                  </div>

                  <div className="control-row">
                    <label>Border Radius: <span>{radius}px</span></label>
                    <input 
                      type="range" min="8" max="48" value={radius} 
                      onChange={(e) => setRadius(parseInt(e.target.value))} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: 2x1 Visual Philosophy */}
          <div 
            className="bento-card col-span-2 bento-philosophy-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content flex-row">
              <div className="phi-left">
                <span className="card-tag">DESIGN PHILOSOPHY</span>
                <h3>Crafted with absolute pixel precision, designed to captivate.</h3>
                <p>Great user experiences emerge from the elegant union of motion, visual hierarchy, and seamless interactivity.</p>
              </div>
              <div className="phi-right">
                <div className="vector-circle-glowing">
                  <svg viewBox="0 0 100 100" width="100" height="100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3, 3" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="50" cy="10" r="4" fill="currentColor" />
                    <line x1="50" y1="10" x2="50" y2="50" stroke="currentColor" strokeWidth="1" />
                    <line x1="50" y1="50" x2="78" y2="50" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: 1x1 Color Palette Selector */}
          <div 
            className="bento-card bento-palette-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content">
              <span className="card-tag">CREATIVE PALETTE</span>
              <h3>Dynamic Glow</h3>
              <p className="palette-status">Active: <span style={{ color: accent }}>{accentName}</span></p>

              <div className="palette-vault">
                {palettes.map((p) => (
                  <button
                    key={p.name}
                    className={`palette-swatch ${accent === p.color ? 'active' : ''}`}
                    style={{ 
                      background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                      boxShadow: accent === p.color ? `0 0 16px ${p.color}` : 'none'
                    }}
                    onClick={() => {
                      setAccent(p.color)
                      setAccentName(p.name)
                    }}
                    aria-label={`Select ${p.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CARD 4: 1x1 Live Concept Clock */}
          <div 
            className="bento-card bento-clock-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content">
              <span className="card-tag">SYSTEM PULSE</span>
              <h3>Concept Clock</h3>
              
              <div className="clock-wrapper">
                <div className="clock-digits">{time}</div>
                <div className="clock-date">{dateStr}</div>
              </div>

              {/* Pulsing Visual Wave */}
              <div className="pulse-wave-svg">
                <svg viewBox="0 0 100 20" width="100%" height="20">
                  <path 
                    d="M0,10 Q10,2 20,10 T40,10 T60,10 T80,10 T100,10" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                    className="wave-line-anim"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* CARD 5: 1x2 UX Micro-Interactions Hub */}
          <div 
            className="bento-card row-span-2 bento-micro-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content">
              <div className="card-top">
                <span className="card-tag">UX FLOWS</span>
                <h3>Micro Interactions</h3>
              </div>

              <div className="micro-interactions-dashboard">
                {/* 1. Toggle Switch Widget */}
                <div className="micro-widget">
                  <div className="widget-label">
                    <span>Hardware Engine</span>
                    <span className="widget-status-text">{toggleActive ? 'ACTIVE' : 'STANDBY'}</span>
                  </div>
                  <button 
                    className={`custom-switch ${toggleActive ? 'active' : ''}`}
                    onClick={() => setToggleActive(!toggleActive)}
                  >
                    <span className="switch-dot" />
                  </button>
                </div>

                {/* 2. Drag/Hover Progress Widget */}
                <div className="micro-widget">
                  <div className="widget-label">
                    <span>UX Smoothness</span>
                    <span>{progress}%</span>
                  </div>
                  <div 
                    className="custom-progress-bar"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const pct = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 100)))
                      setProgress(pct)
                    }}
                  >
                    <div className="progress-fill" style={{ width: `${progress}%`, backgroundColor: accent }} />
                  </div>
                </div>

                {/* 3. Rating Widget */}
                <div className="micro-widget">
                  <div className="widget-label">
                    <span>UX Fidelity</span>
                    <span style={{ color: accent }}>{ratingText[selectedRating - 1]}</span>
                  </div>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        className={`rating-dot ${selectedRating >= num ? 'active' : ''}`}
                        style={{ color: selectedRating >= num ? accent : 'rgba(255, 255, 255, 0.2)' }}
                        onClick={() => setSelectedRating(num)}
                      >
                        ✦
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 6: 2x1 Creative Tech Stack Grid */}
          <div 
            className="bento-card col-span-2 bento-stack-card"
            onMouseEnter={onCardMouseEnter}
            onMouseLeave={onCardMouseLeave}
          >
            <div className="card-bg-gradient" />
            <div className="card-content">
              <span className="card-tag">DESIGN TOOLCHAIN</span>
              <h3>Creative Stack</h3>
              
              <div className="creative-stack-chips">
                {['Figma', 'Blender 3D', 'Spline', 'After Effects', 'Photoshop', 'Webflow'].map((tool, idx) => (
                  <div 
                    key={tool} 
                    className="stack-chip"
                    style={{ '--chip-index': idx }}
                  >
                    <span className="chip-dot" style={{ backgroundColor: accent }} />
                    <span className="chip-name">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
