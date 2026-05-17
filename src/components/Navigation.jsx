import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

export default function Navigation({ onShow404 }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const overlayRef = useRef()
  const [time, setTime] = useState('')
  const lastScrollY = useRef(0)
  const scrollTimer = useRef(null)

  useEffect(() => {
    let prevY = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      // Auto-hide on scroll down, show on scroll up
      if (y > prevY && y > 300) {
        clearTimeout(scrollTimer.current)
        scrollTimer.current = setTimeout(() => setHidden(true), 100)
      } else {
        setHidden(false)
      }
      prevY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(iv); clearTimeout(scrollTimer.current) }
  }, [])

  const toggleMenu = () => {
    const next = !menuOpen
    setMenuOpen(next)
    if (next) {
      gsap.to(overlayRef.current, { clipPath: 'inset(0 0 0 0%)', duration: 0.8, ease: 'power4.out' })
      gsap.from(overlayRef.current.querySelectorAll('.menu-items li'), { y: 80, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.2 })
    } else {
      gsap.to(overlayRef.current, { clipPath: 'inset(0 0 0 100%)', duration: 0.5, ease: 'power4.in' })
    }
  }

  const closeAndScroll = (href) => {
    setMenuOpen(false)
    gsap.to(overlayRef.current, { clipPath: 'inset(0 0 0 100%)', duration: 0.5, ease: 'power4.in' })
    if (href === '#404') {
      onShow404()
    } else {
      setTimeout(() => gsap.to(window, { scrollTo: href, duration: 1, ease: 'power3.inOut' }), 300)
    }
  }

  const navScroll = (e, href) => {
    e.preventDefault()
    gsap.to(window, { scrollTo: href, duration: 1.2, ease: 'power3.inOut' })
  }

  const links = ['About', 'Skills', 'Work', 'Contact']
  const menuLinks = ['About', 'Skills', 'Work', 'Process', 'Contact']

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}${hidden ? ' nav-hidden' : ''}`}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/LOGO2.svg" alt="Dzine · JC" style={{ height: '36px', width: 'auto' }} />
        </div>
        <div className="nav-clock">{time} IST</div>
        <ul className="nav-links">
          {links.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`} onClick={e => navScroll(e, `#${l.toLowerCase()}`)}>{l}</a></li>
          ))}
        </ul>
        <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className="menu-overlay" ref={overlayRef}>
        <div className="menu-header">
          <span className="menu-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/LOGO2.svg" alt="Dzine · JC" style={{ height: '36px', width: 'auto' }} />
          </span>
          <button className="menu-close" onClick={toggleMenu}>✕</button>
        </div>
        <ul className="menu-items">
          {menuLinks.map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`} onClick={e => { e.preventDefault(); closeAndScroll(`#${l.toLowerCase()}`) }}>{l}</a></li>
          ))}
        </ul>
        <div className="menu-footer">
          <div className="menu-status">
            <span className="status-dot" />
            <span>Available for work · 2026</span>
          </div>
          <div className="menu-contact-info">
            <span>chaitanya.designer</span>
            <span>Hyderabad, India · {time} IST</span>
          </div>
        </div>
        <div className="menu-social">
          <a href="https://instagram.com/chaitanya.designer" target="_blank" rel="noreferrer">IG</a>
          <a href="#" target="_blank" rel="noreferrer">BE</a>
          <a href="#" target="_blank" rel="noreferrer">LI</a>
        </div>
      </div>
    </>
  )
}
