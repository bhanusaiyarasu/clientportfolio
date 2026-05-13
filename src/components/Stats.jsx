import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 50, suffix: '+', label: 'Projects', sub: 'Delivered' },
  { value: 4, suffix: '+', label: 'Years', sub: 'Experience' },
  { value: 100, suffix: '%', label: 'Client Sat', sub: 'Score' },
  { value: 3, suffix: '', label: 'Domains', sub: 'Mastered' },
]

export default function Stats() {
  const sectionRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    const nums = section.querySelectorAll('.stat-value')

    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        nums.forEach((el, i) => {
          const target = stats[i].value
          gsap.fromTo(el, { textContent: 0 }, {
            textContent: target,
            duration: 2,
            ease: 'power3.out',
            snap: { textContent: 1 },
            delay: i * 0.1,
            onUpdate: function () {
              el.textContent = Math.round(parseFloat(el.textContent))
            }
          })
        })

        // Sweep line
        gsap.fromTo(section.querySelector('.stats-sweep'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out' })
      },
      once: true
    })

    gsap.from(section.querySelectorAll('.stat-item'), {
      y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
    })
  }, [])

  return (
    <section className="stats" id="stats" ref={sectionRef}>
      <div className="stats-sweep" />
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-number">
              <span className="stat-value">0</span>
              <span className="stat-suffix">{s.suffix}</span>
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
            {i < stats.length - 1 && <div className="stat-divider" />}
          </div>
        ))}
      </div>
    </section>
  )
}
