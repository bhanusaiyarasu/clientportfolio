import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ loaded }) {
  const sectionRef = useRef()
  const titleRef = useRef()
  const photoRef = useRef()
  const topRef = useRef()
  const bottomRef = useRef()

  useEffect(() => {
    if (!loaded) return
    
    const init = () => {
      const title = titleRef.current
      if (!title) return
      const spans = title.querySelectorAll('span')
      
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(spans, { scaleY: 0, transformOrigin: 'bottom', duration: 1.2, stagger: 0.06 }, 0)
        .from(photoRef.current, { clipPath: 'inset(100% 0 0 0)', duration: 1.4 }, 0.2)
        .to(photoRef.current, { clipPath: 'inset(0 0 0 0)', duration: 1.4 }, 0.2)
        .from(topRef.current.querySelectorAll('span'), { y: -30, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.3)
        .from(bottomRef.current.querySelectorAll('.hero-bottom-left, .hero-bottom-right'), { x: (i) => i === 0 ? -60 : 60, opacity: 0, duration: 1 }, 0.5)
        .from(sectionRef.current.querySelectorAll('.floating-icon'), { scale: 0.3, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'back.out(1.7)' }, 0.8)
        .from('.hero-badge', { scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1,0.6)' }, 1.2)
    }

    if (document.fonts) {
      document.fonts.ready.then(init)
    } else {
      setTimeout(init, 500)
    }
  }, [loaded])

  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.5,
      onUpdate: s => {
        const p = s.progress
        if (titleRef.current) gsap.set(titleRef.current, { y: -80 * p, scale: 1 - p * 0.3, opacity: 1 - p })
        if (photoRef.current) gsap.set(photoRef.current, { y: -60 * p })
        if (topRef.current) gsap.set(topRef.current, { y: -40 * p, opacity: 1 - p })
        if (bottomRef.current) gsap.set(bottomRef.current, { y: 30 * p, opacity: 1 - p * 1.5 })
      }
    })

    const onMouse = e => {
      const mx = e.clientX / window.innerWidth - 0.5
      const my = e.clientY / window.innerHeight - 0.5
      gsap.to(topRef.current, { x: mx * 10, y: my * 8, duration: 0.6, ease: 'power2.out' })
      gsap.to(titleRef.current, { x: mx * 15, y: my * 10, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(photoRef.current, { x: mx * 25, y: my * 18, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    }
    const el = sectionRef.current
    const isHoverable = window.matchMedia('(hover: hover)').matches
    if (isHoverable) {
      el?.addEventListener('mousemove', onMouse)
    }
    return () => {
      if (isHoverable) {
        el?.removeEventListener('mousemove', onMouse)
      }
    }
  }, [])

  useEffect(() => {
    const icons = sectionRef.current?.querySelectorAll('.floating-icon')
    icons?.forEach((el, i) => {
      gsap.to(el, { y: -14, duration: 3 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })
      gsap.to(el, { rotation: gsap.utils.random(-6, 6), duration: 4 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    })
  }, [])

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      <div className="hero-top-bar" ref={topRef}>
        <span>JAIDEEP CHAITANYA</span>
        <span>GRAPHIC DESIGNER</span>
        <span>UI/UX DESIGNER</span>
      </div>
      <div className="hero-center">
        <h1 className="sr-only">Jaideep Chaitanya — Visual & UI/UX Designer</h1>
        <div className="hero-title" ref={titleRef} aria-hidden="true">
          {"Dz!ne".split('').map((c, i) => {
            if (c === '!') {
              return (
                <span key={i} style={{ display: 'inline-block', padding: '0 0.02em' }}>
                  <svg viewBox="0 0 100 300" style={{ height: '0.78em', width: 'auto', verticalAlign: 'baseline', transform: 'translateY(0.04em)' }} fill="currentColor">
                    <polygon points="0,0 100,0 90,200 10,200"/>
                    <polygon points="12,240 88,240 85,300 15,300"/>
                  </svg>
                </span>
              )
            }
            return (
              <span key={i} style={{ display: 'inline-block' }}>
                {c === ' ' ? '\u00A0' : c}
              </span>
            )
          })}
        </div>
        <div className="hero-photo" ref={photoRef}>
          <img src="/MY IMAGE.png" alt="Jaideep Chaitanya — Visual & UI/UX Designer" />
        </div>
        {/* Floating tool icons */}
        <div className="floating-icon fi-figma" style={{ top: '20%', left: '8%' }}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="#0ACF83"/><path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="#A259FF"/><path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="#F24E1E"/><path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="#FF7262"/><path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="#1ABCFE"/></svg>
          <span className="fi-label">FIGMA</span>
        </div>
        <div className="floating-icon fi-ai" style={{ top: '18%', right: '10%' }}>
          <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#330000"/><text x="12" y="17" textAnchor="middle" fill="#FF9A00" fontFamily="Raleway" fontSize="11" fontWeight="700">Ai</text></svg>
          <span className="fi-label">ILLUSTRATOR</span>
        </div>
        <div className="floating-icon fi-ps" style={{ bottom: '30%', left: '5%' }}>
          <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#001E36"/><text x="12" y="17" textAnchor="middle" fill="#31A8FF" fontFamily="Raleway" fontSize="11" fontWeight="700">Ps</text></svg>
          <span className="fi-label">PHOTOSHOP</span>
        </div>
        <div className="floating-icon fi-st" style={{ bottom: '25%', right: '8%' }}>
          <svg viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0a1a0a"/><text x="12" y="17" textAnchor="middle" fill="#7fd959" fontFamily="Raleway" fontSize="11" fontWeight="700">St</text></svg>
          <span className="fi-label">STITCH</span>
        </div>
      </div>
      {/* Rotating Badge with Logo */}
      <div className="hero-badge">
        <svg viewBox="0 0 100 100" width="96" height="96">
          <defs>
            <path id="circlePath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"/>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#7fd959" strokeWidth="0.5" opacity="0.3"/>
          <text fontSize="7" fill="#7fd959" letterSpacing="2" fontFamily="Raleway" fontWeight="600">
            <textPath href="#circlePath">CHAITANYA.DESIGNER ✦ DZINE ✦ HYDERABAD ✦</textPath>
          </text>
          <image href="/LOGO.svg" x="32" y="32" width="36" height="36" />
        </svg>
      </div>
      <div className="hero-bottom" ref={bottomRef}>
        <div className="hero-bottom-left">
          <h3>THE ART OF<br/>THINKING VISUALLY</h3>
          <p>Every pixel has a purpose<br/>Every design tells a story</p>
        </div>
        <div className="hero-bottom-right">
          <h3>EXPLORING THE<br/>FUTURE OF DESIGN<br/>THROUGH IMAGINATION<br/>AND INNOVATION</h3>
          <p>CHAITANYA VISUAL DESIGNER</p>
        </div>
      </div>
    </section>
  )
}
