import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import {
  ACESFilmicToneMapping,
  Color,
  DoubleSide,
  MathUtils,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three'
import gsap from 'gsap'
import '../styles/book-intro-3d.css'

const PAGE_WIDTH = 1.72
const PAGE_HEIGHT = 2.38
const PAGE_SEGMENTS_X = 48
const PAGE_SEGMENTS_Y = 28

function createCoverGeometry() {
  const geometry = new PlaneGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_SEGMENTS_X,
    PAGE_SEGMENTS_Y,
  )
  geometry.translate(PAGE_WIDTH / 2, 0, 0)
  geometry.userData.originalPositions = new Float32Array(
    geometry.attributes.position.array,
  )
  return geometry
}

function deformCover(geometry, progress) {
  const position = geometry.attributes.position
  const original = geometry.userData.originalPositions
  const bend = Math.sin(progress * Math.PI) * 0.13
  const curl = Math.sin(progress * Math.PI) * 0.025

  for (let index = 0; index < position.count; index += 1) {
    const offset = index * 3
    const x = original[offset]
    const y = original[offset + 1]
    const u = MathUtils.clamp(x / PAGE_WIDTH, 0, 1)
    const edge = Math.sin(u * Math.PI)
    position.setXYZ(
      index,
      x + curl * edge * (u - 0.5),
      y + 0.008 * edge * Math.cos(progress * Math.PI),
      bend * edge * (0.75 + 0.25 * Math.abs(y / PAGE_HEIGHT)),
    )
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()
}

function PageTypography({ side }) {
  const left = side === 'left'
  return (
    <Html
      transform
      distanceFactor={4.4}
      position={[left ? -0.88 : 0.88, 0.42, 0.055]}
      style={{
        width: '220px',
        pointerEvents: 'none',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="book-page-copy">
        <span className="book-page-kicker">
          {left ? 'THE MAKER / 001' : 'FIELD NOTES / 001'}
        </span>
        <strong>
          {left ? <>KIRTAN<br /><em>SWAMY.</em></> : <>MAKE IT<br /><em>MATTER.</em></>}
        </strong>
        <p>
          {left
            ? 'Engineering, curiosity and a habit of making things.'
            : 'Ideas take shape when questions meet thoughtful execution.'}
        </p>
        <small>{left ? 'ENGINEERING / DESIGN / INDIA' : 'OBSERVE / BUILD / REFINE'}</small>
      </div>
    </Html>
  )
}

function SpiralBinding() {
  const loops = useMemo(
    () => Array.from({ length: 10 }, (_, index) => -1.02 + index * 0.226),
    [],
  )
  return (
    <group>
      {loops.map((y, index) => (
        <mesh
          key={index}
          position={[0, y, 0.105]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <torusGeometry args={[0.052, 0.012, 8, 24]} />
          <meshStandardMaterial
            color="#c8c5b9"
            metalness={0.86}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  )
}

function BookScene({ progressRef, onReady, onOpened }) {
  const bookRef = useRef(null)
  const coverPivotRef = useRef(null)
  const coverArtRef = useRef(null)
  const insidePagesRef = useRef(null)
  const coverGeometry = useMemo(createCoverGeometry, [])
  const tiltTarget = useRef({ x: 0, y: 0 })
  const { camera, size, invalidate } = useThree()

  const coverMaterial = useMemo(
    () => new MeshPhysicalMaterial({
      color: new Color('#172b43'),
      roughness: 0.48,
      metalness: 0.16,
      clearcoat: 0.34,
      clearcoatRoughness: 0.42,
      side: DoubleSide,
    }),
    [],
  )

  const paperMaterial = useMemo(
    () => new MeshPhysicalMaterial({
      color: new Color('#eee5d5'),
      roughness: 0.94,
      metalness: 0,
      side: DoubleSide,
    }),
    [],
  )

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    camera.position.set(0, 0, aspect < 0.78 ? 7.5 : 7.0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, invalidate])

  useEffect(() => {
    onReady({ camera, invalidate })
  }, [camera, invalidate, onReady])

  useFrame((_, delta) => {
    const progress = progressRef.current.value

    if (coverPivotRef.current) {
      // GSAP owns the easing. Do not damp this value a second time.
      coverPivotRef.current.rotation.y = -Math.PI * progress
    }

    if (coverGeometry) deformCover(coverGeometry, progress)

    if (coverArtRef.current) {
      coverArtRef.current.visible = progress <= 0.45
    }

    if (insidePagesRef.current) {
      insidePagesRef.current.visible = progress > 0.43
    }

    if (bookRef.current) {
      const current = bookRef.current.rotation
      const dx = tiltTarget.current.x - current.x
      const dy = tiltTarget.current.y - current.y

      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        current.x = MathUtils.damp(current.x, tiltTarget.current.x, 7, delta)
        current.y = MathUtils.damp(current.y, tiltTarget.current.y, 7, delta)
        // Demand rendering continues only while the pointer tilt is settling.
        invalidate()
      } else {
        current.x = tiltTarget.current.x
        current.y = tiltTarget.current.y
      }
    }
  })

  useEffect(() => {
    return () => {
      coverGeometry.dispose()
      coverMaterial.dispose()
      paperMaterial.dispose()
    }
  }, [coverGeometry, coverMaterial, paperMaterial])

  const handlePointerMove = useCallback((event) => {
    tiltTarget.current.x = -event.pointer.y * 0.035
    tiltTarget.current.y = event.pointer.x * 0.045
    invalidate()
  }, [invalidate])

  const handlePointerLeave = useCallback(() => {
    tiltTarget.current.x = 0
    tiltTarget.current.y = 0
    invalidate()
  }, [invalidate])

  return (
    <group
      ref={bookRef}
      rotation={[-0.055, 0, -0.018]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Closed volume: a single block under the front cover. */}
      <mesh position={[PAGE_WIDTH / 2, 0, -0.075]} receiveShadow>
        <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 0.15]} />
        <meshStandardMaterial color="#d7cbb5" roughness={0.92} />
      </mesh>

      {/* The opened two-page spread is revealed after the cover turns. */}
      <group ref={insidePagesRef} visible={false}>
        <mesh position={[-PAGE_WIDTH / 2, 0, 0.018]} material={paperMaterial}>
          <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 1, 1]} />
        </mesh>
        <mesh position={[PAGE_WIDTH / 2, 0, 0.018]} material={paperMaterial}>
          <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 1, 1]} />
        </mesh>

        <mesh position={[0, 0, -0.035]}>
          <boxGeometry args={[PAGE_WIDTH * 2 + 0.025, PAGE_HEIGHT + 0.035, 0.11]} />
          <meshStandardMaterial color="#c8b99f" roughness={0.95} />
        </mesh>

        <PageTypography side="left" />
        <PageTypography side="right" />
      </group>

      {/* Spine and metallic binding stay fixed while the cover swings. */}
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[0.105, PAGE_HEIGHT + 0.08, 0.19]} />
        <meshPhysicalMaterial color="#172b43" roughness={0.48} metalness={0.2} />
      </mesh>
      <SpiralBinding />

      <group ref={coverPivotRef} position={[0, 0, 0.095]}>
        <mesh geometry={coverGeometry} material={coverMaterial} castShadow />

        <group ref={coverArtRef}>
          <Html
            transform
            distanceFactor={4.4}
            position={[PAGE_WIDTH / 2, 0.04, 0.045]}
            style={{
              width: '260px',
              pointerEvents: 'none',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div className="book-cover-art">
              <span>THE MAKER'S</span>
              <strong>NOTEBOOK<span>.</span></strong>
              <i>VOL. 01 / FIELD EDITION</i>
              <b>KS</b>
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}

export default function BookIntro3D({ onComplete, onSkip }) {
  const hostRef = useRef(null)
  const titleRef = useRef(null)
  const timelineRef = useRef(null)
  const progressRef = useRef({ value: 0 })
  const invalidateRef = useRef(null)
  const cameraRef = useRef(null)
  const startedRef = useRef(false)

  const [inView, setInView] = useState(true)
  const [opened, setOpened] = useState(false)
  const [dpr, setDpr] = useState(() => {
    if (typeof window === 'undefined') return 1
    const cap = window.matchMedia('(max-width: 700px)').matches ? 1.5 : 2
    return Math.min(window.devicePixelRatio || 1, cap)
  })

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 },
    )
    observer.observe(host)

    const updateDpr = () => {
      const cap = window.matchMedia('(max-width: 700px)').matches ? 1.5 : 2
      setDpr(Math.min(window.devicePixelRatio || 1, cap))
    }

    const pauseWhenHidden = () => {
      if (document.hidden) timelineRef.current?.pause()
      else timelineRef.current?.resume()
    }

    window.addEventListener('resize', updateDpr)
    document.addEventListener('visibilitychange', pauseWhenHidden)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDpr)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      timelineRef.current?.kill()
    }
  }, [])

  const beginOpening = useCallback(({ camera, invalidate }) => {
    if (startedRef.current) return
    startedRef.current = true

    cameraRef.current = camera
    invalidateRef.current = invalidate

    if (reducedMotion) {
      camera.position.z = 6.35
      progressRef.current.value = 1
      invalidate()
      setOpened(true)
      return
    }

    const timeline = gsap.timeline({
      onUpdate: () => invalidateRef.current?.(),
      onComplete: () => {
        invalidateRef.current?.()
        setOpened(true)
      },
    })

    timeline.to(camera.position, {
      z: 6.35,
      duration: 1.15,
      ease: 'power2.inOut',
    }, 0)

    timeline.to(progressRef.current, {
      value: 1,
      duration: 2.15,
      ease: 'power3.inOut',
    }, 0.78)

    timeline.to(titleRef.current, {
      autoAlpha: 0,
      x: -28,
      duration: 0.62,
      ease: 'power2.in',
    }, 1.72)

    timelineRef.current = timeline
  }, [reducedMotion])

  const handleSceneReady = useCallback((sceneApi) => {
    beginOpening(sceneApi)
  }, [beginOpening])

  const skip = useCallback(() => {
    timelineRef.current?.kill()
    timelineRef.current = null
    progressRef.current.value = 1
    if (cameraRef.current) cameraRef.current.position.z = 6.35
    invalidateRef.current?.()
    setOpened(true)
    onSkip?.()
  }, [onSkip])

  const enter = useCallback(() => {
    timelineRef.current?.kill()
    onComplete?.()
  }, [onComplete])

  return (
    <div
      ref={hostRef}
      className="book-intro-3d"
      role="dialog"
      aria-modal="true"
      aria-label="The Maker's Notebook opening"
    >
      <div className="book-intro-desk" aria-hidden="true" />

      {inView && (
        <Canvas
          className="book-intro-canvas"
          frameloop="demand"
          dpr={dpr}
          shadows={false}
          fallback={<div className="book-intro-fallback">THE MAKER'S NOTEBOOK</div>}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 7], fov: 37, near: 0.1, far: 40 }}
          onCreated={({ gl, invalidate }) => {
            gl.outputColorSpace = SRGBColorSpace
            gl.toneMapping = ACESFilmicToneMapping
            invalidateRef.current = invalidate
          }}
        >
          <color attach="background" args={['#171d28']} />
          <ambientLight intensity={1.15} />
          <directionalLight position={[-3, 5, 6]} intensity={2.5} />
          <directionalLight position={[4, 1, -3]} intensity={0.75} color="#d6dfef" />

          <mesh position={[0, 0, -0.55]}>
            <planeGeometry args={[30, 20]} />
            <meshStandardMaterial color="#202a38" roughness={1} />
          </mesh>

          <Suspense fallback={null}>
            <BookScene
              progressRef={progressRef}
              onReady={handleSceneReady}
            />
          </Suspense>
        </Canvas>
      )}

      {!inView && (
        <div className="book-intro-fallback" aria-hidden="true">
          THE MAKER'S NOTEBOOK
        </div>
      )}

      <div className="book-intro-ui">
        <div className="book-intro-topline">
          <span>THE MAKER'S NOTEBOOK</span>
          <span>FIELD EDITION / 001</span>
        </div>

        <div ref={titleRef} className="book-intro-title">
          <span>A PERSONAL EDITION</span>
          <h1>Ideas in <em>motion.</em></h1>
          <p>
            A record of questions, experiments and things
            made a little more useful.
          </p>
        </div>

        <div className="book-intro-bottomline">
          <span>ENGINEERING / DESIGN / IDEAS</span>
          <div className="book-intro-actions">
            <button type="button" onClick={skip}>SKIP INTRO ↗</button>
            <button
              type="button"
              className="book-intro-enter"
              onClick={enter}
              disabled={!opened}
            >
              {opened ? 'ENTER THE NOTEBOOK' : 'OPENING…'}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <span className="book-intro-status" aria-live="polite">
          {opened ? 'THE NOTEBOOK IS OPEN' : 'OPENING THE FIELD EDITION'}
        </span>
      </div>
    </div>
  )
}
