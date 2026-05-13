import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const tools = [
  { name: 'Figma', icon: 'Fi', desc: 'Interface design and prototyping' },
  { name: 'Illustrator', icon: 'Ai', desc: 'Vector illustration and logo craft' },
  { name: 'Photoshop', icon: 'Ps', desc: 'Photo manipulation and visual art' },
  { name: 'Stitch', icon: 'St', desc: 'Advanced packaging design tool' },
  { name: 'InDesign', icon: 'Id', desc: 'Layout and print production' },
  { name: 'After Effects', icon: 'Ae', desc: 'Motion graphics and animation' }
]

export default function Tools() {
  const sectionRef = useRef()

  useEffect(() => {
    const rows = sectionRef.current.querySelectorAll('.tool-row')
    rows.forEach((row, i) => {
      gsap.from(row, {
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      })
    })

    const dots = sectionRef.current.querySelectorAll('.orbit-dot')
    dots.forEach((dot, i) => {
      gsap.to(dot, {
        rotationY: 360,
        duration: 20 + i * 5,
        repeat: -1,
        ease: 'none'
      })
    })
  }, [])

  return (
    <section className="tools-section" id="tools" ref={sectionRef}>
      <div className="tools-left">
        <span className="tag">— Toolbox</span>
        <h2>Mastering the <em>Digital</em> Forge</h2>
        <div className="tool-list">
          {tools.map((t, i) => (
            <div className="tool-row" key={i}>
              <div className="tool-icon">{t.icon}</div>
              <div className="tool-info">
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="tools-right">
        <div className="orbit-rig">
          <div className="orbit-center" />
          <div className="orbit-ring outer">
            {['Ps', 'Ai', 'Ae'].map((icon, i) => (
              <div className="orbit-dot" key={i} style={{ transform: `rotate(${(i * 120)}deg) translate(150px) rotate(${-(i * 120)}deg)` }}>
                {icon}
              </div>
            ))}
          </div>
          <div className="orbit-ring inner">
            {['Fi', 'Id', 'St'].map((icon, i) => (
              <div className="orbit-dot" key={i} style={{ transform: `rotate(${(i * 120 + 60)}deg) translate(100px) rotate(${-(i * 120 + 60)}deg)` }}>
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
