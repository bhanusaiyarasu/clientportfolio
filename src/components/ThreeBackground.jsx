import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThreeBackground() {
  const containerRef = useRef()
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ──── SCENE SETUP ────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500)
    camera.position.set(0, 2, 28)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    // ──── LIGHTING ────
    const amb = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(amb)
    const dir = new THREE.DirectionalLight(0x7fd959, 1.0)
    dir.position.set(8, 12, 10)
    scene.add(dir)
    const pt = new THREE.PointLight(0x00ffaa, 0.5, 80)
    pt.position.set(-10, 5, 15)
    scene.add(pt)

    scene.fog = new THREE.FogExp2(0x030303, 0.006)

    // ──── GRID PLANE ────
    const grid = new THREE.GridHelper(100, 50, 0x7fd959, 0x7fd959)
    grid.position.y = -12
    grid.material.transparent = true
    grid.material.opacity = 0.2
    grid.material.depthWrite = false
    scene.add(grid)

    // ──── PARTICLE DUST ────
    const PC = 500
    const pPos = new Float32Array(PC * 3)
    const pSz = new Float32Array(PC)
    const pRnd = new Float32Array(PC)
    for (let i = 0; i < PC; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 90
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 70
      pSz[i] = Math.random() * 1.2 + 0.3
      pRnd[i] = Math.random()
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSz, 1))
    pGeo.setAttribute('aRand', new THREE.BufferAttribute(pRnd, 1))

    const pMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x7fd959) } },
      vertexShader: `
        uniform float uTime;
        attribute float aSize;
        attribute float aRand;
        varying float vAlpha;
        void main(){
          vec3 p = position;
          p.y += sin(uTime * 0.25 + aRand * 6.28) * 1.2;
          p.x += cos(uTime * 0.15 + aRand * 6.28) * 0.8;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * (20.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = (0.06 + 0.25 * aRand) * (1.0 - smoothstep(15.0, 55.0, -mv.z));
        }`,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        void main(){
          float d = distance(gl_PointCoord, vec2(0.5));
          if(d > 0.5) discard;
          gl_FragColor = vec4(uColor, vAlpha * pow(1.0 - d * 2.0, 2.0));
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // ──── SCROLL ────
    let scrollP = 0
    ScrollTrigger.create({
      trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate: s => { scrollP = s.progress }
    })

    // ──── MOUSE ────
    const onMM = e => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.ty = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMM)

    // ──── RENDER ────
    let startTime = performance.now()
    let raf
    const animate = () => {
      const t = (performance.now() - startTime) * 0.001

      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.04
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.04

      pMat.uniforms.uTime.value = t

      // Grid
      grid.rotation.x = scrollP * 0.12
      grid.material.opacity = 0.2 + scrollP * 0.02

      // Scene rotation on scroll
      scene.rotation.y = scrollP * Math.PI * 0.25

      // Camera
      camera.position.x = mouse.current.x * 1.2
      camera.position.y = 2 + mouse.current.y * 0.8
      camera.position.z = 28 - scrollP * 3
      camera.lookAt(0, 0, -5)

      particles.rotation.y = t * 0.012 + scrollP * 0.2

      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('resize', onResize)
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
      renderer.dispose()
    }
  }, [])

  return <div className="three-bg" ref={containerRef} />
}
