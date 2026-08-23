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

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia()

      // Desktop: Horizontal Scroll & Pinning
      mm.add("(min-width: 769px)", () => {
        gsap.to(track, {
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
      })

      // Mobile: Vertical flow, simple vertical fade ins for cards
      mm.add("(max-width: 768px)", () => {
        const cards = sectionRef.current.querySelectorAll('.work-card')
        cards.forEach(card => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
        })
      })

    }, sectionRef)

    // Hover listeners for titles (mouse hover capability check)
    const titles = sectionRef.current.querySelectorAll('.work-title')
    const isHoverable = window.matchMedia('(hover: hover)').matches

    if (isHoverable) {
      titles.forEach(title => {
        const letters = title.querySelectorAll('.letter')
        const onEnter = () => {
          gsap.to(letters, { color: '#7fd959', stagger: 0.02, duration: 0.4, ease: 'power2.out' })
        }
        const onLeave = () => {
          gsap.to(letters, { color: 'white', stagger: 0.01, duration: 0.3, ease: 'power2.in' })
        }
        title.addEventListener('mouseenter', onEnter)
        title.addEventListener('mouseleave', onLeave)
        
        title._onEnter = onEnter
        title._onLeave = onLeave
      })
    }

    return () => {
      ctx.revert()
      if (isHoverable) {
        titles.forEach(title => {
          if (title._onEnter) title.removeEventListener('mouseenter', title._onEnter)
          if (title._onLeave) title.removeEventListener('mouseleave', title._onLeave)
        })
      }
    }
  }, [])

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="tag">— Featured Work</div>
      <div className="work-track" ref={trackRef}>
        {projects.map((p, i) => (
          <div className="work-card" key={i}>
            <div className="work-num">{p.id}</div>
            <h3 className="work-title">
              {p.title.split('').map((c, j) => (
                <span className="letter" key={j}>
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </h3>
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
