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

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 22

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Lights for premium material
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)
    const mainLight = new THREE.DirectionalLight(0x7fd959, 1.5)
    mainLight.position.set(5, 5, 5)
    scene.add(mainLight)
    const blueLight = new THREE.PointLight(0x00ffff, 0.8)
    blueLight.position.set(-5, -5, 10)
    scene.add(blueLight)

    scene.fog = new THREE.FogExp2(0x030303, 0.012)

    /* ──────── GLSL PARTICLE FIELD ──────── */
    const PCOUNT = 1800
    const pp = new Float32Array(PCOUNT * 3)
    const ps = new Float32Array(PCOUNT)
    const pr = new Float32Array(PCOUNT)
    for (let i = 0; i < PCOUNT; i++) {
      pp[i * 3]     = (Math.random() - 0.5) * 80
      pp[i * 3 + 1] = (Math.random() - 0.5) * 80
      pp[i * 3 + 2] = (Math.random() - 0.5) * 80
      ps[i] = Math.random() * 2.0 + 0.5
      pr[i] = Math.random()
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(ps, 1))
    pGeo.setAttribute('aRand', new THREE.BufferAttribute(pr, 1))

    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uMouse:  { value: new THREE.Vector2() },
        uColor:  { value: new THREE.Color(0x7fd959) },
        uScroll: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute float aSize;
        attribute float aRand;
        varying float vAlpha;
        void main(){
          vec3 p = position;
          float t = uTime * 0.4;
          p.y += sin(t + aRand * 6.28) * 2.0;
          p.x += cos(t * 0.8 + aRand * 6.28) * 1.5;
          p.z += sin(t * 0.6 + aRand * 3.14) * 1.2;
          float d = distance(p.xy, uMouse * 30.0);
          if(d < 10.0){ p.xy += normalize(p.xy - uMouse * 30.0) * (10.0 - d) * 0.2; }
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * (35.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = (0.15 + 0.45 * aRand) * (1.0 - smoothstep(15.0, 50.0, -mv.z));
        }`,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        void main(){
          float d = distance(gl_PointCoord, vec2(0.5));
          if(d > 0.5) discard;
          float g = pow(1.0 - d * 2.0, 3.0);
          gl_FragColor = vec4(uColor, vAlpha * g);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    /* ──────── 8 PREMIUM LIQUID OBJECTS ──────── */
    const liquidMat = (op = 0.6) => new THREE.MeshPhysicalMaterial({
      color: 0x7fd959,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.2,
      thickness: 0.5,
      ior: 1.5,
      iridescence: 0.8,
      iridescenceIOR: 1.3,
      sheen: 0.5,
      sheenColor: 0xffffff,
      transparent: true,
      opacity: op
    })

    const objs = []
    const defs = [
      { geo: new THREE.IcosahedronGeometry(2.2, 1),        pos: [-14, 10, -5],  op: 0.6, rs: [0.003, 0.005, 0.002], fa: 0.8,  fs: 0.50 },
      { geo: new THREE.TorusGeometry(1.8, 0.6, 16, 40),    pos: [16, 4, -8],    op: 0.5, rs: [0.004, 0.002, 0.003], fa: 1.0,  fs: 0.40 },
      { geo: new THREE.OctahedronGeometry(1.8, 0),         pos: [-12, -8, -3],  op: 0.5, rs: [0.005, 0.003, 0.004], fa: 0.6,  fs: 0.60 },
      { geo: new THREE.DodecahedronGeometry(1.6, 0),       pos: [12, 12, -10],  op: 0.4, rs: [0.002, 0.004, 0.001], fa: 1.2,  fs: 0.30 },
      { geo: new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16), pos: [0, -4, -15],   op: 0.4, rs: [0.001, 0.003, 0.002], fa: 0.5,  fs: 0.35 },
      { geo: new THREE.CylinderGeometry(1.2, 1.2, 4, 12, 1, true), pos: [-18, -4, -12], op: 0.4, rs: [0.003, 0.001, 0.004], fa: 0.9, fs: 0.45 },
      { geo: new THREE.ConeGeometry(1.4, 3, 8),            pos: [18, -10, -6],  op: 0.5, rs: [0.004, 0.002, 0.003], fa: 0.7,  fs: 0.55 },
      { geo: new THREE.TorusGeometry(2.5, 0.2, 8, 48),     pos: [-8, 6, -18],   op: 0.3, rs: [0.002, 0.005, 0.001], fa: 1.1,  fs: 0.38 },
    ]

    defs.forEach((d, i) => {
      const mat = liquidMat(d.op)
      mat._baseOp = d.op
      const mesh = new THREE.Mesh(d.geo, mat)
      mesh.position.set(...d.pos)
      scene.add(mesh)
      objs.push({
        mesh, mat,
        base: new THREE.Vector3(...d.pos),
        rs: d.rs, fa: d.fa, fs: d.fs, idx: i
      })
    })

    /* ──────── SCROLL TRACKING ──────── */
    let scrollP = 0
    ScrollTrigger.create({
      trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate: s => { 
        scrollP = s.progress
        pMat.uniforms.uScroll.value = s.progress 
      }
    })

    /* ──────── MOUSE ──────── */
    const onMM = e => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.ty = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMM)

    /* ──────── RENDER LOOP ──────── */
    const clock = new THREE.Clock()
    let raf
    const animate = () => {
      const t = clock.getElapsedTime()
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05

      pMat.uniforms.uTime.value = t
      pMat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y)

      // Scene-wide revolving on scroll
      scene.rotation.y = scrollP * Math.PI * 0.5
      scene.rotation.z = Math.sin(scrollP * Math.PI) * 0.1

      objs.forEach(o => {
        const { mesh, mat, base, rs, fa, fs, idx } = o
        mesh.rotation.x += rs[0]
        mesh.rotation.y += rs[1]
        mesh.rotation.z += rs[2]

        // Floating
        mesh.position.y = base.y + Math.sin(t * fs + idx * 1.5) * fa
        mesh.position.x = base.x + Math.cos(t * fs * 0.7 + idx * 2) * fa * 0.3

        // Scroll depth shift + extra rotation
        mesh.position.z = base.z + scrollP * (idx % 2 === 0 ? 12 : -12)
        mesh.rotation.y += scrollP * 0.05

        // Mouse parallax
        const pf = 0.6 + idx * 0.15
        mesh.position.x += mouse.current.x * pf
        mesh.position.y += mouse.current.y * pf * 0.5

        // Highlight zone — object brightens as scroll passes its zone
        const zs = idx / objs.length
        const ze = (idx + 1) / objs.length
        const inZone = scrollP >= zs && scrollP < ze
        const target = inZone ? mat._baseOp * 5.0 : mat._baseOp
        mat.opacity += (target - mat.opacity) * 0.04
        
        // Color shift based on mouse
        if(inZone) {
            mat.color.setHSL(0.3 + mouse.current.x * 0.05, 0.6, 0.6)
        } else {
            mat.color.set(0x7fd959)
        }
      })

      // Dynamic camera behavior
      camera.position.x = mouse.current.x * 2.0
      camera.position.y = mouse.current.y * 1.5
      camera.position.z = 22 + Math.sin(t * 0.5) * 0.5 - scrollP * 5
      camera.lookAt(0, 0, 0)

      particles.rotation.y = t * 0.02 + scrollP * 0.5
      particles.rotation.x = t * 0.01 + Math.sin(scrollP) * 0.2

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
