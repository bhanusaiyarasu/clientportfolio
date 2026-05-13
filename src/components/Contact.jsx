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
        <a href="https://instagram.com/chaitanya.designer" target="_blank" rel="noreferrer" className="social-circle">IG</a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle">BE</a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle">LI</a>
        <a href="#" target="_blank" rel="noreferrer" className="social-circle">TW</a>
      </div>
      
      <div className="contact-footer-reveal-text">
        SCROLL TO UNVEIL
      </div>
    </section>
  )
}
