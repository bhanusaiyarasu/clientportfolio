import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef()
  const dotRef = useRef()
  const bladeRef = useRef()
  const trailContainerRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const lastMouse = useRef({ x: 0, y: 0 })
  const angle = useRef(0)
  const speed = useRef(0)

  useEffect(() => {
    const cursor = cursorRef.current
    const dots = []
    const dotCount = 16

    // Create trail dots
    for (let i = 0; i < dotCount; i++) {
      const d = document.createElement('div')
      d.className = 'cursor-trail'
      d.style.opacity = (1 - i / dotCount) * 0.5
      trailContainerRef.current.appendChild(d)
      dots.push({ el: d, x: 0, y: 0 })
    }

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Calculate speed and angle for the blade
      const dx = mouse.current.x - lastMouse.current.x
      const dy = mouse.current.y - lastMouse.current.y
      speed.current = Math.sqrt(dx * dx + dy * dy)
      angle.current = Math.atan2(dy, dx) * (180 / Math.PI) + 90

      lastMouse.current.x = mouse.current.x
      lastMouse.current.y = mouse.current.y

      // Immediate dot position
      gsap.set(dotRef.current, { x: mouse.current.x, y: mouse.current.y })
      
      // Blade rotation and scale based on speed
      gsap.to(bladeRef.current, {
        x: mouse.current.x,
        y: mouse.current.y,
        rotation: angle.current,
        height: 36 + Math.min(speed.current * 2, 60),
        duration: 0.1,
        ease: 'power2.out'
      })
    }

    const animateTrail = () => {
      let x = mouse.current.x
      let y = mouse.current.y

      dots.forEach((dot, index) => {
        const nextDot = dots[index + 1] || { x, y }
        dot.x += (nextDot.x - dot.x) * 0.35
        dot.y += (nextDot.y - dot.y) * 0.35
        gsap.set(dot.el, { 
          x: dot.x, 
          y: dot.y,
          scale: 1 - index / dotCount
        })
      })

      requestAnimationFrame(animateTrail)
    }

    const onClick = (e) => {
      // Particle burst
      for (let i = 0; i < 6; i++) {
        const p = document.createElement('div')
        p.className = 'cursor-burst'
        p.style.left = e.clientX + 'px'
        p.style.top = e.clientY + 'px'
        document.body.appendChild(p)

        const a = (i / 6) * Math.PI * 2
        const dist = 50 + Math.random() * 50
        gsap.to(p, {
          x: Math.cos(a) * dist,
          y: Math.sin(a) * dist,
          opacity: 0,
          scale: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => p.remove()
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onClick)
    const trailAnim = requestAnimationFrame(animateTrail)

    // Hover effects
    const onHover = () => gsap.to([dotRef.current, bladeRef.current], { scale: 2.5, duration: 0.3 })
    const onLeave = () => gsap.to([dotRef.current, bladeRef.current], { scale: 1, duration: 0.3 })

    const interactive = document.querySelectorAll('a, button, .work-item, .hero-photo')
    interactive.forEach(el => {
      el.addEventListener('mouseenter', onHover)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onClick)
      cancelAnimationFrame(trailAnim)
      dots.forEach(d => d.el.remove())
    }
  }, [])

  return (
    <div className="cursor-wrap" ref={cursorRef}>
      <div className="cursor-trail-container" ref={trailContainerRef} />
      <div className="cursor-blade" ref={bladeRef} />
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
