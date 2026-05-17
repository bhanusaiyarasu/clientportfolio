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

    // ──── WIREFRAME SHAPES ────
    const wireMat = (op = 0.12) => new THREE.MeshBasicMaterial({
      color: 0x7fd959, wireframe: true, transparent: true, opacity: op, depthWrite: false
    })

    const shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(2.5, 1), pos: [-14, 8, -10], op: 0.12, rs: [0.002, 0.003, 0.001], fa: 1.0, fs: 0.4 },
      { geo: new THREE.TorusKnotGeometry(1.6, 0.4, 64, 8), pos: [13, 5, -14], op: 0.08, rs: [0.001, 0.002, 0.001], fa: 0.8, fs: 0.35 },
      { geo: new THREE.OctahedronGeometry(2.0, 0), pos: [-10, -6, -6], op: 0.10, rs: [0.003, 0.002, 0.002], fa: 0.7, fs: 0.5 },
      { geo: new THREE.DodecahedronGeometry(1.8, 0), pos: [15, -4, -16], op: 0.07, rs: [0.002, 0.001, 0.003], fa: 1.2, fs: 0.3 },
      { geo: new THREE.TorusGeometry(2.0, 0.12, 8, 48), pos: [-7, 11, -18], op: 0.06, rs: [0.001, 0.004, 0.001], fa: 0.9, fs: 0.38 },
      { geo: new THREE.IcosahedronGeometry(3.0, 0), pos: [0, -9, -22], op: 0.05, rs: [0.001, 0.001, 0.002], fa: 0.5, fs: 0.25 },
      { geo: new THREE.TetrahedronGeometry(1.5, 0), pos: [18, 9, -20], op: 0.06, rs: [0.003, 0.002, 0.001], fa: 1.1, fs: 0.42 },
      { geo: new THREE.ConeGeometry(1.2, 3, 6), pos: [-16, -3, -12], op: 0.08, rs: [0.002, 0.003, 0.001], fa: 0.6, fs: 0.45 },
    ]

    const shapes = []
    shapeDefs.forEach((d, i) => {
      const mesh = new THREE.Mesh(d.geo, wireMat(d.op))
      mesh.position.set(...d.pos)
      scene.add(mesh)
      shapes.push({ mesh, base: new THREE.Vector3(...d.pos), ...d, idx: i })
    })

    // ──── GRID PLANE ────
    const grid = new THREE.GridHelper(100, 50, 0x7fd959, 0x7fd959)
    grid.position.y = -12
    grid.material.transparent = true
    grid.material.opacity = 0.035
    grid.material.depthWrite = false
    scene.add(grid)

    // ──── CONSTELLATION LINES ────
    const linePairs = []
    const lineVerts = []
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        if (shapes[i].base.distanceTo(shapes[j].base) < 28) {
          linePairs.push([i, j])
          lineVerts.push(shapes[i].base.x, shapes[i].base.y, shapes[i].base.z)
          lineVerts.push(shapes[j].base.x, shapes[j].base.y, shapes[j].base.z)
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3))
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7fd959, transparent: true, opacity: 0.035, depthWrite: false })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

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

      // Shapes
      shapes.forEach(o => {
        const { mesh, base, rs, fa, fs, idx } = o
        mesh.rotation.x += rs[0]
        mesh.rotation.y += rs[1]
        mesh.rotation.z += rs[2]
        mesh.position.y = base.y + Math.sin(t * fs + idx * 1.8) * fa
        mesh.position.x = base.x + Math.cos(t * fs * 0.6 + idx * 2.2) * fa * 0.3
        mesh.position.z = base.z + scrollP * (idx % 2 === 0 ? 6 : -6)

        const pf = 0.25 + idx * 0.06
        mesh.position.x += mouse.current.x * pf
        mesh.position.y += mouse.current.y * pf * 0.3

        // Glow on scroll zone
        const zs = idx / shapes.length
        const ze = (idx + 1) / shapes.length
        const inZone = scrollP >= zs && scrollP < ze
        const target = inZone ? o.op * 3.5 : o.op
        mesh.material.opacity += (target - mesh.material.opacity) * 0.03
      })

      // Update constellation
      const posArr = lines.geometry.attributes.position.array
      let li = 0
      linePairs.forEach(([a, b]) => {
        posArr[li++] = shapes[a].mesh.position.x; posArr[li++] = shapes[a].mesh.position.y; posArr[li++] = shapes[a].mesh.position.z
        posArr[li++] = shapes[b].mesh.position.x; posArr[li++] = shapes[b].mesh.position.y; posArr[li++] = shapes[b].mesh.position.z
      })
      lines.geometry.attributes.position.needsUpdate = true
      lineMat.opacity = 0.03 + Math.sin(t * 0.4) * 0.01

      // Grid
      grid.rotation.x = scrollP * 0.12
      grid.material.opacity = 0.035 + scrollP * 0.02

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
