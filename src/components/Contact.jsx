import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Contact() {
  const sectionRef = useRef()
  const plusRef = useRef()

  useEffect(() => {
    const onMouseMove = (e) => {
      const rect = sectionRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(plusRef.current, {
        rotation: (x + y) * 0.1,
        duration: 0.5
      })
    }
    
    const section = sectionRef.current
    section.addEventListener('mousemove', onMouseMove)
    return () => section.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-plus" ref={plusRef}>+</div>
      <h2>Got a Project <em>in Mind?</em></h2>
      <p>Whether you're starting a new brand or need to overhaul an existing interface, I'm here to help you design something unforgettable.</p>
      
      <div className="contact-cta">
        <a href="mailto:contact@chaitanya.designer" className="magnetic-btn large">
          <span>HIRE ME</span>
        </a>
      </div>

      <div className="contact-social">
        <a href="https://instagram.com/chaitanya.designer" target="_blank" rel="noreferrer" className="social-circle" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle" aria-label="Behance">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v1.5h7V7zm-11.2 5.8c.8 0 1.5-.4 1.7-1.1.2-.5.2-1.1 0-1.6-.2-.6-.9-1-1.7-1h-2.1v3.7h2.1zm.5 4.3c.9 0 1.6-.4 1.9-1.2.2-.5.2-1.2 0-1.7-.3-.7-1-1.1-1.9-1.1h-2.5v4h2.5zm9.5-3.3c0-2.4-1.6-4.3-4.3-4.3-2.5 0-4.3 1.9-4.3 4.3 0 2.5 1.8 4.3 4.4 4.3 2 0 3.5-1.1 4-2.8h-1.9c-.3.7-.9 1.2-1.9 1.2-1.3 0-2.1-.9-2.2-2.2h6.1c.1-.2.1-.4.1-.6zm-2.1-1.1h-3.9c.1-1.2.9-2 2-2 1 0 1.8.8 1.9 2zM12.7 5.8C14 7 14.2 9.1 13.5 10.7c-.5 1-1.4 1.7-2.5 1.9 1.4.3 2.4 1.2 2.8 2.5.6 1.7.2 3.7-1.1 4.9-1.3 1.1-3 1.7-4.8 1.6H3V5.4h4.8c1.8-.1 3.6.4 4.9 1.4l-.1-.1z"/></svg>
        </a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle" aria-label="Twitter">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
      
      <div className="contact-footer-reveal-text">
        SCROLL TO UNVEIL
      </div>
    </section>
  )
}
