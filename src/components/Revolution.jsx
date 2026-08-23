import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const panels = [
  {
    num: '01', title: 'UI/UX DESIGN', headline: 'Crafting Seamless Digital Experiences',
    desc: 'From wireframes to high-fidelity prototypes, creating interfaces that feel intuitive and look stunning.',
    svg: (
      <svg viewBox="0 0 400 300" fill="none">
        <rect x="40" y="20" width="320" height="200" rx="8" stroke="#7fd959" strokeWidth="1.8" opacity="0.75"/>
        <rect x="40" y="20" width="320" height="24" rx="8" stroke="#7fd959" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="56" cy="32" r="4" fill="#ff5f57" opacity="0.95"/><circle cx="70" cy="32" r="4" fill="#ffbd2e" opacity="0.95"/><circle cx="84" cy="32" r="4" fill="#28ca42" opacity="0.95"/>
        <rect x="60" y="60" width="120" height="12" rx="2" stroke="#7fd959" strokeWidth="1.5" opacity="0.65"/>
        <rect x="60" y="84" width="80" height="8" rx="2" stroke="#7fd959" strokeWidth="1.2" opacity="0.45"/>
        <rect x="60" y="100" width="280" height="100" rx="4" stroke="#7fd959" strokeWidth="1.5" opacity="0.6"/>
        <line x1="80" y1="180" x2="120" y2="130" stroke="#7fd959" strokeWidth="2.2" opacity="0.8"/>
        <line x1="120" y1="130" x2="180" y2="160" stroke="#7fd959" strokeWidth="2.2" opacity="0.8"/>
        <line x1="180" y1="160" x2="240" y2="120" stroke="#7fd959" strokeWidth="2.2" opacity="0.8"/>
        <line x1="240" y1="120" x2="320" y2="145" stroke="#7fd959" strokeWidth="2.2" opacity="0.8"/>
        <rect x="200" y="60" width="60" height="24" rx="4" fill="#7fd959" opacity="0.4"/>
        <rect x="270" y="60" width="60" height="24" rx="4" stroke="#7fd959" strokeWidth="1.5" opacity="0.6"/>
      </svg>
    )
  },
  {
    num: '02', title: 'VISUAL DESIGN', headline: 'Where Color Meets Meaning',
    desc: 'Building visual systems that communicate brand identity through every element — color, type, and composition.',
    svg: (
      <svg viewBox="0 0 400 300" fill="none">
        <circle cx="200" cy="150" r="80" stroke="#7fd959" strokeWidth="1.8" opacity="0.75"/>
        <circle cx="200" cy="150" r="55" stroke="#7fd959" strokeWidth="1.5" opacity="0.55"/>
        <circle cx="200" cy="150" r="30" fill="#7fd959" opacity="0.3"/>
        {[0,60,120,180,240,300].map((a,i) => <circle key={i} cx={200+Math.cos(a*Math.PI/180)*100} cy={150+Math.sin(a*Math.PI/180)*100} r="12" stroke="#7fd959" strokeWidth="1.5" opacity="0.7"/>)}
        <polygon points="200,80 160,150 200,130 240,150" stroke="#7fd959" strokeWidth="1.5" opacity="0.6" fill="none"/>
        <rect x="170" y="170" width="60" height="40" rx="4" stroke="#7fd959" strokeWidth="1.5" opacity="0.6" fill="none"/>
      </svg>
    )
  },
  {
    num: '03', title: 'LOGO DESIGN', headline: 'Symbols That Define Brands',
    desc: 'From concept to vector — designing marks that are clean, bold, and instantly recognizable.',
    svg: (
      <svg viewBox="0 0 400 300" fill="none">
        <polygon points="200,40 340,200 60,200" stroke="#7fd959" strokeWidth="1.8" opacity="0.8" fill="none"/>
        <circle cx="200" cy="155" r="55" stroke="#7fd959" strokeWidth="1.5" opacity="0.65" fill="none"/>
        <rect x="155" y="100" width="90" height="90" stroke="#7fd959" strokeWidth="1.5" opacity="0.6" fill="none"/>
        <line x1="200" y1="40" x2="200" y2="250" stroke="#7fd959" strokeWidth="1.0" opacity="0.4"/>
        <line x1="60" y1="155" x2="340" y2="155" stroke="#7fd959" strokeWidth="1.0" opacity="0.4"/>
        <circle cx="200" cy="155" r="8" fill="#7fd959" opacity="0.45"/>
      </svg>
    )
  },
  {
    num: '04', title: 'PACKAGE DESIGN', headline: 'Unboxing the Extraordinary',
    desc: 'Designing packaging that stops people mid-aisle and creates memorable unboxing experiences.',
    svg: (
      <svg viewBox="0 0 400 300" fill="none">
        <path d="M120,220 L120,80 L200,50 L280,80 L280,220 L200,250 Z" stroke="#7fd959" strokeWidth="1.8" opacity="0.85" fill="none"/>
        <line x1="200" y1="50" x2="200" y2="250" stroke="#7fd959" strokeWidth="1.5" opacity="0.6"/>
        <line x1="120" y1="80" x2="280" y2="80" stroke="#7fd959" strokeWidth="1.5" opacity="0.6"/>
        <path d="M200,50 L200,80" stroke="#7fd959" strokeWidth="1.5" opacity="0.45"/>
        <path d="M80,240 L80,120 L140,95 L200,120 L200,240 L140,265 Z" stroke="#7fd959" strokeWidth="1.2" opacity="0.45" fill="none" transform="translate(-30,20) scale(0.6)"/>
        <path d="M240,240 L240,120 L300,95 L360,120 L360,240 L300,265 Z" stroke="#7fd959" strokeWidth="1.2" opacity="0.45" fill="none" transform="translate(40,10) scale(0.5)"/>
        <circle cx="200" cy="150" r="3" fill="#7fd959" opacity="0.85"/>
        <line x1="200" y1="147" x2="200" y2="115" stroke="#7fd959" strokeWidth="1.2" opacity="0.6"/>
      </svg>
    )
  }
]

export default function Revolution() {
  const sectionRef = useRef()
  const trackRef = useRef()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia()

      // Desktop: Horizontal Scroll & Pinning
      mm.add("(min-width: 769px)", () => {
        const scroll = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            id: 'revScroll',
            trigger: sectionRef.current,
            start: 'top top',
            end: () => '+=' + (track.scrollWidth - window.innerWidth),
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          }
        })

        track.querySelectorAll('.rev-panel').forEach((panel) => {
          gsap.from(panel.querySelector('.rev-text'), {
            x: 100, 
            opacity: 0, 
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { 
                trigger: panel, 
                start: 'left 80%', 
                containerAnimation: scroll, 
                toggleActions: 'play none none none' 
            }
          })
          gsap.from(panel.querySelector('.rev-visual'), {
            scale: 0.8,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: panel,
                start: 'left 70%',
                containerAnimation: scroll,
                toggleActions: 'play none none none'
            }
          })
        })
      })

      // Mobile: Vertical layout, simple fade in
      mm.add("(max-width: 768px)", () => {
        track.querySelectorAll('.rev-panel').forEach((panel) => {
          gsap.from(panel.querySelector('.rev-text'), {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          })
          gsap.from(panel.querySelector('.rev-visual'), {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          })
        })
      })
    }, sectionRef)

    return () => {
        ctx.revert()
    }
  }, [])

  return (
    <section className="revolution" id="revolution" ref={sectionRef}>
      <div className="rev-track" ref={trackRef}>
        {panels.map((p, i) => (
          <div className="rev-panel" key={i}>
            <div className="rev-visual">{p.svg}</div>
            <div className="rev-text">
              <span className="rev-num">{p.num} / {p.title}</span>
              <h3>{p.headline}</h3>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rev-dots">
        {panels.map((_, i) => <span key={i} className="rev-dot" />)}
      </div>
    </section>
  )
}
