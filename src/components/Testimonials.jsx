import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const quotes = [
  { text: 'Working with Jaideep was transformative. He didn\'t just design our app — he redesigned how our users felt.', name: 'Arjun Mehta', title: 'CEO, TechVista' },
  { text: 'The logo Jaideep created became the face of our brand. Clean, bold, and instantly recognizable.', name: 'Priya Sharma', title: 'Founder, Bloomcraft' },
  { text: 'His package design doubled our shelf conversion rate. That\'s not design. That\'s strategy wearing a beautiful disguise.', name: 'Kiran Rao', title: 'Brand Director, Luxeva' },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef()
  const timerRef = useRef()
  const prevActiveRef = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const slides = section.querySelectorAll('.test-slide')
    const prevIdx = prevActiveRef.current

    if (prevIdx !== active) {
      const prevSlide = slides[prevIdx]
      const nextSlide = slides[active]

      if (prevSlide) {
        gsap.to(prevSlide, { 
          opacity: 0, 
          scale: 1.04, 
          filter: 'blur(8px)', 
          duration: 0.6,
          onComplete: () => {
            prevSlide.classList.remove('visible')
          }
        })
      }

      if (nextSlide) {
        nextSlide.classList.add('visible')
        gsap.fromTo(nextSlide, 
          { opacity: 0, scale: 0.96, filter: 'blur(8px)' }, 
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6 }
        )
      }
      prevActiveRef.current = active
    }
  }, [active])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % quotes.length)
    }, 6000)

    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        clearInterval(timerRef.current)
        setActive(prev => (prev + 1) % quotes.length)
      }
      if (e.key === 'ArrowLeft') {
        clearInterval(timerRef.current)
        setActive(prev => (prev - 1 + quotes.length) % quotes.length)
      }
    }
    window.addEventListener('keydown', onKey)

    return () => { 
      clearInterval(timerRef.current)
      window.removeEventListener('keydown', onKey) 
    }
  }, [])

  const handleDot = (i) => { 
    clearInterval(timerRef.current)
    setActive(i) 
  }

  return (
    <section className="testimonials" id="testimonials" ref={sectionRef}>
      {quotes.map((q, i) => (
        <div key={i} className={`test-slide ${i === active ? 'visible' : ''}`}>
          <span className="test-quote">"</span>
          <blockquote>{q.text}</blockquote>
          <div className="test-sep" />
          <div className="test-author">{q.name}</div>
          <div className="test-title">{q.title}</div>
        </div>
      ))}
      <div className="test-dots">
        {quotes.map((_, i) => (
          <span key={i} className={`test-dot ${active === i ? 'active' : ''}`} onClick={() => handleDot(i)} />
        ))}
      </div>
    </section>
  )
}
