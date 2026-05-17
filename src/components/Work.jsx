import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { id: '01', title: 'Bloomcraft', tags: ['BRANDING', 'LOGO'], desc: 'Eco-friendly floral identification and care app.', img: '/bloomcraft.png' },
  { id: '02', title: 'TechVista', tags: ['UI/UX', 'WEB'], desc: 'Future-forward corporate landing page.', img: '/techvista.png' },
  { id: '03', title: 'Luxeva', tags: ['PACKAGE', 'VISUAL'], desc: 'Premium skincare packaging and identity.', img: '/luxeva.png' },
  { id: '04', title: 'Stellar', tags: ['LOGOFOLIO'], desc: 'A collection of space-themed brand marks.', img: '/stellar.png' },
  { id: '05', title: 'UrbanFlow', tags: ['APP', 'PRODUCT'], desc: 'Streamlined city navigation interface.', img: '/urbanflow.png' },
  { id: '06', title: 'NeonPulse', tags: ['EVENT', 'VISUAL'], desc: 'Music festival visual ecosystem.', img: '/neonpulse.png' }
]

export default function Work() {
  const sectionRef = useRef()
  const trackRef = useRef()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const scroll = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => '+=' + (track.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1.2,
        anticipatePin: 1
      }
    })

    const titles = sectionRef.current.querySelectorAll('.work-title')
    titles.forEach(title => {
      const text = title.textContent
      title.innerHTML = text.split('').map(c => `<span class="letter">${c === ' ' ? '&nbsp;' : c}</span>`).join('')
      
      const letters = title.querySelectorAll('.letter')
      title.addEventListener('mouseenter', () => {
        gsap.to(letters, { color: '#7fd959', stagger: 0.02, duration: 0.4, ease: 'power2.out' })
      })
      title.addEventListener('mouseleave', () => {
        gsap.to(letters, { color: 'white', stagger: 0.01, duration: 0.3, ease: 'power2.in' })
      })
    })

    return () => scroll.kill()
  }, [])

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="tag">— Featured Work</div>
      <div className="work-track" ref={trackRef}>
        {projects.map((p, i) => (
          <div className="work-card" key={i}>
            <div className="work-num">{p.id}</div>
            <h3 className="work-title">{p.title}</h3>
            <div className="work-tags">
              {p.tags.map(t => <span key={t}>{t}</span>)}
            </div>
            <p className="work-desc">{p.desc}</p>
            <div className="work-visual">
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className="work-img-overlay" />
              <div className="placeholder-overlay">VIEW CASE</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
