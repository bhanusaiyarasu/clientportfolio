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

    // ──── IMMERSIVE DESIGNING-THEME OBJECT GROUPS ────
    const shapes = []

    const createVectorPen = () => {
      const group = new THREE.Group()
      // Bezier path tube
      const curvePoints = [
        new THREE.Vector3(-3.5, -1.8, 0),
        new THREE.Vector3(-1.8, 1.8, -1.5),
        new THREE.Vector3(1.8, -1.8, 1.5),
        new THREE.Vector3(3.5, 1.8, 0)
      ]
      const curve = new THREE.CatmullRomCurve3(curvePoints)
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.08, 8, false)
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0.12 })
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
      group.add(tubeMesh)

      // Floating vector nodes
      const nodeGeo = new THREE.SphereGeometry(0.25, 12, 12)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x7fd959, emissive: 0x7fd959, emissiveIntensity: 0.5, roughness: 0.3
      })
      curvePoints.forEach(p => {
        const node = new THREE.Mesh(nodeGeo, nodeMat)
        node.position.copy(p)
        group.add(node)
      })
      
      // Control point handle lines
      const lineMat = new THREE.LineBasicMaterial({ color: 0x7fd959, transparent: true, opacity: 0.15 })
      const lineGeo1 = new THREE.BufferGeometry().setFromPoints([curvePoints[0], new THREE.Vector3(-3.5, 0, 0)])
      const lineGeo2 = new THREE.BufferGeometry().setFromPoints([curvePoints[3], new THREE.Vector3(3.5, 0, 0)])
      group.add(new THREE.Line(lineGeo1, lineMat))
      group.add(new THREE.Line(lineGeo2, lineMat))

      return group
    }

    const createUXLayoutLayers = () => {
      const group = new THREE.Group()
      const layerGeo = new THREE.BoxGeometry(4.2, 2.8, 0.06)
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x7fd959, transparent: true, opacity: 0.1, roughness: 0.1, transmission: 0.7, ior: 1.45, depthWrite: false
      })
      const borderMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0.18 })

      for (let i = 0; i < 3; i++) {
        const layer = new THREE.Mesh(layerGeo, glassMat)
        const border = new THREE.Mesh(layerGeo, borderMat)
        layer.add(border)
        layer.position.set(0, i * 0.8 - 0.8, -i * 0.8 + 0.8)
        layer.rotation.set(-0.25, 0.35, 0.1)
        group.add(layer)
      }
      return group
    }

    const createColorPicker = () => {
      const group = new THREE.Group()
      const ringGeo1 = new THREE.TorusGeometry(2.4, 0.1, 10, 40)
      const ringGeo2 = new THREE.TorusGeometry(1.7, 0.06, 8, 30)
      const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x7fd959, emissive: 0x7fd959, emissiveIntensity: 0.15, transparent: true, opacity: 0.14, wireframe: true })
      const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 0.25, transparent: true, opacity: 0.18, wireframe: true })
      
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
      
      ring2.rotation.x = Math.PI / 3
      group.add(ring1)
      group.add(ring2)
      return group
    }

    const createFigmaCanvas = () => {
      const group = new THREE.Group()
      const frameGeo = new THREE.PlaneGeometry(5.5, 3.6, 2, 2)
      const frameMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0.1 })
      const frame = new THREE.Mesh(frameGeo, frameMat)
      group.add(frame)

      // Canvas anchor handle points
      const handleGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const handleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7fd959, emissiveIntensity: 0.6 })
      const corners = [
        [-2.75, -1.8, 0], [2.75, -1.8, 0], [-2.75, 1.8, 0], [2.75, 1.8, 0]
      ]
      corners.forEach(c => {
        const handle = new THREE.Mesh(handleGeo, handleMat)
        handle.position.set(...c)
        frame.add(handle)
      })
      return group
    }

    const createMobiuxRibbon = () => {
      const group = new THREE.Group()
      const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.32, 100, 10, 3, 4)
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0x7fd959, roughness: 0.25, metalness: 0.85, transparent: true, opacity: 0.15, wireframe: true
      })
      const knot = new THREE.Mesh(knotGeo, knotMat)
      group.add(knot)
      return group
    }

    const shapeDefs = [
      { builder: createVectorPen, pos: [-13, 6, -10], op: 0.12, rs: [0.002, 0.003, 0.001], fa: 0.8, fs: 0.4 },
      { builder: createUXLayoutLayers, pos: [11, 4, -12], op: 0.10, rs: [0.001, 0.002, 0.001], fa: 0.6, fs: 0.3 },
      { builder: createColorPicker, pos: [-9, -5, -8], op: 0.14, rs: [0.003, 0.002, 0.002], fa: 0.7, fs: 0.5 },
      { builder: createFigmaCanvas, pos: [12, -5, -10], op: 0.09, rs: [0.002, 0.001, 0.003], fa: 0.5, fs: 0.35 },
      { builder: createMobiuxRibbon, pos: [0, 8, -14], op: 0.12, rs: [0.002, 0.003, 0.001], fa: 0.9, fs: 0.38 }
    ]

    shapeDefs.forEach((d, i) => {
      const mesh = d.builder()
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
        if (shapes[i].base.distanceTo(shapes[j].base) < 32) {
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

      // Shapes Floating & Scroll Parallax
      shapes.forEach(o => {
        const { mesh, base, rs, fa, fs, idx } = o
        mesh.rotation.x += rs[0]
        mesh.rotation.y += rs[1]
        mesh.rotation.z += rs[2]
        mesh.position.y = base.y + Math.sin(t * fs + idx * 1.8) * fa
        mesh.position.x = base.x + Math.cos(t * fs * 0.6 + idx * 2.2) * fa * 0.3
        
        // Deep Scroll travel
        mesh.position.z = base.z + scrollP * (idx % 2 === 0 ? 12 : -12)

        const pf = 0.25 + idx * 0.06
        mesh.position.x += mouse.current.x * pf
        mesh.position.y += mouse.current.y * pf * 0.3

        // Adjust opacity dynamically on scroll zone
        const zs = idx / shapes.length
        const ze = (idx + 1) / shapes.length
        const inZone = scrollP >= zs && scrollP < ze
        const target = inZone ? o.op * 2.5 : o.op
        
        mesh.traverse(child => {
          if (child.material) {
            child.material.opacity += (target - child.material.opacity) * 0.03
          }
        })
      })

      // Update constellation lines
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
