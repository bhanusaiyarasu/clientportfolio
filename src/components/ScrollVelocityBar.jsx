import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVelocityBar() {
  useEffect(() => {
    const fill = document.querySelector('.velocity-fill')
    if (!fill) return

    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity())
        const normalized = Math.min(velocity / 2000, 1)
        gsap.to(fill, {
          width: `${normalized * 100}%`,
          duration: 0.1,
          ease: 'power1.out'
        })
      }
    })
  }, [])

  return null // The DOM element is already in App.jsx
}
