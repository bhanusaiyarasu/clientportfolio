import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Page404({ visible, onClose }) {
  const containerRef = useRef()
  const sceneRef = useRef()

  useEffect(() => {
    if (!visible) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // GLSL Distortion Shader
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uVisible: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 2.0 + uTime) * 0.2;
          pos.z += cos(pos.y * 2.0 + uTime) * 0.2;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          float noise = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
          gl_FragColor = vec4(0.498, 0.851, 0.349, noise * 0.2);
        }
      `
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const animate = (time) => {
      material.uniforms.uTime.value = time * 0.001
      renderer.render(scene, camera)
      sceneRef.current = requestAnimationFrame(animate)
    }
    sceneRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // RGB Glitch animation
    const tl = gsap.timeline({ repeat: -1 })
    tl.to('.page-404 h1', { skewX: 20, duration: 0.1, ease: 'power4.inOut' })
      .to('.page-404 h1', { skewX: 0, duration: 0.1 })
      .to('.page-404 h1', { x: -10, duration: 0.05 }, '+=1')
      .to('.page-404 h1', { x: 10, duration: 0.05 })
      .to('.page-404 h1', { x: 0, duration: 0.05 })

    return () => {
      cancelAnimationFrame(sceneRef.current)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`page-404 ${visible ? 'show' : ''}`}>
      <div className="p404-bg" ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: -1 }} />
      <div className="p404-content">
        <h1 data-text="404">404</h1>
        <p className="subtitle">SIGNAL LOST</p>
        <p className="desc">The dimension you are looking for does not exist or has been deleted.</p>
        <button className="back-btn" onClick={onClose}>
          <span>RETURN TO REALITY</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M1 8l4-4M1 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}
