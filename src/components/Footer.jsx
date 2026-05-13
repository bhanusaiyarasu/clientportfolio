import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef()

  useEffect(() => {
    const footer = footerRef.current
    // Letter hover effect on DZINE
    const letters = footer.querySelectorAll('.footer-letter')
    letters.forEach(l => {
      l.addEventListener('mouseenter', () => gsap.to(l, { scale: 1.08, duration: 0.3, ease: 'power2.out' }))
      l.addEventListener('mouseleave', () => gsap.to(l, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' }))
    })

    gsap.from(letters, {
      y: -60, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: footer, start: 'top 80%', toggleActions: 'play none none none' }
    })

    gsap.from(footer.querySelectorAll('.footer-mid, .footer-cols, .footer-copy'), {
      y: 40, opacity: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: footer, start: 'top 70%', toggleActions: 'play none none none' }
    })
  }, [])

  return (
    <footer className="site-footer" id="footer" ref={footerRef}>
      <div className="footer-hero">
        <h2>
          {'DZINE'.split('').map((c, i) => (
            <span className="footer-letter" key={i}>{c}</span>
          ))}
        </h2>
        <p>Visual &amp; UI/UX Designer · Hyderabad, India</p>
      </div>

      <div className="footer-mid">
        <div className="left">
          <h3>JAIDEEP<br/>CHAITANYA</h3>
          <p>Hyderabad, India</p>
        </div>
        <div className="right">
          <label htmlFor="newsletter">SIGN UP FOR OUR NEWSLETTER</label>
          <div className="newsletter-row">
            <input type="email" id="newsletter" placeholder="ENTER EMAIL" />
            <button className="newsletter-btn" aria-label="Subscribe">→</button>
          </div>
        </div>
      </div>

      <div className="footer-cols">
        <div>
          <div className="col-label">Social</div>
          <a href="https://instagram.com/chaitanya.designer" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#" target="_blank" rel="noreferrer">Behance</a>
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <div>
          <div className="col-label">Contact</div>
          <a href="mailto:contact@chaitanya.designer">contact@chaitanya.designer</a>
          <a href="https://chaitanya.designer" target="_blank" rel="noreferrer">chaitanya.designer</a>
          <a>Hyderabad, India</a>
        </div>
        <div />
      </div>

      <div className="footer-copy">
        <span>© 2026 Jaideep Chaitanya · Dzine</span>
        <span>Privacy Policy</span>
      </div>
    </footer>
  )
}
