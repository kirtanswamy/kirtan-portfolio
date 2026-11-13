import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk,
  ArrowUp, ExternalLink, Code2, Menu, MoveUpRight, X,
  CircleDot, Sparkles, BookOpen, Cpu, Layers3, Compass, Send,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01', name: 'BUSHO', category: 'PUBLIC SYSTEMS', type: 'Health-tech · Operations',
    description: 'A frontline healthcare operations platform exploring how health workers and supervisors can move information through a clearer, more accountable workflow.',
    stage: 'IN DEVELOPMENT', year: '2026', tone: 'blue',
    href: 'https://busho.de5.net', repo: 'https://github.com/kirtanswamy/BUSHO',
    tags: ['React', 'Supabase', 'Workflow design'],
    note: 'From the field, for the field.',
    contribution: 'PROJECT LEAD · PRODUCT & DEVELOPMENT',
    problem: 'Frontline health information needs a dependable path from the person recording it to the supervisor who reviews and acts on it.',
    approach: 'Prototype a frontline reporting workflow: capture a report, structure editable draft fields, require human verification, then surface a supervisor review and replenishment draft.',
    current: 'A browser-based prototype using synthetic sample data, mock rule-based extraction and browser-local storage. It is not connected to live government inventory or a shared production backend; the complete workflow and field validation remain in progress.',
    next: 'Complete the full reporting-to-review loop, validate the data model and test the workflow against realistic field conditions.',
  },
  {
    id: '02', name: 'VARSITY', category: 'CAMPUS LIFE', type: 'Ed-tech · Student experience',
    description: 'A student-first campus companion bringing attendance, academic resources, previous-year papers and everyday planning into one considered experience.',
    stage: 'PRODUCT BUILD', year: '2026', tone: 'orange',
    href: 'https://github.com/aalindmukati/Varsity', repo: 'https://github.com/aalindmukati/Varsity',
    tags: ['React Native', 'Expo', 'Product design'],
    note: 'Make campus life feel connected.',
    contribution: 'APP DEVELOPMENT LEAD',
    problem: 'Students often have to move between separate places to check attendance, marks, schedules and useful study material.',
    approach: 'Bring core academic information into one student-first companion: attendance tracking and prediction, marks, schedules, CT resources, notes and previous-year questions.',
    current: 'An active product build with the core experience and multiple feature areas under development. This is not being presented as a completed campus-wide release.',
    next: 'Tighten the end-to-end student workflows, validate data accuracy and test the experience with real student use cases.',
  },
  {
    id: '03', name: 'ELECTROLAB', category: 'ENGINEERING', type: 'Electronics · Simulation',
    description: 'An interactive electronics workbench for exploring diode behaviour through live calculations, voltage sweeps and visual circuit intuition.',
    stage: 'WORKING PROTOTYPE', year: '2026', tone: 'green',
    href: 'https://github.com/kirtanswamy/ElectroLab', repo: 'https://github.com/kirtanswamy/ElectroLab',
    tags: ['React', 'TypeScript', 'Electronics'],
    note: 'Making invisible behaviour visible.',
    contribution: 'ENGINEERING & IMPLEMENTATION',
    problem: 'Diode behaviour is easier to understand when equations, changing parameters and voltage response can be explored together.',
    approach: 'Implement the Shockley diode model, validated calculations, a voltage-sweep engine with signed-log graphing and a bisection solver for a series-diode circuit.',
    current: 'The calculation engine, responsive parameter controls, sweep visualisation and series-diode solver have been implemented and tested in the current prototype.',
    next: 'Extend the workbench with additional circuit experiments, clearer guided explanations and more model validation cases.',
  },
  {
    id: '04', name: 'JANSEVA ONE', category: 'CIVIC INNOVATION', type: 'Civic-tech · Public impact',
    description: 'A unified civic action concept focused on making local infrastructure issues easier to report, track and resolve through community participation.',
    stage: 'CONCEPT / PRESENTED', year: '2026', tone: 'red',
    href: '', repo: '',
    tags: ['Civic technology', 'Research', 'Public systems'],
    note: 'A small report should start a real response.',
    contribution: 'CIVIC-TECH CONCEPT',
    problem: 'Local infrastructure concerns can be difficult for residents to report and follow through to a visible response.',
    approach: 'Propose a unified civic action platform for reporting and tracking local issues, with an initial focus on road-related problems and a community-to-public-system feedback loop.',
    current: 'A civic-tech concept exploring a clearer route for residents to report and follow local infrastructure issues. It is a proposal, not a deployed government service.',
    next: 'Prototype the reporting and resolution journey, test the assumptions with community stakeholders and explore a focused local pilot.',
  },
  {
    id: '05', name: 'CHHUTTI KE BAAD', category: 'INTERACTIVE EXPERIENCE', type: 'Creative coding · Nostalgia',
    description: 'An interactive time machine for the golden after-school hours of Indian childhood: the room, the CRT, the remote and the little rituals around them.',
    stage: 'LIVE EXPERIENCE', year: '2026', tone: 'orange',
    href: 'https://chhutti-ke-baad.vercel.app/', repo: 'https://github.com/kirtanswamy/chhutti-ke-baad',
    tags: ['React', 'Vite', 'Interactive storytelling'],
    note: 'School is over. The TV is on.',
    contribution: 'CONCEPT · DESIGN & DEVELOPMENT',
    problem: 'A familiar after-school ritual is difficult to capture in a conventional project page. The atmosphere and small interactions are the experience.',
    approach: 'Build an explorable illustrated room with a CRT television, interactive remote, changing room lighting, a show browser, school-day objects and small surprises.',
    current: 'A live interactive website. The README documents the CRT video experience, remote controls, afternoon/evening/lights-off ambience, interactive room props and keyboard-friendly controls.',
    next: 'Bring the room into the portfolio as a miniature playable case study, preserving the original live experience as the primary destination.',
  },
]

const categories = ['ALL WORK', 'PUBLIC SYSTEMS', 'CAMPUS LIFE', 'ENGINEERING', 'CIVIC INNOVATION', 'INTERACTIVE EXPERIENCE']

const chapterItems = [
  ['01', 'STORY', '#story'], ['02', 'WORK', '#work'], ['03', 'PROCESS', '#process'], ['04', 'RECOGNITION', '#recognition'], ['05', 'UP NEXT', '#up-next'], ['06', 'FIELD NOTE', '#field-notes'], ['07', 'ABOUT', '#about'],
  ['08', 'JOURNEY', '#journey'], ['09', 'LEARNING', '#learning'], ['10', 'TOOLBOX', '#skills'], ['11', 'CONTACT', '#contact'],
]

const learning = [
  { name: 'Qualcomm AI Upskilling', detail: 'Technical Foundations', kind: 'AI / MACHINE LEARNING', category: 'TECH', record: 'COURSE', status: 'COURSE COMPLETED · CREDENTIAL NOT VERIFIED' },
  { name: 'Goldman Sachs', detail: 'Operations Job Simulation · Forage', kind: 'BUSINESS / OPERATIONS', category: 'BUSINESS', record: 'SIMULATION', status: 'JOB SIMULATION COMPLETED' },
  { name: 'Google Ads & Analytics', detail: 'Digital marketing and measurement learning', kind: 'DIGITAL / ANALYTICS', category: 'DIGITAL', record: 'LEARNING LOG', status: 'COURSE DETAILS TO VERIFY' },
  { name: 'Microsoft × LinkedIn', detail: 'Generative AI learning programme', kind: 'GENERATIVE AI', category: 'TECH', record: 'COURSE', status: 'COURSE COMPLETED · EXACT TITLE TO VERIFY' },
]

const learningCategories = ['ALL ENTRIES', 'TECH', 'BUSINESS', 'DIGITAL']

const skills = [
  { group: 'FRONTEND & APPS', items: ['HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Expo', 'Flutter'] },
  { group: 'PROGRAMMING', items: ['Python', 'C / C++', 'Java', 'API integration', 'Responsive UI'] },
  { group: 'PRODUCT & SYSTEMS', items: ['UI / UX', 'Git & GitHub', 'Supabase', 'Vite', 'Electronics', 'AI / ML foundations'] },
]

const navItems = [
  ['STORY', '#story'], ['WORK', '#work'], ['PROCESS', '#process'], ['RECOGNITION', '#recognition'], ['UP NEXT', '#up-next'], ['FIELD NOTES', '#field-notes'], ['ABOUT', '#about'],
  ['JOURNEY', '#journey'], ['LEARNING', '#learning'], ['TOOLBOX', '#skills'], ['CONTACT', '#contact'],
]

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>
}

function ProjectVisual({ project }) {
  if (project.id === '01') return (
    <svg className="project-visual project-visual-busho" viewBox="0 0 520 230" role="img" aria-label="Conceptual health worker to supervisor reporting workflow">
      <path d="M130 108H190M330 108H390" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
      <path d="m180 101 10 7-10 7M380 101l10 7-10 7" stroke="currentColor" fill="none" strokeWidth="1.5"/>
      <rect x="14" y="45" width="116" height="125" rx="4" fill="#f1e8d8" fillOpacity=".5" stroke="currentColor"/>
      <rect x="202" y="45" width="116" height="125" rx="4" fill="#f1e8d8" fillOpacity=".5" stroke="currentColor"/>
      <rect x="390" y="45" width="116" height="125" rx="4" fill="#f1e8d8" fillOpacity=".5" stroke="currentColor"/>
      <g fill="currentColor" fontFamily="monospace" fontSize="11"><text x="26" y="67">01 / FIELD</text><text x="214" y="67">02 / RECORD</text><text x="402" y="67">03 / REVIEW</text></g>
      <g stroke="currentColor" fill="none"><circle cx="72" cy="102" r="16"/><path d="M45 145c3-18 51-18 54 0M229 91h62M229 108h62M229 125h42M417 91h62M417 108h62M417 125h42" strokeWidth="2"/></g>
      <g fill="#254cdb"><circle cx="72" cy="102" r="5"/><circle cx="260" cy="91" r="3"/><circle cx="448" cy="91" r="3"/></g>
      <g fill="currentColor" fontFamily="monospace" fontSize="9"><text x="27" y="190">HEALTH WORKER</text><text x="217" y="190">STRUCTURED DATA</text><text x="414" y="190">SUPERVISOR</text></g>
    </svg>
  )
  if (project.id === '02') return (
    <svg className="project-visual project-visual-varsity" viewBox="0 0 520 230" role="img" aria-label="Illustrative student campus dashboard concept; values are placeholders, not live student data">
      <rect x="20" y="18" width="480" height="194" rx="5" fill="#f1e8d8" fillOpacity=".65" stroke="currentColor"/>
      <path d="M20 48H500" stroke="currentColor" opacity=".5"/>
      <circle cx="37" cy="33" r="4" fill="#c94d34"/><circle cx="51" cy="33" r="4" fill="#d3a24c"/><circle cx="65" cy="33" r="4" fill="#63814d"/>
      <rect x="38" y="65" width="128" height="125" rx="3" fill="#254cdb" fillOpacity=".12" stroke="currentColor" opacity=".8"/>
      <text x="52" y="86" fill="currentColor" fontSize="10" fontFamily="monospace">ATTENDANCE</text>
      <circle cx="102" cy="132" r="31" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="7"/>
      <path d="M102 101a31 31 0 1 1-27 46" fill="none" stroke="#254cdb" strokeWidth="7" strokeLinecap="round"/>
      <text x="102" y="137" textAnchor="middle" fill="currentColor" fontSize="16" fontFamily="sans-serif">—</text>
      <rect x="184" y="65" width="135" height="55" rx="3" fill="#f1e8d8" stroke="currentColor"/>
      <rect x="335" y="65" width="145" height="55" rx="3" fill="#f1e8d8" stroke="currentColor"/>
      <rect x="184" y="133" width="296" height="57" rx="3" fill="#f1e8d8" stroke="currentColor"/>
      <g fill="currentColor" fontFamily="monospace" fontSize="9"><text x="196" y="82">UPCOMING TEST</text><text x="196" y="105" fontSize="13">DLD · UNIT 04</text><text x="347" y="82">STUDY MATERIAL</text><text x="347" y="105" fontSize="13">PYQ ARCHIVE</text><text x="198" y="151">YOUR WEEK / ACADEMIC TIMELINE</text></g>
      <path d="M198 174h38v-7h37v10h38v-14h37v8h37v-6h37v8h38" fill="none" stroke="#254cdb" strokeWidth="2"/>
    </svg>
  )
  if (project.id === '05') return (
    <svg className="project-visual project-visual-chutti" viewBox="0 0 520 230" role="img" aria-label="Illustration of an after-school room with a CRT television and interactive remote">
      <rect x="18" y="18" width="484" height="194" rx="4" fill="#e8c58e" fillOpacity=".25" stroke="currentColor"/>
      <path d="M18 166H502" stroke="currentColor" strokeOpacity=".45"/>
      <rect x="160" y="48" width="204" height="118" rx="14" fill="#262523" stroke="currentColor" strokeWidth="2"/>
      <rect x="176" y="61" width="171" height="88" rx="28" fill="#d9d0b9" stroke="#262523" strokeWidth="5"/>
      <rect x="187" y="70" width="148" height="70" rx="22" fill="#294c83"/>
      <path d="M197 122c22-35 42-35 62-7s42 22 68-20" fill="none" stroke="#f0d39d" strokeWidth="3"/>
      <circle cx="353" cy="160" r="3" fill="#c94d34"/>
      <path d="M210 168v15m105-15v15m-120 0h135" stroke="currentColor" strokeWidth="2"/>
      <rect x="389" y="84" width="30" height="91" rx="8" fill="#e5dfd0" stroke="currentColor"/>
      <circle cx="404" cy="98" r="5" fill="#c94d34"/><circle cx="404" cy="116" r="4" fill="#254cdb"/><path d="M399 136h10m-10 10h10" stroke="currentColor"/>
      <path d="M54 164v-40h48v40m-56 0h64" fill="none" stroke="currentColor" strokeWidth="2"/>
      <rect x="60" y="108" width="36" height="18" rx="2" fill="#c94d34" fillOpacity=".7"/>
      <g fill="currentColor" fontFamily="monospace" fontSize="10"><text x="36" y="39">AFTER SCHOOL / 04:15 PM</text><text x="178" y="202">THE CRT IS WAITING</text><text x="386" y="202">REMOTE / 01</text></g>
    </svg>
  )
  if (project.id === '03') return (
    <svg className="project-visual project-visual-electrolab" viewBox="0 0 520 230" role="img" aria-label="Conceptual diode current voltage characteristic graph">
      <g stroke="currentColor" strokeOpacity=".2"><path d="M48 25V195H488M48 60H488M48 95H488M48 130H488M48 165H488" fill="none" strokeDasharray="3 5"/><path d="M136 25V195M224 25V195M312 25V195M400 25V195" fill="none" strokeDasharray="3 5"/></g>
      <path d="M48 108H488M268 25V195" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M55 108C135 108 190 108 235 109S284 111 302 103 326 82 341 51 366 19 395 13" fill="none" stroke="#254cdb" strokeWidth="4" strokeLinecap="round"/>
      <path d="M55 108C135 108 190 108 235 109S284 111 302 103 326 82 341 51 366 19 395 13L395 108Z" fill="#254cdb" fillOpacity=".12"/>
      <g fill="currentColor" fontFamily="monospace" fontSize="10"><text x="55" y="18">DIODE I–V SWEEP</text><text x="468" y="127">V</text><text x="280" y="37">I</text><text x="55" y="218">REVERSE</text><text x="423" y="218">FORWARD</text></g>
      <circle cx="341" cy="51" r="5" fill="#c94d34" stroke="#f1e8d8" strokeWidth="2"/>
    </svg>
  )
  return (
    <svg className="project-visual project-visual-janseva" viewBox="0 0 520 230" role="img" aria-label="Conceptual civic issue reporting and resolution map">
      <path d="M20 30 150 18 176 195 37 210ZM176 18l150 10-15 175-135-8ZM326 28l170-8-20 182-165 1Z" fill="#f1e8d8" fillOpacity=".25" stroke="currentColor" strokeOpacity=".45"/>
      <path d="m31 84 454 50M112 20l-5 183M265 20l-2 175M411 22l-10 177" stroke="currentColor" strokeOpacity=".25" strokeDasharray="4 5"/>
      <path d="M108 87c35 0 39 42 80 42s49-54 87-54 50 52 87 52" fill="none" stroke="#254cdb" strokeWidth="3" strokeDasharray="7 6"/>
      <g><circle cx="108" cy="87" r="10" fill="#c94d34"/><circle cx="275" cy="75" r="10" fill="#d3a24c"/><circle cx="362" cy="127" r="10" fill="#63814d"/></g>
      <g fill="currentColor" fontFamily="monospace" fontSize="10"><text x="36" y="58">REPORT</text><text x="224" y="47">ASSIGN</text><text x="350" y="157">RESOLVE</text><text x="30" y="224">LOCAL ISSUE → PUBLIC ACTION</text></g>
      <rect x="390" y="36" width="105" height="34" rx="3" fill="#f1e8d8" stroke="currentColor"/><text x="402" y="57" fill="currentColor" fontFamily="monospace" fontSize="9">STATUS / OPEN</text>
    </svg>
  )
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <article className={`project-card project-${project.tone} reveal`}>
      <div className="project-card-top">
        <span className="project-number">{project.id} / 04</span>
        <span className="project-stage"><span />{project.stage}</span>
      </div>
      <button type="button" className="project-art project-art-button" onClick={() => onOpen(project)} aria-label={`Read the ${project.name} project note`}>
        <div className="project-art-grid" aria-hidden="true" />
        <span className="project-art-index">{project.id}</span>
        <span className="project-art-name">{project.name}</span>
        <span className="project-art-note">{project.note}</span>
        <span className="project-art-arrow"><ArrowUpRight size={24} /></span>
        {index === 0 && <div className="art-orbit" aria-hidden="true"><i /><i /><i /></div>}
        {index === 1 && <div className="art-stack" aria-hidden="true"><i /><i /><i /></div>}
        {index === 2 && <div className="art-circuit" aria-hidden="true"><i /><i /><i /><i /><i /></div>}
        {index === 3 && <div className="art-sun" aria-hidden="true"><Asterisk size={150} strokeWidth={0.7} /></div>}
      </button>
      <div className="project-info">
        <div className="project-title-line">
          <div><Eyebrow>{project.category} · {project.year}</Eyebrow><h3>{project.name}<sup>®</sup></h3></div>
          {project.repo ? <a href={project.repo} target="_blank" rel="noreferrer" className="project-repo" aria-label={`View ${project.name} repository`}><Code2 size={17} /><ArrowUpRight size={13} /></a> : <span className="project-repo project-repo-unavailable" aria-label={`${project.name} repository link not yet available`} title="Repository link not yet available"><Code2 size={17} /><span>LINK PENDING</span></span>}
        </div>
        <p className="project-type">{project.type}</p>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <button type="button" className="project-read-more" onClick={() => onOpen(project)}>OPEN PROJECT NOTE <ArrowUpRight size={13} /></button>
      </div>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL WORK')
  const [activeSection, setActiveSection] = useState('')
  const [activeProject, setActiveProject] = useState(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeLearningCategory, setActiveLearningCategory] = useState('ALL ENTRIES')
  const projectShelfRef = useRef(null)
  const shelfDragRef = useRef({ pointerId: null, startX: 0, scrollLeft: 0, dragged: false })

  const visibleLearning = useMemo(
    () => activeLearningCategory === 'ALL ENTRIES' ? learning : learning.filter(item => item.category === activeLearningCategory),
    [activeLearningCategory],
  )

  const visibleProjects = useMemo(
    () => activeCategory === 'ALL WORK' ? projects : projects.filter(project => project.category === activeCategory),
    [activeCategory],
  )

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion')
      return () => document.documentElement.classList.remove('reduce-motion')
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 1.35 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const animationContext = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
    intro
      .fromTo('.masthead', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.hero-overline > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, '-=0.3')
      .fromTo('.hero-headline .headline-row', { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.1 }, '-=0.25')
      .fromTo('.hero-deck, .hero-aside, .portrait-frame', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.45')
      .fromTo('.portrait-art', { scale: 0.94, rotate: -3 }, { scale: 1, rotate: 0, duration: 1.25, ease: 'power3.out' }, '-=0.65')
      .fromTo('.portrait-caption', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.45')

    gsap.utils.toArray('.reveal').forEach(element => {
      gsap.fromTo(element, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      })
    })

    gsap.utils.toArray('.section-title').forEach(element => {
      gsap.fromTo(element.querySelectorAll('.title-mask > span'), { yPercent: 115 }, {
        yPercent: 0, duration: 0.95, stagger: 0.09, ease: 'power4.out',
        scrollTrigger: { trigger: element, start: 'top 84%', once: true },
      })
    })

    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => gsap.set('.reading-progress__bar', { scaleX: self.progress }) })
    gsap.to('.portrait-art', {
      yPercent: 9,
      rotate: 2,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    })
    gsap.to('.hero-edition-mark', {
      y: 24,
      rotate: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    })
    gsap.to('.orbit-ring', { rotate: 360, duration: 38, repeat: -1, ease: 'none' })
    gsap.to('.hero-starburst', { rotate: -360, duration: 54, repeat: -1, ease: 'none' })
    })

    const workbench = document.querySelector('.portrait-frame')
    const deskArt = workbench?.querySelector('.desk-illustration')
    const moveDeskX = deskArt ? gsap.quickTo(deskArt, 'x', { duration: 0.55, ease: 'power3.out' }) : null
    const moveDeskY = deskArt ? gsap.quickTo(deskArt, 'y', { duration: 0.55, ease: 'power3.out' }) : null
    const moveDeskRotate = deskArt ? gsap.quickTo(deskArt, 'rotation', { duration: 0.7, ease: 'power3.out' }) : null
    const onDeskMove = event => {
      if (!workbench || !moveDeskX || !moveDeskY || !moveDeskRotate) return
      const bounds = workbench.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      moveDeskX(x * 7)
      moveDeskY(y * 5)
      moveDeskRotate(x * 1.2)
    }
    const resetDesk = () => {
      moveDeskX?.(0)
      moveDeskY?.(0)
      moveDeskRotate?.(0)
    }
    workbench?.addEventListener('pointermove', onDeskMove)
    workbench?.addEventListener('pointerleave', resetDesk)

    return () => {
      workbench?.removeEventListener('pointermove', onDeskMove)
      workbench?.removeEventListener('pointerleave', resetDesk)
      gsap.ticker.remove(tick)
      lenis.destroy()
      animationContext.revert()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    if (!menuOpen) return () => document.body.classList.remove('menu-open')
    document.querySelector('.mobile-nav a')?.focus()
    const onKeyDown = event => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      document.querySelector('.menu-button')?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  useEffect(() => {
    const nodes = chapterItems.map(([, , href]) => document.querySelector(href)).filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(`#${visible.target.id}`)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.35] })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const moveProjectShelf = direction => {
    const shelf = projectShelfRef.current
    if (!shelf) return
    const card = shelf.querySelector('.project-card')
    const distance = card ? card.getBoundingClientRect().width + 22 : shelf.clientWidth * 0.8
    shelf.scrollBy({ left: direction * distance, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    if (!activeProject) return undefined
    const previouslyFocused = document.activeElement
    const dialog = document.querySelector('.project-dialog')
    const closeButton = dialog?.querySelector('.project-dialog-top button')
    closeButton?.focus()
    const onKeyDown = event => {
      if (event.key === 'Escape') { setActiveProject(null); return }
      if (event.key !== 'Tab' || !dialog) return
      const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled])')]
      if (!focusable.length) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('dialog-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('dialog-open')
      previouslyFocused?.focus?.()
    }
  }, [activeProject])

  useEffect(() => {
    if (projectShelfRef.current) projectShelfRef.current.scrollTo({ left: 0, behavior: 'auto' })
    setActiveProjectIndex(0)
  }, [activeCategory])

  return (
    <main className="site-shell" id="top">
      <a className="skip-link" href="#main-content">SKIP TO CONTENT</a>
      <div className="reading-progress" aria-hidden="true"><span className="reading-progress__bar" /></div>
      <div className="paper-grain" aria-hidden="true" />
      <nav className="chapter-rail" aria-label="Page chapters">
        <span className="chapter-rail-label">THE NOTEBOOK</span>
        {chapterItems.map(([number, label, href]) => <a key={href} href={href} className={activeSection === href ? 'active' : ''} aria-label={label} aria-current={activeSection === href ? 'location' : undefined}><span>{number}</span><i /><small>{label}</small></a>)}
      </nav>
      <aside className="desk-note" aria-label="Featured project shortcut">
        <span className="desk-note-kicker">ON THE DESK / CURRENT FILE</span>
        <strong>{visibleProjects[Math.min(activeProjectIndex, visibleProjects.length - 1)]?.name ?? 'PROJECT ARCHIVE'}</strong>
        <span className="desk-note-category">{visibleProjects[Math.min(activeProjectIndex, visibleProjects.length - 1)]?.category ?? 'SELECTED WORK'}</span>
        <button type="button" onClick={() => { const project = visibleProjects[Math.min(activeProjectIndex, visibleProjects.length - 1)]; if (project) setActiveProject(project) }}>OPEN FILE <ArrowUpRight size={12}/></button>
      </aside>
      <header className="masthead">
        <a className="masthead-brand" href="#top" aria-label="Kirtan Swamy home">
          <span className="brand-monogram">KS<span>®</span></span>
          <span className="brand-caption">THE PERSONAL<br />EDITION</span>
        </a>
        <div className="masthead-center"><span className="live-dot" /> INDEPENDENT MIND. COLLABORATIVE SPIRIT.</div>
        <div className="masthead-meta"><span>HYDERABAD, INDIA</span><span>VOL. 01 — 2026</span></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={href} className={activeSection === href ? 'active' : ''} href={href}>{label}<span>↗</span></a>)}
        </nav>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <Eyebrow>THE CONTENTS</Eyebrow>
        {navItems.map(([label, href], index) => <a key={href} href={href} onClick={closeMenu}><span>0{index + 1}</span>{label}<ArrowUpRight /></a>)}
        <p>AN OPEN NOTEBOOK · HYDERABAD, INDIA</p>
      </div>

      <section className="hero" id="main-content" aria-labelledby="hero-title">
        <div className="hero-overline">
          <Eyebrow>ENGINEERING / DESIGN / IDEAS</Eyebrow>
          <span className="edition-label">A WORK IN PROGRESS — ALWAYS</span>
          <span className="issue-date">FIELD EDITION / 2026</span>
        </div>
        <div className="hero-headline">
          <div className="headline-kicker"><span>THE MAKER'S</span><span className="headline-rule" /><span>NOTEBOOK</span></div>
          <h1 id="hero-title">
            <span className="headline-row">KIRTAN</span>
            <span className="headline-row headline-second">SWAMY<span className="headline-period">.</span><span className="hero-starburst"><Asterisk /></span></span>
          </h1>
          <div className="hero-bottomline"><span>CURIOUS BY NATURE.</span><span>BUILT BY TRYING.</span><span>GROUNDED IN PURPOSE.</span></div>
          <div className="hero-edition-mark" aria-hidden="true"><span>INDEPENDENT MAKER'S EDITION</span><strong>KS<span>®</span></strong><i>VOL. 01 / 2026</i></div>
        </div>
        <div className="hero-lower">
          <div className="hero-deck">
            <span className="drop-cap">I</span>
            <p>I'm an engineering student and creative builder exploring the space between <em>technology, design and people.</em> I like turning questions into prototypes—and prototypes into things that matter.</p>
            <a href="#story" className="read-link">READ MY STORY <ArrowDownRight size={16} /></a>
          </div>
          <div className="portrait-frame" aria-label="Temporary abstract newspaper-style maker character illustration; personal portrait version will be created later">
            <div className="portrait-top"><span>THE MAKER, IN PRINT</span><span>FIG. 001</span></div>
            <div className="portrait-art" aria-hidden="true">
              <div className="portrait-sun" />
              <div className="portrait-arch" />
              <div className="portrait-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />
              <div className="portrait-star">✳</div>
              <span className="portrait-coordinates">13°04' N<br />80°16' E</span>
            </div>
            <div className="portrait-caption"><span>AN ORIGINAL ILLUSTRATED IDENTITY</span><span>PERSONAL CHARACTER TO COME ↗</span></div>
          </div>
          <div className="hero-aside">
            <span className="aside-index">01 / 11</span>
            <p>NOT A FINISHED STORY.<br />A RECORD OF WHAT I'M<br />LEARNING TO MAKE.</p>
            <a href="#work" className="round-arrow" aria-label="Explore selected work"><ArrowDown /></a><span className="hero-scroll-note">SCROLL TO EXPLORE <i>↓</i></span>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="Portfolio themes">
        <div className="ticker-track">
          {[0, 1, 2, 3].map(item => <span key={item}>THINK CLEARLY <Asterisk /> BUILD USEFULLY <Asterisk /> STAY CURIOUS <Asterisk /> MAKE IT HUMAN <Asterisk /></span>)}
        </div>
      </div>

      <section className="manifesto section-pad reveal" id="story">
        <div className="section-index"><Eyebrow>01 — A SMALL MANIFESTO</Eyebrow><span>THE WHY</span></div>
        <div className="manifesto-content">
          <p className="manifesto-prelude">I believe the best work happens where disciplines overlap.</p>
          <h2>MAKE THINGS<br />THAT <em>MEAN</em><br />SOMETHING<span>.</span></h2>
          <div className="manifesto-foot"><p>Technology can be powerful. Design can make it understandable. Empathy can make it worth building. I'm interested in the point where all three meet.</p><span className="manifesto-stamp">THOUGHT<br />INTO ACTION<br /><Asterisk /></span></div>
        </div>
      </section>

      <section className="work-section section-pad" id="work">
        <div className="section-index reveal"><Eyebrow>02 — THE WORKSHOP</Eyebrow><span>SELECTED PROJECTS / 2025—26</span></div>
        <div className="section-heading section-title">
          <h2><span className="title-mask"><span>SELECTED</span></span><span className="title-mask"><span>WORK<span className="blue-period">.</span></span></span></h2>
          <p>Ideas are easy to have.<br />Making them useful is the work.</p>
        </div>
        <div className="project-index-bar">
          <div className="project-filters" role="group" aria-label="Filter projects">
            {categories.map(category => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}<span>{category === 'ALL WORK' ? '04' : String(projects.filter(project => project.category === category).length).padStart(2, '0')}</span></button>)}
          </div>
          <span className="archive-index-caption">FILE INDEX / 001—004</span>
        </div>
        <div className="shelf-toolbar reveal">
          <span>DRAG / SCROLL TO EXPLORE THE ARCHIVE</span>
          <div className="shelf-controls">
            <span className="shelf-counter">{String(activeProjectIndex + 1).padStart(2, '0')} <i>/</i> {String(visibleProjects.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => moveProjectShelf(-1)} disabled={activeProjectIndex === 0} aria-label="Previous project"><ArrowLeft size={16} /></button>
            <button type="button" onClick={() => moveProjectShelf(1)} disabled={activeProjectIndex >= visibleProjects.length - 1} aria-label="Next project"><ArrowRight size={16} /></button>
          </div>
        </div>
        <div className="projects-grid projects-shelf" ref={projectShelfRef} role="region" aria-label="Horizontally browsable featured project archive" tabIndex={0} aria-live="polite"
          onKeyDown={event => {
            if (event.key === 'ArrowRight') { event.preventDefault(); moveProjectShelf(1) }
            if (event.key === 'ArrowLeft') { event.preventDefault(); moveProjectShelf(-1) }
            if (event.key === 'Home') { event.preventDefault(); projectShelfRef.current?.scrollTo({ left: 0, behavior: 'smooth' }) }
            if (event.key === 'End') { event.preventDefault(); projectShelfRef.current?.scrollTo({ left: projectShelfRef.current.scrollWidth, behavior: 'smooth' }) }
          }}
          onPointerDown={event => {
            if (event.pointerType !== 'mouse' || event.button !== 0) return
            const drag = shelfDragRef.current
            drag.pointerId = event.pointerId
            drag.startX = event.clientX
            drag.scrollLeft = event.currentTarget.scrollLeft
            drag.dragged = false
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={event => {
            const drag = shelfDragRef.current
            if (drag.pointerId !== event.pointerId) return
            const delta = event.clientX - drag.startX
            if (Math.abs(delta) > 5) drag.dragged = true
            if (drag.dragged) event.currentTarget.scrollLeft = drag.scrollLeft - delta
          }}
          onPointerUp={event => { if (shelfDragRef.current.pointerId === event.pointerId) shelfDragRef.current.pointerId = null }}
          onPointerCancel={() => { shelfDragRef.current.pointerId = null }}
          onClickCapture={event => { if (shelfDragRef.current.dragged) { event.preventDefault(); event.stopPropagation(); shelfDragRef.current.dragged = false } }}
          onScroll={event => {
            const shelf = event.currentTarget
            const card = shelf.querySelector('.project-card')
            if (card) setActiveProjectIndex(Math.min(visibleProjects.length - 1, Math.max(0, Math.round(shelf.scrollLeft / (card.getBoundingClientRect().width + 22)))))
          }}>
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} onOpen={setActiveProject} />)}
        </div>
        <div className="work-foot reveal"><span>MORE EXPERIMENTS ARE ALWAYS IN THE WORKS.</span><a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer">EXPLORE GITHUB <ArrowUpRight size={14} /></a></div>
      </section>

      <section className="process-section section-pad" id="process">
        <div className="section-index reveal"><Eyebrow>03 — THE WAY I WORK</Eyebrow><span>THINK / CREATE / DELIVER</span></div>
        <div className="process-heading"><h2>THINK.<br/><em>CREATE.</em><br/>DELIVER<span>.</span></h2><p>Good work is rarely a straight line from brief to launch. It takes curiosity, craft, iteration and care for the person on the other side.</p></div>
        <div className="process-grid">
          <article className="process-card reveal"><span>01 / THINK</span><strong>FIND THE REAL QUESTION.</strong><p>Understand the context before reaching for a solution. Ask who the problem affects, what already exists and what would make a meaningful difference.</p><i>OBSERVE → QUESTION → FRAME</i></article>
          <article className="process-card reveal"><span>02 / CREATE</span><strong>MAKE THE IDEA TANGIBLE.</strong><p>Explore the experience, shape the interface and build a working version. Move between design and engineering until the pieces make sense together.</p><i>EXPLORE → DESIGN → BUILD</i></article>
          <article className="process-card reveal"><span>03 / DELIVER</span><strong>MAKE IT WORK IN CONTEXT.</strong><p>Test the details, connect the systems and learn from what happens in use. A useful product has to work beyond the presentation.</p><i>TEST → REFINE → LEARN</i></article>
        </div>
        <div className="process-foot"><span>AN ITERATIVE PRACTICE / NOT A LINEAR FORMULA</span><span>03 / 11</span></div>
      </section>

      <section className="recognition-section section-pad" id="recognition">
        <div className="section-index reveal"><Eyebrow>04 — RECOGNITION / PEOPLE / PLATFORMS</Eyebrow><span>SELECTED RECORD / 2026</span></div>
        <div className="recognition-heading"><h2>NOT JUST<br/><em>THE WORK.</em></h2><p>Some milestones happen outside the code editor. They come from showing up, representing an idea, working with people and taking responsibility.</p></div>
        <div className="recognition-grid">
          <article className="recognition-feature reveal"><span>01 / NATIONAL DIALOGUE</span><strong>VIKSIT<br/>BHARAT.</strong><p>Selected for the Chhattisgarh state contingent at the Viksit Bharat Young Leaders Dialogue 2026; presented the JanSeva One civic-tech concept in New Delhi.</p><b>REPRESENTATION / PRESENTATION</b><i>VB</i></article>
          <article className="recognition-card reveal"><span>02 / STUDENT LEADERSHIP</span><strong>SQAC</strong><p>Core App Development member and App Development Lead at the Software Quality Assurance Club, SRMIST.</p><b>APP DEVELOPMENT / TEAM LEADERSHIP</b></article>
          <article className="recognition-card reveal"><span>03 / EVENT OPERATIONS</span><strong>MINEVERSE</strong><p>Organising Committee Lead for the SQAC coding contest, contributing to the planning and execution of a student-led technical event.</p><b>COMMUNITY / EXECUTION</b></article>
        </div>
        <div className="recognition-foot"><span>SELECTED EXPERIENCES — NOT AN AWARDS COUNT.</span><span>DETAILS SUBJECT TO FINAL EVIDENCE REVIEW</span></div>
      </section>

      <section className="up-next-section section-pad" id="up-next">
        <div className="section-index reveal"><Eyebrow>05 — UP NEXT / IN THE MAKING</Eyebrow><span>OPEN FILES / NOT FINISHED STORIES</span></div>
        <div className="up-next-heading"><h2>THE NEXT<br/><em>CHAPTERS.</em></h2><p>Some ideas are still on the workbench. These are the directions I'm actively exploring—not finished launches or promises dressed up as products.</p></div>
        <div className="up-next-feature reveal">
          <div className="up-next-feature-mark"><span>IN PROGRESS / 001</span><strong>BUSHO</strong><i>↗</i></div>
          <div className="up-next-feature-copy"><span>HEALTHCARE WORKFLOWS / DATA IN CONTEXT</span><h3>FROM ENTRY<br/>TO <em>ACTION.</em></h3><p>Complete and validate the health-worker-to-supervisor reporting loop, strengthen the Supabase-backed data model and test the experience against realistic operational workflows.</p><b>NEXT FOCUS / END-TO-END WORKFLOW</b></div>
        </div>
        <div className="up-next-list">
          <article className="up-next-item reveal"><span>002 / ELECTROLAB</span><div><h3>MAKE THE INVISIBLE VISIBLE.</h3><p>Continue expanding the electronics workbench: more device models, useful experiments and clearer engineering visualisations.</p></div><i>EXPERIMENT</i></article>
          <article className="up-next-item reveal"><span>003 / VARSITY</span><div><h3>MAKE CAMPUS INFORMATION FEEL CONNECTED.</h3><p>Move core student workflows toward a more complete, reliable and coherent campus companion.</p></div><i>PRODUCT BUILD</i></article>
        </div>
        <div className="up-next-foot"><span>STATUS IS A SNAPSHOT, NOT A FINISH LINE.</span><span>AN OPEN NOTEBOOK / 2026</span></div>
      </section>

      <section className="field-note" id="field-notes">
        <div className="field-note-inner">
          <div className="field-note-label"><Eyebrow light>06 — OUTSIDE THE WORKSHOP</Eyebrow><span>FIELD NOTE / 001</span></div>
          <div className="field-note-layout">
            <div className="field-note-date">2026<span>NEW DELHI</span></div>
            <div className="field-note-copy">
              <p className="field-note-overline">VIKSIT BHARAT YOUNG LEADERS DIALOGUE</p>
              <h2>INNOVATION<br />WITH <em>TRADITION.</em></h2>
              <p className="field-note-description">Selected to represent the Chhattisgarh state contingent at the Viksit Bharat Young Leaders Dialogue 2026. Presented <strong>JanSeva One</strong>—a civic-tech vision shaped around making local public systems more responsive to the people they serve.</p>
              <div className="field-note-tags"><span>CHHATTISGARH</span><span>CIVIC TECHNOLOGY</span><span>JANSEVA ONE</span></div>
            </div>
            <div className="field-note-seal" aria-hidden="true"><div className="orbit-ring"><span>IDEAS FOR INDIA · 2026 · </span></div><Asterisk size={100} /></div>
          </div>
          <div className="field-note-story">
            <div className="field-note-story-intro"><span>FROM A LOCAL QUESTION TO A NATIONAL ROOM</span><p>A short record of the three parts of this experience that continue to shape how I think about building.</p></div>
            <article><span>01 / THE ROOT</span><h3>START WITH THE GROUND.</h3><p>Representing Balod district and Chhattisgarh brought the importance of local context into focus: meaningful innovation has to begin with the people and places it is meant to serve.</p></article>
            <article><span>02 / THE ROOM</span><h3>LISTEN, EXCHANGE, REFRAME.</h3><p>The dialogue created space to share perspectives on the future of India and learn from young leaders working across different contexts.</p></article>
            <article><span>03 / THE IDEA</span><h3>MAKE PUBLIC SYSTEMS FEEL CLOSER.</h3><p>JanSeva One was my civic-tech concept: a unified way to surface local issues and help communities follow the path from reporting to action.</p></article>
          </div>
          <div className="field-note-artifact">
            <div className="field-note-artifact-heading"><span>THE IDEA / JANSEVA ONE</span><span>CONCEPT MAP · 001</span></div>
            <svg viewBox="0 0 900 240" role="img" aria-label="Concept diagram showing local issue reporting moving through a civic response system">
              <path d="M170 110H360M540 110H730" stroke="#e7e0d2" strokeWidth="2" strokeDasharray="6 7" fill="none"/>
              <path d="m347 100 13 10-13 10M717 100l13 10-13 10" fill="none" stroke="#d7e27b" strokeWidth="2"/>
              <g fill="#e7e0d2" fillOpacity=".08" stroke="#e7e0d2" strokeOpacity=".55">
                <rect x="22" y="36" width="148" height="148" rx="4"/><rect x="376" y="36" width="148" height="148" rx="4"/><rect x="730" y="36" width="148" height="148" rx="4"/>
              </g>
              <g fill="#d7e27b" fontFamily="monospace" fontSize="12"><text x="42" y="65">01 / REPORT</text><text x="396" y="65">02 / ROUTE</text><text x="750" y="65">03 / RESPOND</text></g>
              <g stroke="#e7e0d2" fill="none" strokeWidth="2"><path d="M95 91v42m-20-20h40M449 92h42m-42 18h42m-42 18h28M803 92h42m-42 18h42m-42 18h28"/></g>
              <g fill="#e7e0d2" fontFamily="monospace" fontSize="10"><text x="42" y="160">COMMUNITY VOICE</text><text x="396" y="160">PUBLIC WORKFLOW</text><text x="750" y="160">VISIBLE FOLLOW-UP</text></g>
              <text x="450" y="222" textAnchor="middle" fill="#e7e0d2" fillOpacity=".6" fontFamily="monospace" fontSize="10">A PROPOSED CIVIC JOURNEY — NOT A DEPLOYED GOVERNMENT SERVICE</text>
            </svg>
          </div>
          <div className="impact-ledger">
            <div className="impact-ledger-head"><Eyebrow light>PEOPLE / PLATFORMS / POSSIBILITY</Eyebrow><span>IMPACT LEDGER · 002</span></div>
            <div className="impact-ledger-grid">
              <article className="impact-ledger-card"><i>01</i><span>VIKSIT BHARAT / 2026</span><strong>A NATIONAL CONVERSATION.</strong><p>Represented Chhattisgarh's state contingent in New Delhi and presented the JanSeva One civic-tech concept.</p></article>
              <article className="impact-ledger-card"><i>02</i><span>SQAC / SRMIST</span><strong>BUILDING WITH A TEAM.</strong><p>App Development Lead and core member, contributing to student-led software activity and Mineverse.</p></article>
              <article className="impact-ledger-card"><i>03</i><span>INDEPENDENT BUILDS</span><strong>FROM IDEA TO WORKFLOW.</strong><p>Taking projects beyond static screens into interfaces, integrations, backend workflows and real-data thinking.</p></article>
            </div>
          </div>
          <div className="field-note-bottom"><span>A MOMENT THAT REMINDED ME WHY BUILDING MATTERS.</span><span>03 / 08</span></div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="section-index reveal"><Eyebrow>07 — THE PERSON BEHIND THE PROJECTS</Eyebrow><span>A LITTLE CONTEXT</span></div>
        <div className="about-layout">
          <div className="about-heading section-title">
            <h2><span className="title-mask"><span>MORE</span></span><span className="title-mask"><span>THAN</span></span><span className="title-mask"><span>THE <em>CODE.</em></span></span></h2>
            <div className="about-note"><Asterisk size={28} /><span>STILL FIGURING<br />THINGS OUT.</span></div>
          </div>
          <div className="about-copy reveal">
            <p className="about-lede">I'm Kirtan—an Electronics & Communication Engineering student at SRMIST, a builder who learned to begin again and kept choosing to make things.</p>
            <p>The JEE phase did not go to plan. For a while, it felt like the story had narrowed to one result. It hadn't. SRM became a reset: a new environment, new people and the space to find a direction of my own.</p>
            <p>That direction took me from small HTML pages to interactive applications, API integrations, backend workflows and systems that work with data. Along the way came Viksit Bharat, responsibility as SQAC's App Development Lead, and projects such as BUSHO that make me think about the people and processes behind a screen.</p>
            <p>I keep building because I love the work itself: understanding a problem, making a first version, finding what breaks and improving it. I don't want to stop learning—or stop looking for problems where technology can make something genuinely more useful.</p>
            <div className="about-signoff"><span>IN PROGRESS, BY DESIGN.</span><span>— K.S.</span></div>
          </div>div>
        </div>
        <div className="about-north-star reveal">
          <span>THE THING THAT KEEPS ME BUILDING</span>
          <p>I love the moment a difficult problem starts becoming <em>something useful.</em></p>
          <small>CODE IS THE TOOL. PROGRESS IS THE FEELING. IMPACT IS THE POINT.</small>
        </div>
        <div className="about-facts reveal">
          <div><span>01 / CURRENT CHAPTER</span><strong>ECE UNDERGRADUATE</strong><small>SRMIST</small></div>
          <div><span>02 / NATURAL HABIT</span><strong>LEARN BY BUILDING</strong><small>PROTOTYPE · TEST · REFINE</small></div>
          <div><span>03 / BIG INTEREST</span><strong>TECH WITH PURPOSE</strong><small>PRODUCT · PEOPLE · IMPACT</small></div>
        </div>
        <div className="about-turning-point reveal">
          <div className="turning-point-label"><Eyebrow>THE PART THAT CHANGED ME</Eyebrow><span>NOT A STRAIGHT LINE / FIELD NOTE 002</span></div>
          <blockquote>“That chapter didn't go to plan. It still wasn't the end of the story.”</blockquote>
          <div className="turning-point-copy"><p>The JEE setback became a reset, not a definition. SRM became the next chapter; Viksit Bharat, SQAC and BUSHO became places to test what I could do with the opportunity in front of me.</p><span>KEEP MOVING. KEEP MAKING.</span></div>
        </div>
        <div className="build-evolution reveal">
          <div className="build-evolution-head"><Eyebrow>THE BUILDING CURVE</Eyebrow><span>FROM FIRST TAG TO REAL WORKFLOW</span></div>
          <div className="build-evolution-track">
            <article><span>01 / THE FIRST PAGE</span><strong>HTML & SMALL WEBSITES</strong><p>Learning how a page is structured and how an idea becomes something visible.</p><i>START SMALL</i></article>
            <article><span>02 / MAKING IT INTERACTIVE</span><strong>INTERFACES & APPLICATIONS</strong><p>Moving into components, app flows and experiences people can actually use.</p><i>MAKE IT WORK</i></article>
            <article><span>03 / CONNECTING SYSTEMS</span><strong>APIs & BACKENDS</strong><p>Going beyond the screen: connecting services, handling data and designing complete workflows.</p><i>MAKE IT CONNECT</i></article>
            <article><span>04 / BUILDING FOR REAL CONTEXT</span><strong>REAL DATA & PEOPLE</strong><p>Thinking about reliability, roles, hand-offs and whether a system helps solve the original problem.</p><i>MAKE IT MATTER</i></article>
          </div>
          <p className="build-evolution-note">Not a claim that the learning is finished. A record of how far curiosity has carried me—and a reason to keep going.</p>
        </div>
        <div className="about-intersection reveal">
          <div className="about-intersection-head"><Eyebrow>THE INTERSECTION</Eyebrow><span>FOUR LENSES / ONE PRACTICE</span></div>
          <div className="intersection-map" role="img" aria-label="Four connected interests: engineering, product thinking, visual design and public impact">
            <svg className="intersection-lines" viewBox="0 0 800 390" preserveAspectRatio="none" aria-hidden="true">
              <path d="M400 195 170 78M400 195 630 78M400 195 170 312M400 195 630 312" />
              <circle cx="400" cy="195" r="112" />
              <circle cx="400" cy="195" r="146" />
            </svg>
            <article className="intersection-node node-engineering"><span>01 / UNDERSTAND</span><strong>ENGINEERING</strong><small>Circuits · code · systems</small></article>
            <article className="intersection-node node-product"><span>02 / SHAPE</span><strong>PRODUCT THINKING</strong><small>Problems · flows · usefulness</small></article>
            <div className="intersection-core"><span>THE COMMON THREAD</span><strong>CURIOUS<br/>BUILDER<span>.</span></strong><small>QUESTION → MAKE → LEARN</small></div>
            <article className="intersection-node node-design"><span>03 / COMMUNICATE</span><strong>VISUAL DESIGN</strong><small>Interfaces · interaction · story</small></article>
            <article className="intersection-node node-impact"><span>04 / CONTRIBUTE</span><strong>PUBLIC IMPACT</strong><small>People · access · everyday systems</small></article>
          </div>
          <p className="intersection-caption">I don't see these as separate interests. The most interesting work, for me, happens when they meet.</p>
        </div>
        <div className="about-method reveal">
          <div className="about-method-heading"><Eyebrow>THE WAY I LIKE TO WORK</Eyebrow><span>AN OPEN OPERATING MANUAL / 001</span></div>
          <div className="about-method-grid">
            <article><span>01</span><h3>NOTICE THE FRICTION.</h3><p>Look beyond the obvious request. Understand the people, constraints and small moments that make a problem worth solving.</p><i>OBSERVE / QUESTION</i></article>
            <article><span>02</span><h3>MAKE AN IDEA TANGIBLE.</h3><p>Move from a rough sketch to a prototype, interface, simulation or working flow that someone can actually react to.</p><i>DESIGN / BUILD</i></article>
            <article><span>03</span><h3>LEARN IN THE OPEN.</h3><p>Test assumptions, listen to feedback and improve the thing. Progress matters more when it can be examined and shared.</p><i>TEST / REFINE</i></article>
          </div>
        </div>
      </section>

      <section className="journey-section section-pad" id="journey">
        <div className="section-index reveal"><Eyebrow>08 — THE LEARNING CURVE</Eyebrow><span>EDUCATION / COMMUNITY / PRACTICE</span></div>
        <div className="section-heading section-title">
          <h2><span className="title-mask"><span>IN THE</span></span><span className="title-mask"><span>MAKING<span className="blue-period">.</span></span></span></h2>
          <p>A timeline, not a finish line.<br />More chapters are being written.</p>
        </div>
        <div className="journey-list">
          <article className="journey-item reveal">
            <span className="journey-count">01</span><span className="journey-date">PRESENT</span>
            <div><h3>Electronics & Communication Engineering</h3><p>SRM Institute of Science and Technology · Chennai</p><small>Exploring electronics, computing, software and the systems that connect them.</small></div>
            <span className="journey-mark"><Cpu /></span>
          </article>
          <article className="journey-item reveal">
            <span className="journey-count">02</span><span className="journey-date">2026</span>
            <div><h3>Viksit Bharat Young Leaders Dialogue</h3><p>State contingent representative · New Delhi</p><small>Presented the JanSeva One civic-tech idea under “Innovation with Tradition: Building a Modern Bharat”.</small></div>
            <span className="journey-mark"><Compass /></span>
          </article>
          <article className="journey-item reveal">
            <span className="journey-count">03</span><span className="journey-date">CAMPUS</span>
            <div><h3>Software Quality Assurance Club</h3><p>Core App Development · App Development Lead</p><small>Contributing to student-led software work and helping coordinate the Mineverse coding event.</small></div>
            <span className="journey-mark"><Layers3 /></span>
          </article>
          <article className="journey-item reveal">
            <span className="journey-count">04</span><span className="journey-date">ONGOING</span>
            <div><h3>BUSHO — healthcare workflow project</h3><p>Independent product build · Healthcare reporting</p><small>Exploring a structured reporting journey between frontline health workers and supervisors, with a focus on data, accountability and operational clarity.</small></div>
            <span className="journey-mark"><CircleDot /></span>
          </article>
          <article className="journey-item reveal">
            <span className="journey-count">05</span><span className="journey-date">CAMPUS</span>
            <div><h3>Varsity — student campus app</h3><p>App development · Student product initiative</p><small>Building a campus companion around attendance, academic resources, schedules and previous-year questions.</small></div>
            <span className="journey-mark"><Layers3 /></span>
          </article>
          <article className="journey-item reveal">
            <span className="journey-count">06</span><span className="journey-date">ONGOING</span>
            <div><h3>Research, experiments & independent builds</h3><p>AI / ML · Electronics · Product development</p><small>Learning through practical projects, technical exploration and collaboration.</small></div>
            <span className="journey-mark"><Sparkles /></span>
          </article>
        </div>
      </section>

      <section className="learning-section section-pad" id="learning">
        <div className="section-index reveal"><Eyebrow>09 — THE READING ROOM</Eyebrow><span>COURSES / SIMULATIONS / CONTINUOUS LEARNING</span></div>
        <div className="learning-intro reveal"><div><h2>ALWAYS<br /><em>LEARNING.</em></h2></div><p>Not every useful lesson comes with a certificate. This is a growing record of courses, simulations and learning paths. Credential links will be added when each record is verified.</p></div>
        <div className="learning-archive-bar">
          <div className="learning-filters" role="group" aria-label="Filter learning records">
            {learningCategories.map(category => <button key={category} type="button" className={activeLearningCategory === category ? 'selected' : ''} onClick={() => setActiveLearningCategory(category)} aria-pressed={activeLearningCategory === category}>{category}<span>{category === 'ALL ENTRIES' ? String(learning.length).padStart(2, '0') : String(learning.filter(item => item.category === category).length).padStart(2, '0')}</span></button>)}
          </div>
          <span className="learning-archive-count" aria-live="polite">SHOWING {String(visibleLearning.length).padStart(2, '0')} / {String(learning.length).padStart(2, '0')}</span>
        </div>
        <div className="learning-grid" aria-live="polite">
          {visibleLearning.map((item, index) => <article className="learning-card reveal" key={item.name}>
            <div className="learning-card-top"><span>0{learning.indexOf(item) + 1} / LEARNING LOG</span><span className="learning-record-type">{item.record}</span></div>
            <p>{item.kind}</p><h3>{item.name}</h3><h4>{item.detail}</h4><span className="learning-status">{item.status}</span>
            <span className="learning-card-index" aria-hidden="true">{String(learning.indexOf(item) + 1).padStart(2, '0')}</span>
          </article>)}
        </div>
        <p className="learning-disclaimer">STATUS IS LABELLED AS COURSE OR SIMULATION COMPLETION—NOT AS A PROFESSIONAL CERTIFICATION UNLESS A VERIFIED CREDENTIAL IS LINKED.</p>
        <div className="learning-next-step"><span>THE ARCHIVE IS STILL OPEN</span><p>More learning records will be added as titles, completion details and credential evidence are checked. No badge is worth more than being accurate about what it represents.</p><span>VERIFY FIRST / PUBLISH SECOND</span></div>
      </section>

      <section className="skills-section" id="skills">
        <div className="skills-inner section-pad">
          <div className="section-index reveal"><Eyebrow light>10 — THINGS I WORK WITH</Eyebrow><span>TOOLS ARE MEANS, NOT THE POINT.</span></div>
          <div className="skills-heading"><h2>THE<br /><em>TOOLBOX.</em></h2><p>My toolkit keeps changing.<br />The curiosity doesn't.</p></div>
          <div className="skills-groups">
            {skills.map(group => <div className="skill-group reveal" key={group.group}><span>{group.group}</span><div>{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}
          </div>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="section-index reveal"><Eyebrow>11 — THE NEXT PAGE IS OPEN</Eyebrow><span>LET'S MAKE SOMETHING USEFUL</span></div>
        <div className="contact-main">
          <div className="contact-copy"><p>HAVE A QUESTION, AN IDEA<br />OR A GOOD PROBLEM?</p><h2>LET'S<br /><em>MAKE IT.</em></h2><span className="contact-footnote">GOOD CONVERSATIONS CAN START ANYWHERE.</span></div>
          <div className="contact-action">
            <span className="contact-stamp" aria-label="Open to thoughtful collaborations"><span className="contact-stamp-orbit">CURIOUS MINDS · GOOD PROBLEMS · USEFUL WORK ·</span><Send size={27} /><span>OPEN<br />CHANNEL</span></span>
            <p className="contact-invitation">Have a problem worth solving, a product worth shaping or an idea that needs a first version? I'd love to hear about it.</p>
            <a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer" className="contact-link">START WITH GITHUB <ArrowUpRight /></a>
            <p className="contact-small-note">For collaborations, project conversations and interesting ideas.</p>
          </div>
        </div>
        <footer className="footer">
          <a className="footer-brand" href="#top"><span className="brand-monogram">KS<span>®</span></span><span>THE PERSONAL EDITION<br />CHENNAI, INDIA</span></a>
          <div className="footer-links"><a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer"><Code2 size={16} /> GITHUB <ExternalLink size={12} /></a><a href="#work">SELECTED WORK <ArrowUpRight size={12} /></a><a href="#top">BACK TO TOP <ArrowUp size={12} /></a></div>
          <span className="footer-copy">© 2026 KIRTAN SWAMY<br />PRINTED ON THE INTERNET.</span>
        </footer>
      </section>

      {activeProject && <div className="project-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setActiveProject(null) }}>
        <section className={`project-dialog project-${activeProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
          <div className="project-dialog-top"><span>THE PROJECT FILE / {activeProject.id}</span><button type="button" onClick={() => setActiveProject(null)} aria-label="Close project note"><X size={20} /></button></div>
          <div className="project-dialog-body">
            <div className="project-dialog-art"><span>{activeProject.id} / SYSTEM SKETCH</span><strong>{activeProject.name}</strong><small>{activeProject.note}</small><ProjectVisual project={activeProject} /></div>
            <div className="project-dialog-copy"><Eyebrow>{activeProject.category} · {activeProject.year}</Eyebrow><h2 id="project-dialog-title">{activeProject.name}<span>.</span></h2><p className="project-dialog-type">{activeProject.type}</p><p className="project-dialog-description">{activeProject.description}</p>
              <div className="project-dialog-meta"><div><span>CONTRIBUTION</span><strong>{activeProject.contribution}</strong></div><div><span>STAGE</span><strong>{activeProject.stage}</strong></div><div><span>FOCUS AREAS</span><strong>{activeProject.tags.join(' · ')}</strong></div><div><span>FILED</span><strong>{activeProject.year} / {activeProject.category}</strong></div></div>
              <div className="project-manifesto"><span>THE CENTRAL IDEA</span><strong>“{activeProject.note}”</strong><small>PROJECT FILE / {activeProject.id} — {activeProject.stage}</small></div>
              <div className="project-case-grid">
                <article><span>01 / THE QUESTION</span><p>{activeProject.problem}</p></article>
                <article><span>02 / THE APPROACH</span><p>{activeProject.approach}</p></article>
                <article><span>03 / WHERE IT STANDS</span><p>{activeProject.current}</p></article>
                <article><span>04 / NEXT ITERATION</span><p>{activeProject.next}</p></article>
              </div>
              <div className="project-process-strip" aria-label="Project development sequence"><span>QUESTION</span><i>→</i><span>DESIGN</span><i>→</i><span>BUILD</span><i>→</i><span>LEARN</span></div>
              <div className="project-dialog-actions">{activeProject.href && <a href={activeProject.href} target="_blank" rel="noreferrer">OPEN PROJECT / PUBLIC PAGE <ArrowUpRight size={15} /></a>}{activeProject.repo && <a href={activeProject.repo} target="_blank" rel="noreferrer">VIEW SOURCE <Code2 size={15} /></a>}</div>
            </div>
          </div>
          <div className="project-dialog-foot"><span>AN OPEN FILE — THE WORK CONTINUES</span><span>ESC TO CLOSE ↗</span></div>
        </section>
      </div>}
    </main>
  )
}

export default App
