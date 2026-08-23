import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef()
  const cardRef = useRef()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onMouse = e => {
      const rect = section.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / rect.width - 0.5
      const my = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(cardRef.current, { 
        rotateY: -10 + mx * 30, 
        rotateX: -my * 20,
        duration: 0.8, 
        ease: 'power2.out' 
      })
    }

    const portrait = section.querySelector('.about-portrait')
    const textItems = section.querySelectorAll('.about-text > *')
    const badge = section.querySelector('.about-badge')

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia()

      // Desktop animations & mouse listener
      mm.add("(min-width: 769px)", () => {
        section.addEventListener('mousemove', onMouse)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true
          }
        })

        tl.fromTo(portrait, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' })
          .fromTo(textItems, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
          .fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
      })

      // Mobile animations (no mouse listener, vertical entry instead of horizontal to prevent overflow)
      mm.add("(max-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            once: true
          }
        })

        tl.fromTo(portrait, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' })
          .fromTo(textItems, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
          .fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
      })
    }, sectionRef)

    // Universal fallback
    const timer = setTimeout(() => {
        gsap.set([portrait, ...textItems, badge], { opacity: 1, x: 0, y: 0, scale: 1 })
    }, 4000)

    return () => {
        section.removeEventListener('mousemove', onMouse)
        clearTimeout(timer)
        ctx.revert()
    }
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
          <img src="/jaideep.jpeg" alt="Jaideep Chaitanya — Visual & UI/UX Designer" />
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
