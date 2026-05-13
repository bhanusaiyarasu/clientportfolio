import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { num: '01', title: 'DISCOVER', tags: 'Research · Audit · User Study', quote: 'Understanding the problem before designing the solution.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { num: '02', title: 'DEFINE', tags: 'Strategy · Brief · Goals', quote: 'Clarity is the rarest form of intelligence.', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 4a2 2 0 100 4 2 2 0 000-4z' },
  { num: '03', title: 'IDEATE', tags: 'Sketching · Concepts · Exploration', quote: 'A hundred bad ideas lead to one great one.', icon: 'M12 2C9.24 2 7 4.24 7 7c0 1.77.93 3.32 2.33 4.2.14.09.25.22.32.37L10 13h4l.35-1.43c.07-.15.18-.28.32-.37A4.99 4.99 0 0017 7c0-2.76-2.24-5-5-5zM10 16v1a2 2 0 004 0v-1' },
  { num: '04', title: 'DESIGN', tags: 'Figma · Illustrator · Photoshop', quote: 'Where thinking becomes visible.', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { num: '05', title: 'DELIVER', tags: 'Handoff · Polish · Launch', quote: 'The pixel-perfect moment.', icon: 'M5 13l4 4L19 7' },
]

export default function Process() {
  const sectionRef = useRef()
  const lineRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    
    // Animate connecting line
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        if (lineRef.current) lineRef.current.style.height = (self.progress * 100) + '%'
      }
    })

    // Animate each step
    section.querySelectorAll('.process-step').forEach((step, i) => {
      gsap.from(step, {
        x: i % 2 === 0 ? -80 : 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      })
    })

    // Counter animation for step numbers
    section.querySelectorAll('.process-num').forEach(num => {
      const target = parseInt(num.textContent)
      ScrollTrigger.create({
        trigger: num,
        start: 'top 85%',
        onEnter: () => {
          gsap.from(num, {
            textContent: 0,
            duration: 1,
            ease: 'power3.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              num.textContent = String(Math.round(parseFloat(num.textContent))).padStart(2, '0')
            }
          })
        }
      })
    })
  }, [])

  return (
    <section className="process" id="process" ref={sectionRef}>
      <div className="tag">— Process</div>
      <h2>Design <em>Journey</em></h2>
      <div className="process-timeline">
        <div className="process-line">
          <div className="process-line-fill" ref={lineRef} />
        </div>
        {steps.map((s, i) => (
          <div className={`process-step ${i % 2 === 0 ? 'left' : 'right'}`} key={i}>
            <div className="process-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#7fd959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={s.icon} />
              </svg>
            </div>
            <div className="process-content">
              <span className="process-num">{s.num}</span>
              <h3>{s.title}</h3>
              <span className="process-tags">{s.tags}</span>
              <p>"{s.quote}"</p>
            </div>
            <div className="process-dot" />
          </div>
        ))}
      </div>
    </section>
  )
}
