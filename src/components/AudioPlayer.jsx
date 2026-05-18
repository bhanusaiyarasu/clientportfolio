import { useState, useEffect, useRef } from 'react'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.log("Audio play failed:", err))
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    // Optional: Try to auto-play on first user interaction if not already playing
    const handleFirstInteraction = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(err => {
          console.log("Autoplay prevented:", err)
        })
        
        window.removeEventListener('click', handleFirstInteraction)
        window.removeEventListener('keydown', handleFirstInteraction)
        window.removeEventListener('scroll', handleFirstInteraction)
      }
    }
    
    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('keydown', handleFirstInteraction)
    window.addEventListener('scroll', handleFirstInteraction)
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
      window.removeEventListener('scroll', handleFirstInteraction)
    }
  }, [isPlaying])

  return (
    <>
      {/* 
        NOTE: Place your background music file in the "public" folder and name it "bgm.mp3".
        For example: public/bgm.mp3
      */}
      <audio ref={audioRef} loop src="https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3" preload="auto" />
      <button 
        onClick={(e) => {
          e.stopPropagation()
          togglePlay()
        }}
        className={`audio-toggle-btn ${isPlaying ? 'playing' : ''}`}
        aria-label="Toggle Background Music"
      >
        <div className="audio-bars">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </button>
    </>
  )
}
