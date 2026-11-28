import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  BackSide,
  CanvasTexture,
  Color,
  FrontSide,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three'
import gsap from 'gsap'
import '../styles/book-intro-3d.css'

const PAGE_WIDTH = 1.72
const PAGE_HEIGHT = 2.38
const SPREAD_WIDTH = PAGE_WIDTH * 2
const PAGE_SEGMENTS_X = 48
const PAGE_SEGMENTS_Y = 28
const TEXTURE_SCALE = 2
const TEXTURE_WIDTH = 800
const TEXTURE_HEIGHT = 1100
const CAMERA_FOV = 37
const INITIAL_DOLLY_OFFSET = 1.35

function getFontFamilies() {
  const styles = getComputedStyle(document.documentElement)
  const read = (name, fallback) => styles.getPropertyValue(name).trim() || fallback
  return {
    display: read('--display', 'Arial, sans-serif'),
    serif: read('--serif', 'Georgia, serif'),
    mono: read('--mono', 'monospace'),
  }
}

function addPaperGrain(ctx, width, height, tint = '#756b59') {
  ctx.save()
  for (let index = 0; index < 1900; index += 1) {
    const x = (index * 73 + 19) % width
    const y = (index * 193 + 47) % height
    const alpha = 0.018 + ((index * 17) % 9) * 0.003
    ctx.fillStyle = tint
    ctx.globalAlpha = alpha
    ctx.fillRect(x, y, index % 5 === 0 ? 2 : 1, 1)
  }
  ctx.restore()
}

function drawCoverTexture(ctx, fonts) {
  const gradient = ctx.createLinearGradient(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  gradient.addColorStop(0, '#263c56')
  gradient.addColorStop(0.52, '#172b43')
  gradient.addColorStop(1, '#101e32')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)

  // Fine woven linen grain.
  ctx.save()
  ctx.globalAlpha = 0.12
  for (let x = 0; x < TEXTURE_WIDTH; x += 5) {
    ctx.fillStyle = x % 2 ? '#d7c8a8' : '#071426'
    ctx.fillRect(x, 0, 1, TEXTURE_HEIGHT)
  }
  for (let y = 0; y < TEXTURE_HEIGHT; y += 5) {
    ctx.fillStyle = y % 2 ? '#d7c8a8' : '#071426'
    ctx.fillRect(0, y, TEXTURE_WIDTH, 1)
  }
  ctx.restore()

  addPaperGrain(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, '#e9dcc0')

  ctx.strokeStyle = '#d7c6a2'
  ctx.lineWidth = 2
  ctx.strokeRect(31, 31, TEXTURE_WIDTH - 62, TEXTURE_HEIGHT - 62)
  ctx.strokeStyle = '#d7c6a270'
  ctx.lineWidth = 1
  ctx.strokeRect(47, 47, TEXTURE_WIDTH - 94, TEXTURE_HEIGHT - 94)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#e8dcc4'
  ctx.font = '600 34px ' + fonts.mono
  ctx.fillText("THE MAKER'S", TEXTURE_WIDTH / 2, 350)

  ctx.fillStyle = '#f1e7d4'
  ctx.font = '600 100px ' + fonts.display
  ctx.fillText('NOTEBOOK.', TEXTURE_WIDTH / 2, 475)

  ctx.fillStyle = '#d6c49e'
  ctx.font = '22px ' + fonts.mono
  ctx.fillText('VOL. 01 / FIELD EDITION', TEXTURE_WIDTH / 2, 590)

  // A wax seal rendered into the texture, not a DOM overlay.
  const sealX = TEXTURE_WIDTH / 2
  const sealY = 875
  const wax = ctx.createRadialGradient(sealX - 20, sealY - 24, 4, sealX, sealY, 76)
  wax.addColorStop(0, '#ef9a7c')
  wax.addColorStop(0.48, '#c94e42')
  wax.addColorStop(1, '#7c292b')
  ctx.save()
  ctx.shadowColor = '#050a12aa'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 9
  ctx.beginPath()
  ctx.arc(sealX, sealY, 72, 0, Math.PI * 2)
  ctx.fillStyle = wax
  ctx.fill()
  ctx.restore()
  ctx.strokeStyle = '#e5b18e'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(sealX, sealY, 64, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#f0c7a0aa'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(sealX, sealY, 55, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#fff0dd'
  ctx.font = '600 42px ' + fonts.serif
  ctx.fillText('KS', sealX, sealY + 2)
}

function drawInnerCoverTexture(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  gradient.addColorStop(0, '#f4eddf')
  gradient.addColorStop(0.55, '#eee5d5')
  gradient.addColorStop(1, '#e6dbc8')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  addPaperGrain(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, '#8b7b60')

  ctx.strokeStyle = '#bdab89'
  ctx.lineWidth = 2
  ctx.strokeRect(34, 34, TEXTURE_WIDTH - 68, TEXTURE_HEIGHT - 68)
  ctx.strokeStyle = '#bdab8950'
  ctx.lineWidth = 1
  ctx.strokeRect(50, 50, TEXTURE_WIDTH - 100, TEXTURE_HEIGHT - 100)

  ctx.fillStyle = '#a58d68'
  ctx.font = '18px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('FIELD EDITION  /  001', TEXTURE_WIDTH / 2, 1000)
}

function drawPageBase(ctx, side) {
  const gradient = ctx.createLinearGradient(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  gradient.addColorStop(0, '#f6efe2')
  gradient.addColorStop(0.55, '#f1e8d8')
  gradient.addColorStop(1, '#e9dfcd')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
  addPaperGrain(ctx, TEXTURE_WIDTH, TEXTURE_HEIGHT, '#746850')

  // Quiet ruled lines, kept light enough for the typography to lead.
  ctx.strokeStyle = '#8c9a9d24'
  ctx.lineWidth = 1
  for (let y = 190; y < 1010; y += 43) {
    ctx.beginPath()
    ctx.moveTo(60, y)
    ctx.lineTo(740, y)
    ctx.stroke()
  }

  // A soft gutter shadow makes the two leaves feel like one bound spread.
  const gutter = side === 'left'
    ? ctx.createLinearGradient(630, 0, 800, 0)
    : ctx.createLinearGradient(0, 0, 170, 0)
  if (side === 'left') {
    gutter.addColorStop(0, '#30271a00')
    gutter.addColorStop(1, '#30271a20')
    ctx.fillStyle = gutter
    ctx.fillRect(630, 0, 170, TEXTURE_HEIGHT)
  } else {
    gutter.addColorStop(0, '#30271a20')
    gutter.addColorStop(1, '#30271a00')
    ctx.fillStyle = gutter
    ctx.fillRect(0, 0, 170, TEXTURE_HEIGHT)
  }

  ctx.fillStyle = '#c7b99e'
  ctx.fillRect(side === 'left' ? 742 : 54, 68, 2, 34)
}

function drawLeftPageOverlay(ctx, fonts) {
  // Transparent ink layer. The cream endpaper remains the base surface,
  // while the typography is mapped onto that same hinged 3D leaf.
  const leftGutterShade = ctx.createLinearGradient(630, 0, 800, 0)
  leftGutterShade.addColorStop(0, 'rgba(48, 39, 26, 0)')
  leftGutterShade.addColorStop(1, 'rgba(48, 39, 26, 0.14)')
  ctx.fillStyle = leftGutterShade
  ctx.fillRect(630, 0, 170, TEXTURE_HEIGHT)

  ctx.strokeStyle = '#8c9a9d24'
  ctx.lineWidth = 1
  for (let y = 190; y < 1010; y += 43) {
    ctx.beginPath()
    ctx.moveTo(60, y)
    ctx.lineTo(740, y)
    ctx.stroke()
  }

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#9c6148'
  ctx.font = '22px ' + fonts.mono
  ctx.fillText('THE MAKER / 001', 72, 142)

  ctx.strokeStyle = '#a58e6c80'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(72, 174)
  ctx.lineTo(690, 174)
  ctx.stroke()

  ctx.fillStyle = '#252a2d'
  ctx.font = '600 116px ' + fonts.display
  ctx.fillText('KIRTAN', 70, 365)
  ctx.fillText('SWAMY.', 70, 490)

  ctx.fillStyle = '#625a4e'
  ctx.font = '28px ' + fonts.serif
  ctx.fillText('Engineering, curiosity and a habit', 74, 590)
  ctx.fillText('of making things with purpose.', 74, 634)

  ctx.fillStyle = '#8b795d'
  ctx.font = '17px ' + fonts.mono
  ctx.fillText('ENGINEERING  /  DESIGN  /  INDIA', 74, 930)
}

function drawRightPageTexture(ctx, fonts) {
  drawPageBase(ctx, 'right')
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#9c6148'
  ctx.font = '22px ' + fonts.mono
  ctx.fillText('FIELD NOTES / 001', 72, 142)

  ctx.strokeStyle = '#a58e6c80'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(72, 174)
  ctx.lineTo(690, 174)
  ctx.stroke()

  ctx.fillStyle = '#252a2d'
  ctx.font = '600 116px ' + fonts.display
  ctx.fillText('MAKE IT', 70, 365)
  ctx.fillStyle = '#3158b8'
  ctx.font = 'italic 118px ' + fonts.serif
  ctx.fillText('MATTER.', 70, 495)

  ctx.fillStyle = '#625a4e'
  ctx.font = '28px ' + fonts.serif
  ctx.fillText('Questions become systems when', 74, 590)
  ctx.fillText('curiosity meets thoughtful craft.', 74, 634)

  ctx.fillStyle = '#8b795d'
  ctx.font = '17px ' + fonts.mono
  ctx.fillText('OBSERVE  /  BUILD  /  REFINE', 74, 930)
}

function createTexture(gl, draw, width = TEXTURE_WIDTH, height = TEXTURE_HEIGHT) {
  const canvas = document.createElement('canvas')
  canvas.width = width * TEXTURE_SCALE
  canvas.height = height * TEXTURE_SCALE
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) throw new Error('Canvas 2D context is unavailable')

  context.scale(TEXTURE_SCALE, TEXTURE_SCALE)
  draw(context)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  texture.minFilter = LinearMipmapLinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}

function createShadowTexture(gl) {
  return createTexture(gl, (ctx) => {
    const gradient = ctx.createRadialGradient(400, 550, 20, 400, 550, 390)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)')
    gradient.addColorStop(0.48, 'rgba(0, 0, 0, 0.25)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 1100)
  }, 800, 1100)
}

function disposeTextures(textures) {
  if (!textures) return
  Object.values(textures).forEach((texture) => {
    if (!texture) return
    const image = texture.image
    texture.dispose()
    if (image instanceof HTMLCanvasElement) {
      image.width = 0
      image.height = 0
    }
  })
}

function useNotebookTextures(gl) {
  const [textures, setTextures] = useState(null)

  useEffect(() => {
    let active = true
    let ownedTextures = null

    const prepare = async () => {
      const generated = {}
      try {
        await (document.fonts?.ready || Promise.resolve())
        if (!active) return

        const fonts = getFontFamilies()
        generated.cover = createTexture(gl, (ctx) => drawCoverTexture(ctx, fonts))
        generated.innerCover = createTexture(gl, drawInnerCoverTexture)
        generated.leftOverlay = createTexture(gl, (ctx) => drawLeftPageOverlay(ctx, fonts))
        generated.rightPage = createTexture(gl, (ctx) => drawRightPageTexture(ctx, fonts))
        generated.shadow = createShadowTexture(gl)
        ownedTextures = generated

        if (!active) {
          disposeTextures(generated)
          return
        }
        setTextures(generated)
      } catch (error) {
        disposeTextures(generated)
        console.error('Unable to prepare notebook canvas textures:', error)
      }
    }

    prepare()
    return () => {
      active = false
      disposeTextures(ownedTextures)
    }
  }, [gl])

  return textures
}

function createCoverGeometry() {
  const geometry = new PlaneGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_SEGMENTS_X,
    PAGE_SEGMENTS_Y,
  )
  // The cover's local x=0 edge is the physical hinge.
  geometry.translate(PAGE_WIDTH / 2, 0, 0)
  geometry.userData.originalPositions = new Float32Array(
    geometry.attributes.position.array,
  )
  return geometry
}

function deformCover(geometry, progress) {
  const position = geometry.attributes.position
  const original = geometry.userData.originalPositions
  const bend = Math.sin(progress * Math.PI) * 0.12
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

function SpiralBinding() {
  return (
    <group>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh
          key={index}
          position={[0, -1.06 + index * 0.212, 0.145]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.052, 0.012, 10, 28]} />
          <meshPhysicalMaterial
            color="#c8c5b9"
            metalness={0.9}
            roughness={0.22}
            clearcoat={0.45}
          />
        </mesh>
      ))}
    </group>
  )
}

function BookScene({ progressRef, cameraDollyRef, onReady, onTexturesReady }) {
  const bookRef = useRef(null)
  const coverPivotRef = useRef(null)
  const insidePagesRef = useRef(null)
  const coverGeometry = useMemo(createCoverGeometry, [])
  const insideCoverGeometry = useMemo(() => {
    const geometry = coverGeometry.clone()
    const uv = geometry.attributes.uv
    for (let index = 0; index < uv.count; index += 1) {
      uv.setX(index, 1 - uv.getX(index))
    }
    uv.needsUpdate = true
    return geometry
  }, [coverGeometry])
  const tiltTarget = useRef({ x: 0, y: 0 })
  const { camera, size, invalidate, gl } = useThree()
  const textures = useNotebookTextures(gl)

  const coverMaterial = useState(() => new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    roughness: 0.52,
    metalness: 0.14,
    clearcoat: 0.4,
    clearcoatRoughness: 0.42,
    map: null,
    side: FrontSide,
  }))[0]
  const insideCoverMaterial = useState(() => new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    roughness: 0.94,
    metalness: 0,
    map: null,
    side: BackSide,
  }))[0]
  const leftOverlayMaterial = useState(() => new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    roughness: 0.96,
    metalness: 0,
    map: null,
    side: BackSide,
    transparent: true,
    alphaTest: 0.035,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  }))[0]
  const rightPageMaterial = useState(() => new MeshPhysicalMaterial({
    color: new Color('#ffffff'),
    roughness: 0.94,
    metalness: 0,
    map: null,
    side: FrontSide,
  }))[0]
  const shadowMaterial = useState(() => new MeshBasicMaterial({
    color: '#17120e',
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    map: null,
  }))[0]

  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    const fovRadians = MathUtils.degToRad(CAMERA_FOV)
    const fitDistance = (SPREAD_WIDTH * 0.5) /
      (Math.tan(fovRadians * 0.5) * Math.max(0.1, aspect) * 0.9)
    const targetDistance = Math.max(4.6, fitDistance)

    camera.fov = CAMERA_FOV
    const dollyProgress = MathUtils.clamp(cameraDollyRef.current.value, 0, 1)
    camera.position.set(0, 0, targetDistance + INITIAL_DOLLY_OFFSET * (1 - dollyProgress))
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    onReady({ camera, invalidate, targetCameraZ: targetDistance })
    invalidate()
  }, [camera, cameraDollyRef, size.width, size.height, invalidate, onReady])

  useEffect(() => {
    if (!textures) return
    coverMaterial.map = textures.cover
    insideCoverMaterial.map = textures.innerCover
    leftOverlayMaterial.map = textures.leftOverlay
    rightPageMaterial.map = textures.rightPage
    shadowMaterial.map = textures.shadow
    coverMaterial.needsUpdate = true
    insideCoverMaterial.needsUpdate = true
    leftOverlayMaterial.needsUpdate = true
    rightPageMaterial.needsUpdate = true
    shadowMaterial.needsUpdate = true
    onTexturesReady()
    invalidate()
  }, [
    textures,
    coverMaterial,
    insideCoverMaterial,
    leftOverlayMaterial,
    rightPageMaterial,
    shadowMaterial,
    onTexturesReady,
    invalidate,
  ])

  useFrame((_, delta) => {
    const progress = progressRef.current.value

    if (coverPivotRef.current) {
      // GSAP owns cover easing; apply its progress directly to the hinge.
      coverPivotRef.current.rotation.y = -Math.PI * progress
    }

    deformCover(coverGeometry, progress)
    deformCover(insideCoverGeometry, progress)

    if (insidePagesRef.current) {
      insidePagesRef.current.visible = progress > 0.38
    }

    if (bookRef.current) {
      const current = bookRef.current.rotation
      const targetX = tiltTarget.current.x
      const targetY = tiltTarget.current.y
      const unsettled = Math.abs(targetX - current.x) > 0.001 ||
        Math.abs(targetY - current.y) > 0.001

      if (unsettled) {
        current.x = MathUtils.damp(current.x, targetX, 7, delta)
        current.y = MathUtils.damp(current.y, targetY, 7, delta)
        if (
          Math.abs(targetX - current.x) > 0.001 ||
          Math.abs(targetY - current.y) > 0.001
        ) invalidate()
      } else {
        current.x = targetX
        current.y = targetY
      }
    }
  })

  useEffect(() => {
    return () => {
      coverGeometry.dispose()
      insideCoverGeometry.dispose()
      coverMaterial.dispose()
      insideCoverMaterial.dispose()
      leftOverlayMaterial.dispose()
      rightPageMaterial.dispose()
      shadowMaterial.dispose()
    }
  }, [
    coverGeometry,
    insideCoverGeometry,
    coverMaterial,
    insideCoverMaterial,
    leftOverlayMaterial,
    rightPageMaterial,
    shadowMaterial,
  ])

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
      position={[0, 0.12, 0]}
      rotation={[-0.035, 0, -0.01]}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* A soft, texture-based contact shadow on the maker's desk. */}
      <mesh position={[0, -0.04, -0.34]}>
        <planeGeometry args={[4.2, 2.8]} />
        <primitive object={shadowMaterial} attach="material" />
      </mesh>

      {/* Closed page block and front cover. */}
      <mesh position={[PAGE_WIDTH / 2, 0, -0.075]}>
        <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 0.15]} />
        <meshPhysicalMaterial color="#d9cfbc" roughness={0.94} />
      </mesh>

      {/* The open left/right spread sits above the back of the hinged cover. */}
      <group ref={insidePagesRef} visible={false}>
        <mesh position={[PAGE_WIDTH / 2, 0, 0.055]} material={rightPageMaterial}>
          <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, 1, 1]} />
        </mesh>
        <mesh position={[0, 0, -0.035]}>
          <boxGeometry args={[SPREAD_WIDTH + 0.025, PAGE_HEIGHT + 0.035, 0.11]} />
          <meshPhysicalMaterial color="#d8cbb5" roughness={0.96} />
        </mesh>
      </group>

      {/* The binding is fixed to the spine; its loops sit just proud of the paper. */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[0.105, PAGE_HEIGHT + 0.08, 0.17]} />
        <meshPhysicalMaterial color="#172b43" roughness={0.48} metalness={0.22} />
      </mesh>
      <SpiralBinding />

      <group ref={coverPivotRef} position={[0, 0, 0.105]}>
        <mesh geometry={coverGeometry} material={coverMaterial} castShadow />
        {/* A separate back-face material prevents the navy front from appearing mirrored. */}
        <mesh
          geometry={insideCoverGeometry}
          material={insideCoverMaterial}
          position={[0, 0, -0.003]}
        />
        <mesh
          geometry={insideCoverGeometry}
          material={leftOverlayMaterial}
          position={[0, 0, -0.008]}
        />
      </group>
    </group>
  )
}

export default function BookIntro3D({ onComplete, onSkip }) {
  const hostRef = useRef(null)
  const titleRef = useRef(null)
  const timelineRef = useRef(null)
  const progressRef = useRef({ value: 0 })
  const cameraDollyRef = useRef({ value: 0 })
  const invalidateRef = useRef(null)
  const cameraRef = useRef(null)
  const sceneApiRef = useRef(null)
  const cameraTargetRef = useRef(5.15)
  const startedRef = useRef(false)
  const exitingRef = useRef(false)

  const [inView, setInView] = useState(true)
  const [opened, setOpened] = useState(false)
  const [texturesReady, setTexturesReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const [dpr, setDpr] = useState(() => {
    if (typeof window === 'undefined') return 1
    const cap = window.matchMedia('(max-width: 700px)').matches ? 1.5 : 2
    return Math.min(window.devicePixelRatio || 1, cap)
  })

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
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = (event) => setReducedMotion(event.matches)
    const pauseWhenHidden = () => {
      if (document.hidden) timelineRef.current?.pause()
      else timelineRef.current?.resume()
    }

    window.addEventListener('resize', updateDpr)
    motionQuery.addEventListener?.('change', updateMotionPreference)
    document.addEventListener('visibilitychange', pauseWhenHidden)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDpr)
      motionQuery.removeEventListener?.('change', updateMotionPreference)
      document.removeEventListener('visibilitychange', pauseWhenHidden)
      timelineRef.current?.kill()
    }
  }, [])

  const beginOpening = useCallback(({ camera, invalidate, targetCameraZ }) => {
    cameraRef.current = camera
    invalidateRef.current = invalidate
    cameraTargetRef.current = targetCameraZ

    if (startedRef.current) return
    startedRef.current = true

    if (reducedMotion) {
      cameraDollyRef.current.value = 1
      camera.position.z = targetCameraZ
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

    timeline.to(cameraDollyRef.current, {
      value: 1,
      duration: 1.15,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.z = cameraTargetRef.current +
          INITIAL_DOLLY_OFFSET * (1 - cameraDollyRef.current.value)
      },
    }, 0)

    timeline.to(progressRef.current, {
      value: 1,
      duration: 2.15,
      ease: 'power3.inOut',
    }, 0.78)

    timeline.to(titleRef.current, {
      autoAlpha: 0,
      x: -24,
      duration: 0.42,
      ease: 'power2.in',
    }, 1.3)

    timelineRef.current = timeline
  }, [reducedMotion])

  const handleSceneReady = useCallback((sceneApi) => {
    sceneApiRef.current = sceneApi
    if (texturesReady) beginOpening(sceneApi)
  }, [beginOpening, texturesReady])

  const handleTexturesReady = useCallback(() => {
    setTexturesReady(true)
  }, [])

  useEffect(() => {
    if (texturesReady && sceneApiRef.current && !startedRef.current) {
      beginOpening(sceneApiRef.current)
    }
  }, [texturesReady, beginOpening])

  useEffect(() => {
    if (!reducedMotion || !texturesReady || startedRef.current) return
    // Switching the OS preference on mid-intro settles the scene immediately.
    cameraDollyRef.current.value = 1
    if (cameraRef.current) cameraRef.current.position.z = cameraTargetRef.current
    progressRef.current.value = 1
    timelineRef.current?.kill()
    timelineRef.current = null
    invalidateRef.current?.()
    setOpened(true)
    startedRef.current = true
  }, [reducedMotion, texturesReady])

  const skip = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true
    timelineRef.current?.kill()
    timelineRef.current = null
    onSkip?.()
  }, [onSkip])

  const enter = useCallback(() => {
    if (!opened || exitingRef.current) return
    exitingRef.current = true

    if (reducedMotion) {
      onComplete?.()
      return
    }

    const camera = cameraRef.current
    const host = hostRef.current
    const currentZ = camera?.position.z ?? cameraTargetRef.current

    const exitTimeline = gsap.timeline({
      onUpdate: () => invalidateRef.current?.(),
      onComplete: () => onComplete?.(),
    })
    timelineRef.current = exitTimeline
    exitTimeline.to(camera?.position || {}, {
      z: Math.max(0.1, currentZ - 0.28),
      duration: 0.45,
      ease: 'power2.inOut',
    }, 0)
    exitTimeline.to(host, {
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power1.inOut',
    }, 0)
  }, [opened, reducedMotion, onComplete])

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
          camera={{ position: [0, 0, 7], fov: CAMERA_FOV, near: 0.1, far: 40 }}
          onCreated={({ gl, invalidate }) => {
            gl.outputColorSpace = SRGBColorSpace
            gl.toneMapping = ACESFilmicToneMapping
            invalidateRef.current = invalidate
          }}
        >
              <ambientLight intensity={0.95} />
          <directionalLight position={[-3.5, 4.5, 5]} intensity={2.35} />
          <directionalLight position={[3.5, -1.5, 3]} intensity={0.72} color="#e4cda8" />
          <pointLight position={[0, 2.8, 3.5]} intensity={0.65} color="#f2e5cd" />


          <Suspense fallback={null}>
            <BookScene
              progressRef={progressRef}
              cameraDollyRef={cameraDollyRef}
              onReady={handleSceneReady}
              onTexturesReady={handleTexturesReady}
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
