import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;
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
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }
  return value;
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 px = 1.0 / u_resolution;
  float t = u_time;

  if (u_mode > 0.5) {
    float broad = fbm(vec2(uv.x * 5.2, 2.4 + t * 0.018));
    float torn = fbm(vec2(uv.x * 34.0, 8.0 + t * 0.025));
    float fibers = noise(vec2(uv.x * 190.0, uv.y * 90.0));
    float edge = 0.37 + (broad - 0.5) * 0.22 + (torn - 0.5) * 0.13;
    edge += (fibers - 0.5) * 0.018;
    float distanceToTear = uv.y - edge;
    float aa = px.y * 1.5;
    float paperMask = 1.0 - smoothstep(-aa, aa, distanceToTear);
    float raggedShadow = smoothstep(-0.035, 0.004, distanceToTear) * (1.0 - smoothstep(0.004, 0.025, distanceToTear));
    float grain = (hash(gl_FragCoord.xy + floor(t * 8.0)) - 0.5) * 0.045;
    vec3 paper = vec3(0.88, 0.85, 0.78);
    paper += (broad - 0.5) * 0.035 + grain;
    paper -= raggedShadow * 0.17;
    float fiberLine = smoothstep(0.92, 1.0, noise(vec2(uv.x * 270.0, uv.y * 110.0)));
    paper += fiberLine * 0.025;
    gl_FragColor = vec4(paper, paperMask);
    return;
  }

  float grain = fbm(uv * vec2(210.0, 150.0) + vec2(t * 0.01, 0.0));
  float fibers = noise(vec2(uv.x * 330.0, uv.y * 105.0));
  float edgeNoise = fbm(vec2(uv.y * 8.0, uv.x * 13.0));
  float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float roughEdge = 0.006 + (edgeNoise - 0.5) * 0.006;
  float edgeBand = 1.0 - smoothstep(roughEdge, roughEdge + 0.012, edgeDist);
  float fold = exp(-abs(uv.x - 0.5) * 85.0);
  float foldHighlight = exp(-pow((uv.x - 0.492) * 95.0, 2.0));
  float grainAlpha = (grain - 0.5) * 0.10 + (fibers - 0.5) * 0.035;
  vec3 ink = vec3(0.22, 0.19, 0.15);
  vec3 warm = vec3(0.91, 0.87, 0.79);
  vec3 color = mix(ink, warm, 0.72);
  color += foldHighlight * 0.16;
  color -= fold * 0.13;
  color -= edgeBand * 0.14;
  gl_FragColor = vec4(color, clamp(0.055 + abs(grainAlpha) + edgeBand * 0.16 + fold * 0.18, 0.0, 0.34));
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

export default function PaperShader({ variant = 'spread', className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let gl
    let program
    let frame = 0
    let start = performance.now()
    let visible = true
    let disposed = false
    let resizeObserver
    let positionBuffer

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
      gl.uniform1f(gl.getUniformLocation(program, 'u_mode'), variant === 'index-edge' ? 1 : 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

      const draw = () => {
        if (disposed || !visible) return
        const rect = canvas.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        const width = Math.max(1, Math.round(rect.width * dpr))
        const height = Math.max(1, Math.round(rect.height * dpr))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          gl.viewport(0, 0, width, height)
        }
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), width, height)
        const time = reducedMotion.matches ? 0 : (performance.now() - start) / 1000
        gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        if (!reducedMotion.matches) frame = requestAnimationFrame(draw)
      }

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible && !reducedMotion.matches) {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(draw)
        }
      })
      observer.observe(canvas)
      resizeObserver = new ResizeObserver(() => {
        if (visible) {
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(draw)
        }
      })
      resizeObserver.observe(canvas)
      const onMotionChange = () => {
        cancelAnimationFrame(frame)
        start = performance.now()
        if (visible) frame = requestAnimationFrame(draw)
      }
      reducedMotion.addEventListener?.('change', onMotionChange)
      canvas.dataset.shader = 'ready'
      frame = requestAnimationFrame(draw)

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        observer.disconnect()
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
  }, [variant])

  return <canvas ref={canvasRef} className={`paper-shader paper-shader--${variant} ${className}`} aria-hidden="true" />
}
