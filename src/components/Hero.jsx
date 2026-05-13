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
    const title = titleRef.current
    const chars = title.textContent.split('')
    title.innerHTML = chars.map(c => `<span style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`).join('')
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from(title.querySelectorAll('span'), { scaleY: 0, transformOrigin: 'bottom', duration: 1.2, stagger: 0.06 }, 0)
      .from(photoRef.current, { clipPath: 'inset(100% 0 0 0)', duration: 1.4 }, 0.2)
      .to(photoRef.current, { clipPath: 'inset(0 0 0 0)', duration: 1.4 }, 0.2)
      .from(topRef.current.querySelectorAll('span'), { y: -30, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.3)
      .from(bottomRef.current.querySelectorAll('.hero-bottom-left, .hero-bottom-right'), { x: (i) => i === 0 ? -60 : 60, opacity: 0, duration: 1 }, 0.5)
      .from(sectionRef.current.querySelectorAll('.floating-icon'), { scale: 0.3, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'back.out(1.7)' }, 0.8)
      .from('.hero-badge', { scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1,0.6)' }, 1.2)
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
    el?.addEventListener('mousemove', onMouse)
    return () => el?.removeEventListener('mousemove', onMouse)
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
        <h1 className="hero-title" ref={titleRef}>Dz!ne</h1>
        <div className="hero-photo" ref={photoRef}>
          {/* SVG Silhouette Placeholder — replace with real photo */}
          <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bodyGrad" x1="200" y1="0" x2="200" y2="600" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#1a1a1a"/>
                <stop offset="1" stopColor="#0a0a0a"/>
              </linearGradient>
              <filter id="rimGlow">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feFlood floodColor="#7fd959" floodOpacity="0.3"/>
                <feComposite in2="blur" operator="in"/>
                <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Head */}
            <ellipse cx="200" cy="120" rx="65" ry="75" fill="#1a1a1a" filter="url(#rimGlow)"/>
            {/* Hair */}
            <ellipse cx="200" cy="90" rx="62" ry="48" fill="#111"/>
            {/* Glasses */}
            <rect x="155" y="110" width="35" height="22" rx="3" fill="none" stroke="#333" strokeWidth="2"/>
            <rect x="210" y="110" width="35" height="22" rx="3" fill="none" stroke="#333" strokeWidth="2"/>
            <line x1="190" y1="121" x2="210" y2="121" stroke="#333" strokeWidth="1.5"/>
            {/* Face features */}
            <ellipse cx="172" cy="120" rx="4" ry="5" fill="#222"/>
            <ellipse cx="228" cy="120" rx="4" ry="5" fill="#222"/>
            <path d="M185 148 Q200 158 215 148" fill="none" stroke="#222" strokeWidth="1.5"/>
            {/* Neck */}
            <rect x="185" y="190" width="30" height="30" fill="#1a1a1a"/>
            {/* Shoulders & Body — Flannel Shirt */}
            <path d="M100 260 Q100 220 140 210 L185 200 L200 220 L215 200 L260 210 Q300 220 300 260 L310 600 L90 600 Z" fill="url(#bodyGrad)" filter="url(#rimGlow)"/>
            {/* Shirt pattern lines */}
            <line x1="130" y1="230" x2="130" y2="600" stroke="#222" strokeWidth="0.5" opacity="0.4"/>
            <line x1="170" y1="220" x2="170" y2="600" stroke="#222" strokeWidth="0.5" opacity="0.4"/>
            <line x1="230" y1="220" x2="230" y2="600" stroke="#222" strokeWidth="0.5" opacity="0.4"/>
            <line x1="270" y1="230" x2="270" y2="600" stroke="#222" strokeWidth="0.5" opacity="0.4"/>
            <line x1="90" y1="300" x2="310" y2="300" stroke="#222" strokeWidth="0.5" opacity="0.3"/>
            <line x1="90" y1="380" x2="310" y2="380" stroke="#222" strokeWidth="0.5" opacity="0.3"/>
            <line x1="90" y1="460" x2="310" y2="460" stroke="#222" strokeWidth="0.5" opacity="0.3"/>
            {/* Inner T-shirt */}
            <path d="M175 210 L200 230 L225 210 L225 350 L175 350 Z" fill="#111" opacity="0.6"/>
            {/* Collar */}
            <path d="M175 210 L200 230 L225 210" fill="none" stroke="#252525" strokeWidth="1.5"/>
          </svg>
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
      {/* Rotating Badge */}
      <div className="hero-badge">
        <svg viewBox="0 0 100 100" width="96" height="96">
          <defs>
            <path id="circlePath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"/>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#7fd959" strokeWidth="0.5" opacity="0.3"/>
          <text fontSize="7" fill="#7fd959" letterSpacing="2" fontFamily="Raleway" fontWeight="600">
            <textPath href="#circlePath">CHAITANYA.DESIGNER ✦ DZINE ✦ HYDERABAD ✦</textPath>
          </text>
          <text x="50" y="54" textAnchor="middle" fill="#7fd959" fontSize="14" fontFamily="Raleway" fontWeight="900">JC</text>
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
