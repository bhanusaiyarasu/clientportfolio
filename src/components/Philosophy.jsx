import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const statements = [
  { label: 'ON DESIGN', text: 'Design is not just what it looks like. Design is how it', highlight: 'WORKS.' },
  { label: 'ON CRAFT', text: 'Every pixel is a decision. Every decision is a', highlight: 'STORY.' },
  { label: 'ON PURPOSE', text: 'The best design is invisible. The best designer is', highlight: 'UNFORGETTABLE.' }
]

export default function Philosophy() {
  const sectionRef = useRef()
  const statementsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const items = statementsRef.current

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        items.forEach((item, i) => {
          if (!item) return
          const start = i / 3
          const end = (i + 1) / 3
          const mid = start + (end - start) * 0.15
          const fadeOut = end - (end - start) * 0.15

          if (p >= start && p < end) {
            if (p < mid) {
              const t = (p - start) / (mid - start)
              gsap.set(item, { opacity: t, scale: 0.94 + t * 0.06, display: 'block' })
            } else if (p > fadeOut) {
              const t = (p - fadeOut) / (end - fadeOut)
              gsap.set(item, { opacity: 1 - t, scale: 1 + t * 0.05, display: 'block' })
            } else {
              gsap.set(item, { opacity: 1, scale: 1, display: 'block' })
            }
          } else {
            gsap.set(item, { opacity: 0, display: 'none' })
          }
        })

        // Progress bar
        const bar = section.querySelector('.phil-progress-fill')
        if (bar) bar.style.height = (p * 100) + '%'

        // Dots
        const dots = section.querySelectorAll('.phil-dot')
        const activeIdx = Math.min(Math.floor(p * 3), 2)
        dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx))
      }
    })
  }, [])

  return (
    <section className="philosophy" id="philosophy" ref={sectionRef}>
      <div className="phil-content">
        {statements.map((s, i) => (
          <div
            key={i}
            className="phil-statement"
            ref={el => statementsRef.current[i] = el}
            style={{ opacity: i === 0 ? 1 : 0, display: i === 0 ? 'block' : 'none' }}
          >
            <span className="phil-label">{s.label}</span>
            <h2>{s.text} <em>{s.highlight}</em></h2>
            <span className="phil-attr">— Jaideep Chaitanya</span>
          </div>
        ))}
      </div>
      <div className="phil-progress">
        <div className="phil-progress-track">
          <div className="phil-progress-fill" />
        </div>
        <div className="phil-dots">
          <span className="phil-dot active" />
          <span className="phil-dot" />
          <span className="phil-dot" />
        </div>
      </div>
    </section>
  )
}
