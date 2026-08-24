import { useState, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import ThreeBackground from './components/ThreeBackground'
import Navigation from './components/Navigation'
import Hero from './components/Hero'

gsap.registerPlugin(ScrollTrigger)
import Marquee from './components/Marquee'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Skills from './components/Skills'
import BentoGrid from './components/BentoGrid'
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
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [show404, setShow404] = useState(window.location.hash === '#404')
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin')

  useEffect(() => {
    const onHash = () => {
      setShow404(window.location.hash === '#404')
      setShowAdmin(window.location.hash === '#admin')
    }
    window.addEventListener('hashchange', onHash)
    
    // Refresh ScrollTrigger when loader is gone and images are fully loaded
    if (!loading) {
      const images = document.querySelectorAll('img')
      let loadedCount = 0
      
      const onImageLoad = () => {
        loadedCount++
        if (loadedCount === images.length) {
          ScrollTrigger.refresh()
        }
      }
      
      if (images.length === 0) {
        ScrollTrigger.refresh()
      } else {
        images.forEach(img => {
          if (img.complete) {
            onImageLoad()
          } else {
            img.addEventListener('load', onImageLoad)
            img.addEventListener('error', onImageLoad) // Handle broken links safely
          }
        })
      }

      // Refresh on window load to capture all assets (fonts, WebGL canvas)
      const handleLoad = () => {
        ScrollTrigger.refresh()
      }
      window.addEventListener('load', handleLoad)
      
      // Fallback timeouts to ensure ScrollTrigger refreshes at multiple stages of loading
      const t1 = setTimeout(() => ScrollTrigger.refresh(), 1000)
      const t2 = setTimeout(() => ScrollTrigger.refresh(), 2500)
      const t3 = setTimeout(() => ScrollTrigger.refresh(), 4000)

      return () => {
        window.removeEventListener('hashchange', onHash)
        window.removeEventListener('load', handleLoad)
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    }
    
    return () => window.removeEventListener('hashchange', onHash)
  }, [loading])

  // Admin Panel — full-screen separate view
  if (showAdmin) {
    return (
      <AdminPanel onExit={() => {
        setShowAdmin(false)
        window.location.hash = ''
      }} />
    )
  }

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
        <BentoGrid />
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
