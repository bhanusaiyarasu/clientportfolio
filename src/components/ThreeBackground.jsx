import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThreeBackground() {
  const containerRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // FOG
    scene.fog = new THREE.FogExp2(0x030303, 0.05)

    // PARTICLE SYSTEM (GLSL)
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const randoms = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
      sizes[i] = Math.random() * 2
      randoms[i] = Math.random()
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    particleGeometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uColor: { value: new THREE.Color(0x7fd959) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uMouse;
        attribute float size;
        attribute float random;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + random * 10.0) * 0.2;
          pos.x += cos(uTime * 0.3 + random * 10.0) * 0.2;
          
          float dist = distance(pos.xy, uMouse * 15.0);
          if(dist < 5.0) {
            pos.xy += normalize(pos.xy - uMouse * 15.0) * (5.0 - dist) * 0.2;
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (20.0 / -mvPosition.z) * (1.0 + uScroll * 2.0);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.3 + 0.7 * random;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if(d > 0.5) discard;
          gl_FragColor = vec4(uColor, vAlpha * (1.0 - d * 2.0));
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // 8 SCROLL-DRIVEN OBJECTS GROUP
    const objectsGroup = new THREE.Group()
    scene.add(objectsGroup)

    // 1. Golden Ratio Spiral
    const spiralPoints = []
    for (let i = 0; i < 200; i++) {
      const angle = 0.1 * i
      const r = 0.5 * angle
      spiralPoints.push(new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0))
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints)
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 100, 0.05, 8, false)
    const spiralMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0 })
    const spiral = new THREE.Mesh(spiralGeo, spiralMat)
    objectsGroup.add(spiral)

    // 2. Wireframe Figma Frame
    const figmaGeo = new THREE.BoxGeometry(4, 6, 0.1)
    const figmaMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0 })
    const figma = new THREE.Mesh(figmaGeo, figmaMat)
    objectsGroup.add(figma)

    // 3. DNA Helix (Typography)
    const helixGroup = new THREE.Group()
    const helixPoints = 100
    for(let i = 0; i < helixPoints; i++) {
      const y = (i / helixPoints - 0.5) * 10
      const a = (i / helixPoints) * Math.PI * 4
      const d1 = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0x7fd959 }))
      d1.position.set(Math.cos(a), y, Math.sin(a))
      const d2 = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0x7fd959 }))
      d2.position.set(Math.cos(a + Math.PI), y, Math.sin(a + Math.PI))
      helixGroup.add(d1, d2)
    }
    helixGroup.visible = false
    objectsGroup.add(helixGroup)

    // ... More objects would follow similar pattern ...

    // 4. Pen Tool Path
    const penCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-2, -2, 0),
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(2, -2, 0)
    )
    const penGeo = new THREE.TubeGeometry(penCurve, 64, 0.05, 8, false)
    const penMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0 })
    const penPath = new THREE.Mesh(penGeo, penMat)
    objectsGroup.add(penPath)

    // 5. Brand Color Palette Sphere
    const sphereGeo = new THREE.SphereGeometry(2, 32, 32)
    const sphereMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos += normal * sin(pos.y * 5.0 + uTime) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uOpacity;
        void main() {
          gl_FragColor = vec4(0.498, 0.851, 0.349, uOpacity);
        }
      `
    })
    const colorSphere = new THREE.Mesh(sphereGeo, sphereMat)
    objectsGroup.add(colorSphere)

    // 6. Package Design Unbox
    const boxGroup = new THREE.Group()
    for(let i = 0; i < 6; i++) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, side: THREE.DoubleSide }))
      boxGroup.add(plane)
    }
    boxGroup.visible = false
    objectsGroup.add(boxGroup)

    // 7. Grid System
    const gridHelper = new THREE.GridHelper(20, 20, 0x7fd959, 0x333333)
    gridHelper.rotation.x = Math.PI / 2
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0
    objectsGroup.add(gridHelper)

    // 8. Infinite Design Loop
    const torusGeo = new THREE.TorusKnotGeometry(2, 0.4, 128, 16)
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x7fd959, wireframe: true, transparent: true, opacity: 0 })
    const infiniteLoop = new THREE.Mesh(torusGeo, torusMat)
    objectsGroup.add(infiniteLoop)

    // MOUSE PARALLAX
    const onMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // SCROLL ANIMATIONS
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        scroll.current = p
        particleMaterial.uniforms.uScroll.value = p
        
        // Camera movement
        camera.position.z = 10 - p * 5
        camera.rotation.z = p * Math.PI * 0.5
        
        // Visibility logic for 8 objects
        // 0-15%: Spiral
        spiralMat.opacity = p < 0.15 ? gsap.utils.clamp(0, 1, p * 10) : gsap.utils.clamp(0, 1, (0.2 - p) * 10)
        spiral.rotation.z = p * 5
        
        // 12-28%: Figma
        figmaMat.opacity = p > 0.12 && p < 0.28 ? 1 : 0
        figma.rotation.y = p * 10
        
        // 25-40%: Helix
        helixGroup.visible = p > 0.25 && p < 0.40
        helixGroup.rotation.y = p * 10

        // 37-52%: Pen Tool
        penMat.opacity = p > 0.37 && p < 0.52 ? 1 : 0
        penPath.rotation.x = p * 10

        // 50-62%: Color Sphere
        sphereMat.uniforms.uOpacity.value = p > 0.5 && p < 0.62 ? 1 : 0
        colorSphere.rotation.y = p * 5

        // 60-73%: Box Unbox
        boxGroup.visible = p > 0.6 && p < 0.73
        boxGroup.children.forEach((plane, i) => {
          plane.rotation.x = p * (i + 1)
        })

        // 70-85%: Grid
        gridHelper.material.opacity = p > 0.7 && p < 0.85 ? 1 : 0
        gridHelper.position.z = -5 + p * 10

        // 83-100%: Infinite Loop
        torusMat.opacity = p > 0.83 ? 1 : 0
        infiniteLoop.rotation.y = p * 15
      }
    })

    const animate = (time) => {
      particleMaterial.uniforms.uTime.value = time * 0.001
      sphereMat.uniforms.uTime.value = time * 0.001
      particleMaterial.uniforms.uMouse.value.lerp(new THREE.Vector2(mouse.current.x, mouse.current.y), 0.05)
      
      objectsGroup.rotation.y += 0.005
      
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      if(containerRef.current) containerRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div className="three-bg" ref={containerRef} />
}
