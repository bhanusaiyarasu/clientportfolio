import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getProjects, getCategories } from '../utils/projectStore'

gsap.registerPlugin(ScrollTrigger)

export default function Work() {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const sectionRef = useRef()
  const trackRef = useRef()

  // Mobile carousel state
  const [isMobile, setIsMobile] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const isSwiping = useRef(false)
  const autoPlayRef = useRef(null)

  // Load projects from store
  useEffect(() => {
    setProjects(getProjects())
    setCategories(getCategories())

    const onStorage = (e) => {
      if (e.key === 'portfolio_projects') {
        setProjects(getProjects())
        setCategories(getCategories())
      }
    }
    window.addEventListener('storage', onStorage)

    const onHashChange = () => {
      if (window.location.hash !== '#admin') {
        setProjects(getProjects())
        setCategories(getCategories())
      }
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  // Check mobile breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Filter projects
  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  // Reset slide on filter change
  useEffect(() => {
    setCurrentSlide(0)
  }, [activeCategory])

  // Mobile auto-play carousel
  useEffect(() => {
    if (!isMobile || filtered.length <= 1) return
    clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % filtered.length)
    }, 4000)
    return () => clearInterval(autoPlayRef.current)
  }, [isMobile, filtered.length, currentSlide])

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
    clearInterval(autoPlayRef.current)
  }

  const onTouchMove = (e) => {
    if (!touchStartX.current || !touchStartY.current) return
    const diffX = touchStartX.current - e.touches[0].clientX
    const diffY = touchStartY.current - e.touches[0].clientY
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      isSwiping.current = true
    }
  }

  const onTouchEnd = (e) => {
    if (!touchStartX.current) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const threshold = 40

    if (isSwiping.current && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left → next
        setCurrentSlide(prev => (prev + 1) % filtered.length)
      } else {
        // Swipe right → prev
        setCurrentSlide(prev => (prev - 1 + filtered.length) % filtered.length)
      }
    }

    touchStartX.current = null
    touchStartY.current = null
    isSwiping.current = false

    // Resume auto-play after swipe
    if (filtered.length > 1) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filtered.length)
      }, 4000)
    }
  }

  const goToSlide = (idx) => {
    setCurrentSlide(idx)
    clearInterval(autoPlayRef.current)
    if (filtered.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filtered.length)
      }, 4000)
    }
  }

  // Desktop GSAP horizontal scroll (only when cards overflow screen width)
  useEffect(() => {
    if (isMobile) return

    const track = trackRef.current
    if (!track || filtered.length === 0) return

    let ctx = null
    const timer = setTimeout(() => {
      const scrollAmount = track.scrollWidth - window.innerWidth

      if (scrollAmount > 60) {
        // Enable horizontal pinning scroll
        ctx = gsap.context(() => {
          gsap.to(track, {
            x: () => -scrollAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: () => '+=' + scrollAmount,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true
            }
          })
        }, sectionRef)
      } else {
        // Cards fit in screen: reset transform & refresh trigger
        gsap.set(track, { x: 0 })
      }
      ScrollTrigger.refresh()
    }, 50)

    // Hover listeners for titles
    const titles = sectionRef.current?.querySelectorAll('.work-title')
    const isHoverable = window.matchMedia('(hover: hover)').matches

    if (isHoverable && titles) {
      titles.forEach(title => {
        const letters = title.querySelectorAll('.letter')
        const onEnter = () => {
          gsap.to(letters, { color: '#7fd959', stagger: 0.02, duration: 0.4, ease: 'power2.out' })
        }
        const onLeave = () => {
          gsap.to(letters, { color: 'white', stagger: 0.01, duration: 0.3, ease: 'power2.in' })
        }
        title.addEventListener('mouseenter', onEnter)
        title.addEventListener('mouseleave', onLeave)
        title._onEnter = onEnter
        title._onLeave = onLeave
      })
    }

    return () => {
      clearTimeout(timer)
      if (ctx) ctx.revert()
      ScrollTrigger.refresh()
      if (isHoverable && titles) {
        titles.forEach(title => {
          if (title._onEnter) title.removeEventListener('mouseenter', title._onEnter)
          if (title._onLeave) title.removeEventListener('mouseleave', title._onLeave)
        })
      }
    }
  }, [filtered, isMobile, activeCategory])

  const hasFewCards = !isMobile && filtered.length > 0 && filtered.length <= 2

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="work-header-container">
        <div className="tag">— Featured Work</div>
        <h2 className="work-main-heading">Selected <em>Creations</em></h2>

        {/* Category Filter Bar */}
        {categories.length > 1 && (
          <div className="work-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`work-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="filter-count">
                    {projects.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <>
          {/* Desktop View */}
          {!isMobile && (
            <div className={`work-track-wrapper ${hasFewCards ? 'centered-layout' : ''}`}>
              <div className={`work-track ${hasFewCards ? 'few-cards' : ''}`} ref={trackRef}>
                {filtered.map((p, i) => (
                  <div className="work-card" key={p.id}>
                    <div className="work-card-top">
                      <div className="work-num">{String(i + 1).padStart(2, '0')}</div>
                      {p.category && <div className="work-category-badge">{p.category}</div>}
                    </div>
                    <h3 className="work-title">
                      {p.title.split('').map((c, j) => (
                        <span className="letter" key={j}>
                          {c === ' ' ? '\u00A0' : c}
                        </span>
                      ))}
                    </h3>
                    <div className="work-tags">
                      {p.tags?.map(t => <span key={t}>{t}</span>)}
                    </div>
                    <p className="work-desc">{p.description}</p>
                    <div className="work-visual">
                      <img src={p.coverImage} alt={p.title} loading="lazy" />
                      <div className="work-img-overlay" />
                      <div className="placeholder-overlay">VIEW CASE</div>
                    </div>
                    <div className="work-card-footer">
                      <span>{p.category || 'Design'}</span>
                      <span>{p.year || '2025'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mobile View: Automatic Carousel with Dots */}
          {isMobile && (
            <div className="work-carousel-container">
              <div
                className="work-carousel-viewport"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="work-carousel-slider"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {filtered.map((p, i) => (
                    <div className="work-carousel-item" key={p.id}>
                      <div className="work-card mobile-card">
                        <div className="work-card-top">
                          <div className="work-num">{String(i + 1).padStart(2, '0')}</div>
                          {p.category && <div className="work-category-badge">{p.category}</div>}
                        </div>
                        <h3 className="work-title mobile-title">
                          {p.title}
                        </h3>
                        <div className="work-tags">
                          {p.tags?.map(t => <span key={t}>{t}</span>)}
                        </div>
                        <p className="work-desc">{p.description}</p>
                        <div className="work-visual">
                          <img src={p.coverImage} alt={p.title} loading="lazy" />
                          <div className="work-img-overlay" />
                        </div>
                        <div className="work-card-footer">
                          <span>{p.category || 'Design'}</span>
                          <span>{p.year || '2025'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Carousel Navigation (Dots & Slide Indicator) */}
              <div className="work-carousel-controls">
                <button
                  className="carousel-arrow prev"
                  onClick={() => goToSlide((currentSlide - 1 + filtered.length) % filtered.length)}
                  aria-label="Previous project"
                >
                  ‹
                </button>
                <div className="work-carousel-dots">
                  {filtered.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
                      onClick={() => goToSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="carousel-arrow next"
                  onClick={() => goToSlide((currentSlide + 1) % filtered.length)}
                  aria-label="Next project"
                >
                  ›
                </button>
              </div>

              <div className="carousel-counter-label">
                {String(currentSlide + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="work-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(127,217,89,0.3)" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <p>No projects found in this category.</p>
        </div>
      )}
    </section>
  )
}
