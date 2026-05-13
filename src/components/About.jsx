import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef()
  const cardRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    const onMouse = e => {
      const rect = section.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / rect.width - 0.5
      gsap.to(cardRef.current, { rotateY: -10 + mx * 20, duration: 0.6, ease: 'power2.out' })
    }
    section.addEventListener('mousemove', onMouse)

    gsap.from(section.querySelector('.about-portrait'), { x: -80, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none none' } })
    gsap.from(section.querySelectorAll('.about-text > *'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section.querySelector('.about-text'), start: 'top 70%', toggleActions: 'play none none none' } })
    gsap.from(section.querySelector('.about-badge'), { scale: 0, duration: 1, ease: 'elastic.out(1,0.6)', scrollTrigger: { trigger: section.querySelector('.about-badge'), start: 'top 85%', toggleActions: 'play none none none' } })

    return () => section.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-portrait">
        <div className="about-portrait-inner" ref={cardRef}>
          <div className="corner-accent tl" />
          <div className="corner-accent br" />
          <div className="sonar-ring" />
          <div className="sonar-ring" />
          <div className="sonar-ring" />
          <img src="/jaideep.png" alt="Jaideep Chaitanya" />
          <div className="about-badge">4+<br/>YRS</div>
        </div>
      </div>
      <div className="about-text">
        <div className="tag">— About Me</div>
        <h2>The Art of Thinking <em>Visually</em></h2>
        <p>I'm Jaideep Chaitanya — a multidisciplinary designer who lives at the crossroads of aesthetics and function. 4 years of turning ideas into identities — through screens, brands, and beyond.</p>
        <p>With 2 years in UI/UX design and 2 years in visual, logo &amp; package design, I've built a diverse toolkit for creating brands that speak and interfaces that feel effortless.</p>
        <p>Under Dzine — where imagination meets innovation — I believe every design tells a story. My mission? Make yours unforgettable.</p>
        <div className="skill-chips">
          {['UI/UX','Visual Design','Logo Design','Package Design','Figma','Brand Identity'].map(s => <span key={s}>{s}</span>)}
        </div>
      </div>
    </section>
  )
}
