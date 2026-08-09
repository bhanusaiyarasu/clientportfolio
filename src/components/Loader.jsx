import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const ref = useRef()
  const ringRef = useRef()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 20 + 8
      if (p >= 100) {
        p = 100
        clearInterval(iv)
        setTimeout(() => {
          const tl = gsap.timeline({ onComplete })
          tl.to('.loader-center', { scale: 1.2, opacity: 0, duration: 0.4, ease: 'power4.in' })
            .to(ref.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, '-=0.2')
        }, 150)
      }
      setProgress(Math.floor(p))
    }, 20)

    // Continuous rotation for technical ring
    gsap.to(ringRef.current, { rotation: 360, duration: 10, repeat: -1, ease: 'none' })

    // Entry
    gsap.from('.loader-center', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'expo.out' })

    return () => clearInterval(iv)
  }, [onComplete])

  return (
    <div className="loader" ref={ref}>
      <div className="loader-scanline" />
      <div className="loader-center">
        <div className="loader-ring" ref={ringRef} />
        <div className="loader-ring loader-ring-outer" />
        <div className="jc">
          <span className="jc-j">J</span>
          <span className="jc-c">C</span>
        </div>
      </div>
      <div className="progress-wrap">
        <div className="progress-num">{progress}<span>%</span></div>
        <div className="progress-bar-minimal">
          <div className="progress-fill-minimal" style={{ width: progress + '%' }} />
        </div>
      </div>
      <div className="loader-tag">INITIALIZING CORE ASSETS...</div>
    </div>
  )
}
