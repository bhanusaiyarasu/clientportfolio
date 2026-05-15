import { useState, useEffect } from 'react'
import Loader from './components/Loader'
import ThreeBackground from './components/ThreeBackground'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Skills from './components/Skills'
import Revolution from './components/Revolution'
import Work from './components/Work'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Stats from './components/Stats'
import Tools from './components/Tools'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Page404 from './components/Page404'
import CustomCursor from './components/CustomCursor'
import SectionIndicator from './components/SectionIndicator'
import ScrollVelocityBar from './components/ScrollVelocityBar'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [show404, setShow404] = useState(window.location.hash === '#404')

  useEffect(() => {
    const onHash = () => setShow404(window.location.hash === '#404')
    window.addEventListener('hashchange', onHash)
    
    // Refresh ScrollTrigger when loader is gone
    if (!loading) {
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 500)
    }
    
    return () => window.removeEventListener('hashchange', onHash)
  }, [loading])

  return (
    <>
      <div className="grain" />
      <ScrollVelocityBar />
      <div className="scroll-velocity-bar"><div className="velocity-fill" /></div>
      <CustomCursor />

      <ThreeBackground />
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <Navigation onShow404={() => setShow404(true)} />
      <SectionIndicator />
      <div id="scroll-root">
        <Hero loaded={!loading} />
        <Marquee />
        <About />
        <Philosophy />
        <Skills />
        <Revolution />
        <Work />
        <Process />
        <Testimonials />
        <Stats />
        <Tools />
        <Contact />
      </div>
      <Footer />
      <Page404 visible={show404} onClose={() => { setShow404(false); window.location.hash = '' }} />
    </>
  )
}
