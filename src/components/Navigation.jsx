import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import AudioPlayer from './AudioPlayer'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <AudioPlayer />
          <button className={`hamburger${menuOpen ? ' active' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
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
        <div className="menu-bottom">
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
            <a href="https://instagram.com/chaitanya.designer" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" target="_blank" rel="noreferrer" aria-label="Behance">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v1.5h7V7zm-11.2 5.8c.8 0 1.5-.4 1.7-1.1.2-.5.2-1.1 0-1.6-.2-.6-.9-1-1.7-1h-2.1v3.7h2.1zm.5 4.3c.9 0 1.6-.4 1.9-1.2.2-.5.2-1.2 0-1.7-.3-.7-1-1.1-1.9-1.1h-2.5v4h2.5zm9.5-3.3c0-2.4-1.6-4.3-4.3-4.3-2.5 0-4.3 1.9-4.3 4.3 0 2.5 1.8 4.3 4.4 4.3 2 0 3.5-1.1 4-2.8h-1.9c-.3.7-.9 1.2-1.9 1.2-1.3 0-2.1-.9-2.2-2.2h6.1c.1-.2.1-.4.1-.6zm-2.1-1.1h-3.9c.1-1.2.9-2 2-2 1 0 1.8.8 1.9 2zM12.7 5.8C14 7 14.2 9.1 13.5 10.7c-.5 1-1.4 1.7-2.5 1.9 1.4.3 2.4 1.2 2.8 2.5.6 1.7.2 3.7-1.1 4.9-1.3 1.1-3 1.7-4.8 1.6H3V5.4h4.8c1.8-.1 3.6.4 4.9 1.4l-.1-.1z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
