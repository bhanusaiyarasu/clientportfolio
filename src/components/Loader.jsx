import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const ref = useRef()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 4 + 1
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setTimeout(() => {
          const tl = gsap.timeline()
          const jEl = ref.current.querySelector('.jc-j')
          const cEl = ref.current.querySelector('.jc-c')
          // Letters explode outward
          tl.to(jEl, { x: '-200%', scale: 3, opacity: 0, duration: 0.7, ease: 'power4.in' }, 0)
            .to(cEl, { x: '200%', scale: 3, opacity: 0, duration: 0.7, ease: 'power4.in' }, 0)
            .to(ref.current, { yPercent: -100, duration: 0.8, ease: 'power4.inOut', onComplete }, 0.4)
        }, 400)
      }
      setProgress(Math.floor(p))
    }, 40)

    // Entry animation
    gsap.from('.jc-j', { scale: 0.3, opacity: 0, duration: 1, ease: 'elastic.out(1,0.5)', delay: 0.1 })
    gsap.from('.jc-c', { scale: 0.3, opacity: 0, duration: 1, ease: 'elastic.out(1,0.5)', delay: 0.25 })

    return () => clearInterval(iv)
  }, [onComplete])

  return (
    <div className="loader" ref={ref}>
      <div className="jc">
        <span className="jc-j">J</span>
        <span className="jc-c">C</span>
      </div>
      <div className="loader-scanline" />
      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: progress + '%' }} />
        </div>
        <div className="progress-num">{progress}%</div>
      </div>
    </div>
  )
}
