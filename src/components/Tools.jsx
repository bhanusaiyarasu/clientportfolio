import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tools = [
  { name: 'Figma', icon: 'Fi', desc: 'Interface design and prototyping', color: '#a259ff', bg: 'rgba(162, 89, 255, 0.08)' },
  { name: 'Illustrator', icon: 'Ai', desc: 'Vector illustration and logo craft', color: '#ff9a00', bg: 'rgba(255, 154, 0, 0.08)' },
  { name: 'Photoshop', icon: 'Ps', desc: 'Photo manipulation and visual art', color: '#31a8ff', bg: 'rgba(49, 168, 255, 0.08)' },
  { name: 'Stitch', icon: 'St', desc: 'Advanced packaging design tool', color: '#7fd959', bg: 'rgba(127, 217, 89, 0.08)' },
  { name: 'InDesign', icon: 'Id', desc: 'Layout and print production', color: '#ff3366', bg: 'rgba(255, 51, 102, 0.08)' },
  { name: 'After Effects', icon: 'Ae', desc: 'Motion graphics and animation', color: '#9999ff', bg: 'rgba(153, 153, 255, 0.08)' }
]

export default function Tools() {
  const sectionRef = useRef()
  const showcaseRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Tool rows entry
    const rows = section.querySelectorAll('.tool-row')
    rows.forEach((row, i) => {
      gsap.from(row, {
        x: -50, opacity: 0, duration: 0.8, delay: i * 0.1,
        immediateRender: false,
        scrollTrigger: { trigger: row, start: 'top 90%', toggleActions: 'play none none none' }
      })
    })

    // Showcase cards stagger in
    const cards = section.querySelectorAll('.showcase-card')
    gsap.from(cards, {
      y: 40, opacity: 0, scale: 0.9, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: showcaseRef.current, start: 'top 85%', toggleActions: 'play none none none' }
    })

    // Card tilt on mouse
    const isHoverable = window.matchMedia('(hover: hover)').matches
    if (isHoverable) {
      cards.forEach(card => {
        const onMouseMove = (e) => {
          const rect = card.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          gsap.to(card, {
            rotateY: x * 15,
            rotateX: -y * 15,
            duration: 0.4,
            ease: 'power2.out'
          })
          // Update glare position
          card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
          card.style.setProperty('--my', `${e.clientY - rect.top}px`)
        }
        
        const onMouseLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
        }

        card.addEventListener('mousemove', onMouseMove)
        card.addEventListener('mouseleave', onMouseLeave)

        card._onMouseMove = onMouseMove
        card._onMouseLeave = onMouseLeave
      })
    }

    return () => {
      if (isHoverable) {
        cards.forEach(card => {
          if (card._onMouseMove) card.removeEventListener('mousemove', card._onMouseMove)
          if (card._onMouseLeave) card.removeEventListener('mouseleave', card._onMouseLeave)
        })
      }
    }
  }, [])

  return (
    <section className="tools-section" id="tools" ref={sectionRef}>
      <div className="tools-left">
        <span className="tag">— Toolbox</span>
        <h2>Mastering the <em>Digital</em> Forge</h2>
        <div className="tool-list">
          {tools.map((t, i) => (
            <div className="tool-row" key={i}>
              <div className="tool-icon" style={{ color: t.color, borderColor: t.color + '40' }}>{t.icon}</div>
              <div className="tool-info">
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tools-right" ref={showcaseRef}>
        <div className="tool-showcase">
          {tools.map((t, i) => (
            <div
              className="showcase-card"
              key={i}
              style={{
                '--card-color': t.color,
                '--card-bg': t.bg
              }}
            >
              <div className="showcase-glare" />
              <div className="showcase-icon-wrap">
                <span className="showcase-icon" style={{ color: t.color }}>{t.icon}</span>
                <div className="showcase-glow" style={{ background: t.color }} />
              </div>
              <h4 className="showcase-name">{t.name}</h4>
              <p className="showcase-desc">{t.desc}</p>
              <div className="showcase-bar">
                <div className="showcase-bar-fill" style={{ background: t.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
