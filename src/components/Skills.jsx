import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    title: 'Visual Identity',
    skills: [
      { name: 'Logo Design', val: 95 },
      { name: 'Branding', val: 90 },
      { name: 'Typography', val: 85 }
    ]
  },
  {
    title: 'UI/UX Design',
    skills: [
      { name: 'Wireframing', val: 95 },
      { name: 'Prototyping', val: 92 },
      { name: 'User Research', val: 80 }
    ]
  },
  {
    title: 'Software',
    skills: [
      { name: 'Figma', val: 98 },
      { name: 'Illustrator', val: 90 },
      { name: 'Photoshop', val: 85 }
    ]
  }
]

export default function Skills() {
  const sectionRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const bars = section.querySelectorAll('.skill-progress-fill')
    bars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width')
      gsap.to(bar, {
        width: targetWidth + '%',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      })
    })

    const cards = section.querySelectorAll('.skill-card')
    const isHoverable = window.matchMedia('(hover: hover)').matches

    if (isHoverable) {
      cards.forEach(card => {
        const onMouseMove = (e) => {
          const rect = card.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          card.style.setProperty('--mouse-x', `${x}px`)
          card.style.setProperty('--mouse-y', `${y}px`)
        }
        card.addEventListener('mousemove', onMouseMove)
        card._onMouseMove = onMouseMove
      })
    }

    return () => {
      if (isHoverable) {
        cards.forEach(card => {
          if (card._onMouseMove) card.removeEventListener('mousemove', card._onMouseMove)
        })
      }
    }
  }, [])

  return (
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="tag">— Skills</div>
      <h2>My <em>Expertise</em></h2>
      <div className="skills-grid">
        {categories.map((cat, i) => (
          <div className="skill-card" key={i}>
            <div className="card-glare-effect" />
            <h3>{cat.title}</h3>
            <div className="skill-list">
              {cat.skills.map((s, j) => (
                <div className="skill-item" key={j}>
                  <div className="skill-info">
                    <span>{s.name}</span>
                    <span>{s.val}%</span>
                  </div>
                  <div className="skill-progress-track">
                    <div className="skill-progress-fill" data-width={s.val} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
