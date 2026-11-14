import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShader = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mode;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = p * 2.01 + vec2(13.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 px = 1.0 / u_resolution;
  float t = u_time;

  if (u_mode > 0.5) {
    float broad = noise(vec2(uv.x * 5.0, 2.4 + t * 0.008));
    float torn = noise(vec2(uv.x * 23.0, 8.0 + t * 0.012));
    float fibers = noise(vec2(uv.x * 91.0, 13.0));
    float edge = 0.42 + (broad - 0.5) * 0.34 + (torn - 0.5) * 0.26;
    edge += (fibers - 0.5) * 0.12;
    float distanceToTear = uv.y - edge;
    float aa = px.y * 1.35;
    float paperMask = 1.0 - smoothstep(-aa, aa, distanceToTear);
    float raggedShadow = smoothstep(-0.045, 0.002, distanceToTear) * (1.0 - smoothstep(0.002, 0.03, distanceToTear));
    float grain = (hash(gl_FragCoord.xy) - 0.5) * 0.035;
    vec3 paper = vec3(0.88, 0.85, 0.78);
    paper += (broad - 0.5) * 0.035 + grain;
    paper -= raggedShadow * 0.24;
    float fiberLine = smoothstep(0.92, 1.0, noise(vec2(uv.x * 190.0, uv.y * 72.0)));
    paper += fiberLine * 0.02;
    gl_FragColor = vec4(paper, paperMask);
    return;
  }

  float grain = noise(uv * vec2(160.0, 112.0));
  float fibers = noise(vec2(uv.x * 240.0, uv.y * 82.0));
  float edgeNoise = noise(vec2(uv.y * 8.0, uv.x * 13.0));
  float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float roughEdge = 0.006 + (edgeNoise - 0.5) * 0.006;
  float edgeBand = 1.0 - smoothstep(roughEdge, roughEdge + 0.012, edgeDist);
  float fold = exp(-abs(uv.x - 0.5) * 85.0);
  float foldHighlight = exp(-pow((uv.x - 0.492) * 95.0, 2.0));
  float grainAlpha = (grain - 0.5) * 0.07 + (fibers - 0.5) * 0.025;
  vec3 ink = vec3(0.22, 0.19, 0.15);
  vec3 warm = vec3(0.91, 0.87, 0.79);
  vec3 color = mix(ink, warm, 0.72);
  color += foldHighlight * 0.16;
  color -= fold * 0.13;
  color -= edgeBand * 0.14;
  gl_FragColor = vec4(color, clamp(0.045 + abs(grainAlpha) + edgeBand * 0.14 + fold * 0.16, 0.0, 0.30));
}
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'Paper shader compilation failed')
  }
  return shader
}

export default function PaperShader({ variant = 'spread', className = '', active = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let gl
    let program
    let frame = 0
    let lastFrame = 0
    let visible = true
    let disposed = false
    let resizeObserver
    let intersectionObserver
    let positionBuffer
    let resolutionLocation
    let timeLocation
    let modeLocation
    const targetFrameMs = 1000 / 30

    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        premultipliedAlpha: true,
      })
      if (!gl) throw new Error('WebGL unavailable')

      const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
      const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
      program = gl.createProgram()
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'Paper shader link failed')
      }

      positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      gl.useProgram(program)
      const position = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
      timeLocation = gl.getUniformLocation(program, 'u_time')
      modeLocation = gl.getUniformLocation(program, 'u_mode')
      gl.uniform1f(modeLocation, variant === 'index-edge' ? 1 : 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      const draw = (now = performance.now()) => {
        if (disposed || !visible) return
        const rect = canvas.getBoundingClientRect()
        // Keep the shader deliberately lightweight on high-density displays.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.15)
        const width = Math.max(1, Math.round(rect.width * dpr))
        const height = Math.max(1, Math.round(rect.height * dpr))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          gl.viewport(0, 0, width, height)
        }
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform2f(resolutionLocation, width, height)
        gl.uniform1f(timeLocation, active && !reducedMotion.matches ? now / 1000 : 0)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }

      const schedule = now => {
        if (disposed || !visible || !active || reducedMotion.matches) return
        if (now - lastFrame >= targetFrameMs) {
          lastFrame = now
          draw(now)
        }
        frame = requestAnimationFrame(schedule)
      }
      const render = () => {
        cancelAnimationFrame(frame)
        draw()
        lastFrame = performance.now()
        if (active && !reducedMotion.matches && visible) frame = requestAnimationFrame(schedule)
      }

      intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) render()
        else cancelAnimationFrame(frame)
      })
      intersectionObserver.observe(canvas)
      resizeObserver = new ResizeObserver(render)
      resizeObserver.observe(canvas)
      const onMotionChange = render
      reducedMotion.addEventListener?.('change', onMotionChange)
      canvas.dataset.shader = 'ready'
      render()

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        intersectionObserver?.disconnect()
        resizeObserver?.disconnect()
        reducedMotion.removeEventListener?.('change', onMotionChange)
        if (positionBuffer) gl.deleteBuffer(positionBuffer)
        if (program) gl.deleteProgram(program)
      }
    } catch (error) {
      canvas.dataset.shader = 'fallback'
      canvas.setAttribute('aria-hidden', 'true')
      console.warn('Paper shader fallback:', error)
      if (gl && program) gl.deleteProgram(program)
      return undefined
    }
  }, [variant, active])

  return <canvas ref={canvasRef} className={`paper-shader paper-shader--${variant} ${className}`} aria-hidden="true" />
}
