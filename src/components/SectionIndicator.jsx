import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sections = [
  { id: 'hero', label: '01' },
  { id: 'about', label: '02' },
  { id: 'philosophy', label: '03' },
  { id: 'skills', label: '04' },
  { id: 'revolution', label: '05' },
  { id: 'work', label: '06' },
  { id: 'process', label: '07' },
  { id: 'testimonials', label: '08' },
  { id: 'stats', label: '09' },
  { id: 'tools', label: '10' },
  { id: 'contact', label: '11' },
]

export default function SectionIndicator() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    sections.forEach((s, i) => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i)
      })
    })
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="section-indicator">
      <div className="si-line">
        <div className="si-marker" style={{ top: `${(active / (sections.length - 1)) * 100}%` }} />
      </div>
      {sections.map((s, i) => (
        <span
          key={s.id}
          className={active === i ? 'active' : ''}
          onClick={() => scrollTo(s.id)}
        >
          {s.label}
        </span>
      ))}
    </div>
  )
}
