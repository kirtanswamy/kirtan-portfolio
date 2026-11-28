import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import PaperShader from './components/PaperShader.jsx'
import './styles/notebook-portrait.css'
import './styles/journey-art-direction.css'
import './styles/workshop-evidence.css'
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk,
  ArrowUp, ExternalLink, Code2, Menu, MoveUpRight, X,
  CircleDot, Sparkles, BookOpen, Cpu, Layers3, Compass, Send, Tv,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01', name: 'BUSHO', category: 'PUBLIC SYSTEMS', type: 'Health-tech · Operations',
    description: 'A frontline healthcare operations platform exploring how health workers and supervisors can move information through a clearer, more accountable workflow.',
    stage: 'IN DEVELOPMENT', year: '2026', tone: 'blue',
    href: 'https://busho.de5.net/', repo: 'https://github.com/kirtanswamy/BUSHO',
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
    href: '', repo: 'https://github.com/aalindmukati/Varsity',
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
    href: '', repo: 'https://github.com/kirtanswamy/ElectroLab',
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
    description: 'An ideation-stage civic-tech concept for a citizen-first transparency and action platform, initially focused on local roads and infrastructure.',
    stage: 'IDEATION ONLY', year: '2026', tone: 'red',
    href: '', repo: '',
    tags: ['Civic technology', 'Geo-tagged reporting', 'Public accountability'],
    note: 'A road complaint should not disappear into a file.',
    contribution: 'ORIGINAL IDEA · CONCEPT DEVELOPMENT',
    problem: 'Residents can notice damaged roads and local infrastructure issues, but often lack a clear way to submit a traceable report and follow its resolution.',
    approach: 'JanSeva One (UCAP) was imagined as a citizen-first civic transparency and action platform. The proposed road / PMGSY pilot would let citizens submit geo-tagged photos or video of potholes, flooding and surface damage, then connect the report to public-works information such as the responsible department, contractor, project timelines and milestones. The proposed journey included jurisdiction routing, status updates, evidence of repair and a public repair-history trail. Assisted reporting through CSCs, Panchayat offices and youth volunteers was also considered. Later concept extensions included drainage, sanitation, PHCs, schools and wider village infrastructure.',
    current: 'Ideation only. JanSeva One was never implemented: no working application, deployed prototype, backend, pilot or operational government integration exists. The concept was explored as a proposed MVP for one Gram Panchayat in Chhattisgarh, using simulated data for any demonstration.',
    next: 'The concept would need stakeholder research, jurisdiction and escalation mapping, a citizen journey prototype and local validation before any implementation could be considered.',
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
  ['01', 'FRONT PAGE', '#main-content'],
  ['02', 'WORK', '#work'],
  ['03', 'MILESTONES', '#recognition'],
  ['04', 'ABOUT', '#about'],
  ['05', 'JOURNEY', '#journey'],
  ['06', 'ARCHIVE', '#learning'],
  ['07', 'WORKSHOP', '#skills'],
  ['08', 'CONTACT', '#contact'],
]

const learning = [
  { name: 'Goldman Sachs', detail: 'Operations Job Simulation · Forage', kind: 'BUSINESS / OPERATIONS', category: 'BUSINESS', record: 'JOB SIMULATION', issuer: 'Goldman Sachs × Forage', issued: 'SEP 2026', credentialId: '6ab75fbc5bf1182d2089ad30', status: 'COMPLETED · JOB SIMULATION', verified: true },
  { name: 'Google Ads Display Certification', detail: 'Google Skillshop', kind: 'DIGITAL ADVERTISING', category: 'DIGITAL', record: 'CERTIFICATION', issuer: 'Google', issued: 'SEP 2026', expires: 'SEP 2027', credentialId: '194450319', status: 'ISSUED · VALID THROUGH SEP 2027', verified: true },
  { name: 'Google Analytics Individual Qualification', detail: 'Analytics measurement and reporting', kind: 'ANALYTICS', category: 'DIGITAL', record: 'CERTIFICATION', issuer: 'Google', issued: 'SEP 2026', expires: 'SEP 2027', credentialId: '195122117', status: 'ISSUED · VALID THROUGH SEP 2027', verified: true },
  { name: 'What Is Generative AI?', detail: 'Generative AI foundations', kind: 'GENERATIVE AI', category: 'TECH', record: 'CERTIFICATE', issuer: 'LinkedIn', issued: 'SEP 2026', credentialId: '4d01191ac9552badb42fecd0c086901a89a0e1b71aae0a0ca9d4cf6c5525799', status: 'ISSUED · LINKEDIN LEARNING', verified: true },
  { name: 'Viksit Bharat Young Leaders Dialogue 2026', detail: 'Participant · Ministry of Youth Affairs & Sports', kind: 'NATIONAL YOUTH LEADERSHIP', category: 'NATIONAL', record: 'PARTICIPANT CREDENTIAL', issuer: 'Ministry of Youth Affairs & Sports, Government of India', issued: 'JAN 2026', status: 'PARTICIPATION RECORDED · CREDENTIAL LISTED ON LINKEDIN', verified: true },
  { name: 'Qualcomm AI Upskilling', detail: 'Technical foundations in AI', kind: 'AI / MACHINE LEARNING', category: 'TECH', record: 'COURSE RECORD', issuer: 'Qualcomm', issued: 'COMPLETED', status: 'COURSE COMPLETED · CERTIFICATE NOT ISSUED', verified: true },
]

const learningCategories = ['ALL ENTRIES', 'CREDENTIALS', 'TECH', 'BUSINESS', 'DIGITAL', 'NATIONAL']

const skills = [
  { group: 'FRONTEND & APPS', items: ['HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Expo', 'Flutter'] },
  { group: 'PROGRAMMING', items: ['Python', 'C / C++', 'Java', 'API integration', 'Responsive UI'] },
  { group: 'PRODUCT & SYSTEMS', items: ['UI / UX', 'Git & GitHub', 'Supabase', 'Vite', 'Electronics', 'AI / ML foundations'] },
]

const workshopToolDetails = {
  'HTML & CSS': { family: 'INTERFACE LAYER', variant: 'web', note: 'The structure and visual language behind readable, responsive screens.', context: 'Portfolio interface · Varsity product UI', link: 'INTERFACE', evidenceIds: ['02'] },
  'JavaScript': { family: 'INTERACTION ENGINE', variant: 'web', note: 'State, events and behaviour turn a static screen into a working experience.', context: 'Portfolio interactions · ElectroLab', link: 'BEHAVIOUR', evidenceIds: ['03'] },
  'TypeScript': { family: 'TYPED LOGIC', variant: 'code', note: 'Typed application logic helps keep calculations and interface contracts explicit.', context: 'ElectroLab simulator', link: 'CALCULATION ENGINE', evidenceIds: ['03'] },
  'React': { family: 'COMPONENT SYSTEM', variant: 'web', note: 'Reusable components organise interfaces into smaller, composable parts.', context: 'Portfolio · ElectroLab', link: 'COMPONENTS', evidenceIds: ['03'] },
  'React Native': { family: 'MOBILE INTERFACE', variant: 'mobile', note: 'A shared component approach for building native-feeling mobile experiences.', context: 'Varsity mobile app', link: 'MOBILE PRODUCT', evidenceIds: ['02'] },
  'Expo': { family: 'MOBILE TOOLCHAIN', variant: 'mobile', note: 'The development and runtime layer used for the Varsity mobile build.', context: 'Varsity mobile app', link: 'APP WORKFLOW', evidenceIds: ['02'] },
  'Flutter': { family: 'CROSS-PLATFORM UI', variant: 'mobile', note: 'A cross-platform interface toolkit in the broader app-development skill set.', context: 'Mobile development practice', link: 'APP TOOLKIT' },
  'Python': { family: 'GENERAL-PURPOSE LOGIC', variant: 'code', note: 'A flexible language for scripting, problem solving and technical exploration.', context: 'Programming practice', link: 'LOGIC' },
  'C / C++': { family: 'LOW-LEVEL FOUNDATIONS', variant: 'code', note: 'Programming fundamentals close to memory, data structures and machine behaviour.', context: 'ECE and programming coursework', link: 'FOUNDATIONS' },
  'Java': { family: 'OBJECT-ORIENTED LOGIC', variant: 'code', note: 'A language for practising structured, object-oriented program design.', context: 'Programming coursework', link: 'OOP' },
  'API integration': { family: 'SERVICE CONNECTION', variant: 'network', note: 'Connecting interface workflows to services and structured data contracts.', context: 'BUSHO workflow · application integrations', link: 'DATA FLOW', evidenceIds: ['01'] },
  'Responsive UI': { family: 'ADAPTIVE LAYOUT', variant: 'web', note: 'Layouts and controls adapt to different screen sizes and input modes.', context: 'Portfolio · Varsity interface', link: 'ADAPTIVE UI', evidenceIds: ['02'] },
  'UI / UX': { family: 'PRODUCT EXPERIENCE', variant: 'web', note: 'Information hierarchy, interaction design and usability shape the product flow.', context: 'Varsity · BUSHO · portfolio', link: 'USER FLOW', evidenceIds: ['01','02'] },
  'Git & GitHub': { family: 'VERSION CONTROL', variant: 'network', note: 'Branches and commits keep experiments reviewable and changes traceable.', context: 'Portfolio · BUSHO · ElectroLab', link: 'COLLABORATION', evidenceIds: ['01','02','03'] },
  'Supabase': { family: 'BACKEND SERVICES', variant: 'network', note: 'Database and authentication services form part of the BUSHO backend workflow.', context: 'BUSHO prototype', link: 'DATA SERVICES', evidenceIds: ['01'] },
  'Vite': { family: 'BUILD PIPELINE', variant: 'code', note: 'A fast development and build tool in the React application stack.', context: 'Portfolio · ElectroLab', link: 'DEVELOPMENT', evidenceIds: ['03'] },
  'Electronics': { family: 'HARDWARE PRINCIPLES', variant: 'circuit', note: 'Circuit behaviour, device models and engineering principles made explorable.', context: 'ElectroLab diode simulator', link: 'CIRCUIT MODEL', evidenceIds: ['03'] },
  'AI / ML foundations': { family: 'INTELLIGENT SYSTEMS', variant: 'network', note: 'Foundational learning alongside an early AI/ML research track.', context: 'Research and technical learning', link: 'RESEARCH TRACK' },
}

const workshopDiagramVariants = {
  web: { path: 'M18 48H92V104H145M92 104V178H178M178 178H224V124H280V54H342', nodes: [[18,48],[92,104],[280,54],[342,54]], labels: ['INPUT','STATE','RENDER','OUTPUT'] },
  code: { path: 'M18 58H82V58H132V126H178M178 126H238V126H290V198H342M82 58V202H18M238 126V48H320', nodes: [[18,58],[132,126],[290,198],[342,198]], labels: ['SOURCE','LOGIC','BUILD','RESULT'] },
  mobile: { path: 'M18 130H82V70H145M82 130V202H145M145 70H215V130H278V70H342M145 202H215V130', nodes: [[18,130],[145,70],[278,70],[342,70]], labels: ['SCREEN','STATE','DEVICE','USER'] },
  network: { path: 'M18 70H88V130H145M88 130V202H145M145 130H215V70H280V130H342M215 70V24H320', nodes: [[18,70],[145,130],[280,130],[342,130]], labels: ['CLIENT','SERVICE','DATA','RESPONSE'] },
  circuit: { path: 'M18 45H90V92H145M90 92V184H145M145 92H215V45H280V92H342M215 45V205H280V220H342', nodes: [[18,45],[145,92],[280,92],[342,92]], labels: ['BIAS','DEVICE','SWEEP','OUTPUT'] },
}

const navItems = [
  ['FRONT PAGE', '#main-content'],
  ['WORK', '#work'],
  ['MILESTONES', '#recognition'],
  ['ABOUT', '#about'],
  ['JOURNEY', '#journey'],
  ['ARCHIVE', '#learning'],
  ['WORKSHOP', '#skills'],
  ['CONTACT', '#contact'],
]

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>
}

function ProjectVisual({ project }) {
  if (project.id === '01') return (
    <svg className="project-visual project-visual-busho" viewBox="0 0 520 230" role="img" aria-label="Conceptual BUSHO frontline reporting and supervisor review workflow diagram">
      <defs>
        <linearGradient id="busho-flow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d6df83"/><stop offset="1" stopColor="#7fa5d8"/></linearGradient>
        <filter id="busho-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g fill="none" stroke="currentColor" strokeOpacity=".18"><path d="M20 30H500M20 76H500M20 122H500M20 168H500M20 214H500" strokeDasharray="2 7"/><path d="M100 15V215M260 15V215M420 15V215" strokeDasharray="2 7"/></g>
      <path d="M94 114H190Q208 114 208 96V70Q208 52 226 52H292Q310 52 310 70V160Q310 178 328 178H424" fill="none" stroke="url(#busho-flow)" strokeWidth="4" strokeLinecap="round" filter="url(#busho-glow)"/>
      <path d="M94 114H190Q208 114 208 96V70Q208 52 226 52H292Q310 52 310 70V160Q310 178 328 178H424" fill="none" stroke="#d6df83" strokeWidth="1" strokeDasharray="4 8"/>
      <g fill="#273247" stroke="#d6df83" strokeWidth="2"><rect x="28" y="83" width="132" height="62" rx="4"/><rect x="194" y="20" width="132" height="64" rx="4"/><rect x="360" y="148" width="132" height="62" rx="4"/></g>
      <g fill="#e9e3d5" fontFamily="monospace" fontSize="9" letterSpacing="1"><text x="42" y="101">01 / FIELD</text><text x="42" y="121" fontSize="12">REPORT</text><text x="208" y="39">02 / REVIEW</text><text x="208" y="59" fontSize="12">VERIFY</text><text x="374" y="166">03 / ACTION</text><text x="374" y="186" fontSize="12">COORDINATE</text></g>
      <g fill="#d6df83"><circle cx="94" cy="114" r="5"/><circle cx="260" cy="52" r="5"/><circle cx="426" cy="178" r="5"/></g>
      <g fill="#8fa6c9" fontFamily="monospace" fontSize="8"><text x="28" y="225">ASSISTIVE WORKFLOW / SYNTHETIC CONCEPT</text><text x="416" y="18">BUSHO / 01</text></g>
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
        <span className="project-number">{project.id} / {String(projects.length).padStart(2, '0')}</span>
        <span className="project-stage"><span />{project.stage}</span>
      </div>
      <button
        type="button"
        className="project-art project-art-button"
        onClick={() => onOpen(project)}
        aria-label={`Open the ${project.name} project book`}
        onPointerMove={event => {
          if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
          const bounds = event.currentTarget.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width
          const y = (event.clientY - bounds.top) / bounds.height
          event.currentTarget.style.setProperty('--book-rotate-y', `${(x - 0.5) * 9}deg`)
          event.currentTarget.style.setProperty('--book-rotate-x', `${(0.5 - y) * 7}deg`)
          event.currentTarget.style.setProperty('--book-light-x', `${x * 100}%`)
          event.currentTarget.style.setProperty('--book-light-y', `${y * 100}%`)
        }}
        onPointerLeave={event => {
          event.currentTarget.style.setProperty('--book-rotate-y', '0deg')
          event.currentTarget.style.setProperty('--book-rotate-x', '0deg')
          event.currentTarget.style.setProperty('--book-light-x', '50%')
          event.currentTarget.style.setProperty('--book-light-y', '45%')
        }}
      >
        <div className="project-art-grid" aria-hidden="true" />
        <span className="project-art-index">{project.id} / FIELD FILE</span>
        <span className="project-cover-kicker">{project.category} · {project.year}</span>
        <span className="project-art-name">{project.name}</span>
        <span className="project-art-note">{project.note}</span>
        <span className="project-cover-edition" aria-hidden="true">THE MAKER'S NOTEBOOK <i>— VOL. 01</i></span>
        <span className="project-art-arrow"><ArrowUpRight size={24} /></span>
        {index === 0 && <div className="art-orbit" aria-hidden="true"><i /><i /><i /></div>}
        {index === 1 && <div className="art-stack" aria-hidden="true"><i /><i /><i /></div>}
        {index === 2 && <div className="art-circuit" aria-hidden="true"><i /><i /><i /><i /><i /></div>}
        {index === 3 && <div className="art-sun" aria-hidden="true"><Asterisk size={150} strokeWidth={0.7} /></div>}
        {index === 4 && <div className="art-television" aria-hidden="true"><Tv size={142} strokeWidth={1.1} /><span>AFTER SCHOOL / 04:15</span></div>}
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

const vinylTracks = [
  { title: 'ENGINEERING', subtitle: 'Circuits · code · systems', detail: 'I like understanding how things work beneath the surface—from diode behaviour to the systems that connect an application.', file: 'ELECTROLAB' },
  { title: 'PRODUCT THINKING', subtitle: 'Problems · flows · usefulness', detail: 'Start with the people and context. Shape the workflow before polishing the interface.', file: 'BUSHO / VARSITY' },
  { title: 'VISUAL DESIGN', subtitle: 'Interfaces · interaction · story', detail: 'Make complex ideas feel clear, tactile and enjoyable to explore.', file: 'THE MAKER’S NOTEBOOK' },
  { title: 'PUBLIC IMPACT', subtitle: 'People · access · everyday systems', detail: 'Explore where thoughtful technology can make everyday systems more understandable and useful.', file: 'JANSEVA ONE · CONCEPT' },
]
function VinylPlayer() {
  const [playing, setPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState(0)
  const track = vinylTracks[activeTrack]
  return (
    <div className="vinyl-experience">
      <div className="vinyl-copy">
        <span className="vinyl-kicker">SIDE A / THE THINGS THAT MOVE ME</span>
        <h3>FOUR INTERESTS.<br/><em>ONE RECORD.</em></h3>
        <p aria-live="polite">{track.detail}</p>
        <span className="vinyl-file">CONNECTED FILE / {track.file}</span>
        <div className="vinyl-track-list" role="group" aria-label="Choose a record track">
          {vinylTracks.map((item, index) => <button type="button" key={item.title} className={activeTrack === index ? 'is-active' : ''} onClick={() => setActiveTrack(index)} aria-pressed={activeTrack === index}><span>0{index + 1}</span><strong>{item.title}</strong><i>{item.subtitle}</i><b>↗</b></button>)}
        </div>
      </div>
      <div className={`turntable ${playing ? 'is-spinning' : ''}`} data-track={activeTrack}>
        <div className="turntable-topline"><span>KS / PERSONAL PRESSING</span><span>33⅓ RPM</span></div>
        <div className="turntable-platter"><div className="vinyl-record"><div className="vinyl-grooves" /><div className="vinyl-label"><span>KS</span><i>THE MAKER’S NOTEBOOK</i><b>0{activeTrack + 1}</b></div><span className="vinyl-spindle" /></div></div>
        <svg className="turntable-tonearm" viewBox="0 0 320 360" aria-hidden="true" focusable="false">
          <g className="tonearm-moving">
            <circle className="tonearm-base" cx="285" cy="38" r="29" />
            <circle className="tonearm-pivot" cx="285" cy="38" r="16" />
            <circle className="tonearm-pin" cx="285" cy="38" r="4" />
            <path className="tonearm-shadow" d="M285 52 C282 112 248 158 218 190 S165 238 145 250" />
            <path className="tonearm-shaft" d="M285 52 C282 112 248 158 218 190 S157 244 125 260" />
            <path className="tonearm-highlight" d="M282 55 C279 112 245 158 215 190 S162 238 142 247" />
            <g className="tonearm-cartridge" transform="translate(145 250) rotate(35)">
              <rect x="-19" y="-8" width="39" height="17" rx="3" />
              <path d="M-9 9 L-3 19 L4 9" />
              <circle cx="11" cy="0" r="2" />
            </g>
            <path className="tonearm-stylus" d="M142 262 L140 271" />
          </g>
        </svg>
        <div className="turntable-controls">
          <span className="turntable-status"><i />{playing ? 'RECORD IN MOTION' : 'RECORD AT REST'}</span>
          <div className="turntable-actions">
            <button type="button" className="vinyl-skip" aria-label="Previous track" onClick={() => setActiveTrack(index => (index + vinylTracks.length - 1) % vinylTracks.length)}>↶</button>
            <button type="button" className="vinyl-power" onClick={() => setPlaying(value => !value)} aria-pressed={playing} aria-label={playing ? 'Pause record' : 'Spin record'}><span>{playing ? 'Ⅱ' : '▶'}</span></button>
            <button type="button" className="vinyl-skip" aria-label="Next track" onClick={() => setActiveTrack(index => (index + 1) % vinylTracks.length)}>↷</button>
          </div>
        </div>
        <div className="turntable-foot"><span>FIELD RECORDING / NO. 001</span><span>MADE TO BE EXPLORED</span></div>
      </div>
    </div>
  )
}

const usefulStages = [
  { key: '01', title: 'UNDERSTAND', verb: 'Find the real problem.', detail: 'Start with the people, constraints and small frustrations behind a complicated system. The best interface begins before the first screen.', example: 'BUSHO · frontline reporting and review workflows', accent: '#e6c98d' },
  { key: '02', title: 'MAKE', verb: 'Give the idea a shape.', detail: 'Turn a question into something tangible: a prototype, an interface, a simulation or a workflow that someone can actually explore.', example: 'VARSITY · a connected campus experience', accent: '#c7d77d' },
  { key: '03', title: 'TEST', verb: 'See what breaks.', detail: 'Try the model against real constraints. Follow the edge cases, question assumptions and make the behaviour understandable.', example: 'ELECTROLAB · interactive diode modelling', accent: '#8fb8e8' },
  { key: '04', title: 'REFINE', verb: 'Make it more useful.', detail: 'Keep what works, remove what gets in the way and improve the hand-off between people, tools and systems.', example: 'JANSEVA ONE · civic action coordination concept', accent: '#d99a80' },
]

const journeyMilestones = [
  { id:'01', year:'CURRENT', type:'FOUNDATIONS', title:'SRMIST / ECE', place:'CHENNAI · INDIA', summary:'The place where engineering became a way to explore how things work.', detail:'Studying Electronics & Communication Engineering at SRMIST, building foundations across electronics, computing and the systems that connect them.', artifact:'FIELD NOTE / CAMPUS', mark:'ECE', color:'#d6df83' },
  { id:'02', year:'JANUARY 2026', type:'REPRESENTATION', title:'VIKSIT BHARAT YOUNG LEADERS DIALOGUE', place:'NEW DELHI · INDIA', summary:'A state-contingent experience that brought local ideas into a national conversation.', detail:'Represented the Chhattisgarh state contingent and Balod district at the Viksit Bharat Young Leaders Dialogue 2026, presenting the idea of innovation with tradition.', artifact:'FIELD NOTE / VBYLD 2026', mark:'भारत', color:'#d99a80' },
  { id:'03', year:'ONGOING', type:'LEADERSHIP', title:'SQAC / APP DEVELOPMENT', place:'SRMIST · CHENNAI', summary:'Taking responsibility for the app development domain in a student-led technical community.', detail:'App Development Lead at SRMIST’s Software Quality Assurance Club, contributing to student-led technical work and the club’s application initiatives.', artifact:'FIELD NOTE / SQAC', mark:'SQAC', color:'#8fb8e8' },
  { id:'04', year:'IN PROGRESS', type:'MAKING', title:'BUILDING USEFUL THINGS', place:'INDEPENDENT BUILDS', summary:'Turning questions into products, prototypes and experiments.', detail:'Developing BUSHO, Varsity and ElectroLab while exploring civic technology, product design and research. Each project is a work in progress, not a finished claim.', artifact:'FIELD NOTE / BUILDER’S LOG', mark:'MAKE', color:'#d6df83' },
]

function JourneyScrapbook() {
  const [active, setActive] = useState(0)
  const cards = [
    {year:'2023 — PRESENT',label:'01 / FOUNDATIONS',title:<>SRMIST <em>/ ECE</em></>,place:'CHENNAI · INDIA',copy:'Current engineering studies, exploring electronics, computing and the systems that connect them.',kind:'campus',stamp:'FIELD NOTE / 001',mark:'ECE',note:'A foundation in systems thinking.'},
    {year:'JANUARY 2026',label:'02 / REPRESENTATION',title:<>VIKSIT BHARAT<br/><em>YOUNG LEADERS DIALOGUE</em></>,place:'CHHATTISGARH · BALOD',copy:'Selected for the Chhattisgarh state contingent; represented Balod district in New Delhi.',kind:'delhi',stamp:'NEW DELHI / 2026',mark:'भारत',note:'Innovation with tradition.'},
    {year:'ONGOING',label:'03 / LEADERSHIP',title:<>SQAC <em>/ APP DEVELOPMENT</em></>,place:'STUDENT CLUB · SRMIST',copy:'App Development Lead at the Software Quality Assurance Club, contributing to student-led technical work.',kind:'sqac',stamp:'CLUB NOTE / 003',mark:'SQAC',note:'Building with a team.'},
    {year:'IN PROGRESS',label:'04 / MAKING',title:<>BUILDING <em>USEFUL THINGS</em></>,place:'INDEPENDENT BUILDS · ONGOING',copy:'Developing BUSHO, Varsity and ElectroLab while exploring research and product design.',kind:'busho',stamp:'BUILDER’S LOG / 004',mark:'MAKE',note:'Questions become prototypes.'},
  ]
  const item=cards[active]
  return <div className="journey-scrapbook-experience">
    <div className="journey-scrapbook-topline"><span>THE MAKER’S NOTEBOOK / LOOSE LEAF 05</span><span>PINNED MEMORIES · STILL IN PROGRESS</span></div>
    <div className="journey-scrapbook-spread">
      <div className="journey-spiral" aria-hidden="true">{Array.from({length:13},(_,i)=><i key={i}/>)}</div>
      <svg className="journey-scrapbook-route" viewBox="0 0 1000 130" preserveAspectRatio="none" aria-hidden="true"><path d="M30 85C150 5 230 10 330 74S490 122 590 62 760 10 970 72"/></svg>
      <div className="journey-postcards">
        {cards.map((card,index)=><button type="button" key={card.label} className={`journey-postcard journey-postcard-${card.kind} ${active===index?'is-active':''}`} onClick={()=>setActive(index)} onPointerMove={event=>{if(event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();event.currentTarget.style.setProperty('--tilt-x',`${((event.clientY-r.top)/r.height-.5)*-5}deg`);event.currentTarget.style.setProperty('--tilt-y',`${((event.clientX-r.left)/r.width-.5)*6}deg`);event.currentTarget.style.setProperty('--lift-x',`${((event.clientX-r.left)/r.width-.5)*-5}px`);event.currentTarget.style.setProperty('--lift-y',`${((event.clientY-r.top)/r.height-.5)*-5}px`)}} onPointerLeave={event=>{event.currentTarget.style.setProperty('--tilt-x','0deg');event.currentTarget.style.setProperty('--tilt-y','0deg');event.currentTarget.style.setProperty('--lift-x','0px');event.currentTarget.style.setProperty('--lift-y','0px')}} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();setActive((index+1)%cards.length)}else if(event.key==='ArrowLeft'){event.preventDefault();setActive((index+cards.length-1)%cards.length)}}} aria-label={`Open milestone: ${card.label.replace(/^\\d+ \/ /,'')}`} aria-pressed={active===index} style={{'--postcard-index':index}}>
          <span className="journey-postcard-clip" aria-hidden="true"><i/></span>
          <span className="journey-postcard-stamp">{card.stamp}</span>
          <span className="journey-postcard-art"><b>{card.mark}</b><small>{card.year}</small><i>{card.kind==='campus'?'CAMPUS SKETCH':card.kind==='delhi'?'FIELD / NEW DELHI':card.kind==='sqac'?'STUDENT CLUB':'BUILDER’S DESK'}</i></span>
          <span className="journey-postcard-index">{card.label}</span>
          <strong>{card.title}</strong>
          <span className="journey-postcard-place">{card.place}</span>
          <span className="journey-postcard-open">{active===index?'ON THE DESK':'PICK UP NOTE ↗'}</span>
        </button>)}
      </div>
      <div className="journey-pencil" aria-hidden="true"><span/><i/><b/></div>
      <div className="journey-sticky-note"><span>NOTE TO SELF</span><strong>{item.note}</strong><i>✳</i></div>
    </div>
    <article className="journey-postcard-detail" aria-live="polite" key={item.label}>
      <div className="journey-detail-paperclip" aria-hidden="true"><i/></div>
      <div className="journey-detail-index"><span>OPEN NOTE / {String(active+1).padStart(2,'0')}</span><strong>{item.mark}</strong><small>{item.year}</small></div>
      <div className="journey-detail-copy"><span>{item.label}</span><h3>{item.title}</h3><p>{item.copy}</p><small>{item.place}</small></div>
      <div className="journey-detail-nav"><span>TURN THE PAGE</span><div><button type="button" onClick={()=>setActive(v=>(v+3)%4)} aria-label="Previous milestone">←</button><button type="button" onClick={()=>setActive(v=>(v+1)%4)} aria-label="Next milestone">→</button></div></div>
    </article>
    <div className="journey-scrapbook-footer"><span>NOT A STRAIGHT LINE. A SERIES OF USEFUL TURNS.</span><span>PIN {String(active+1).padStart(2,'0')} / 04</span></div>
  </div>
}

function JourneyRoute() {
  const [active, setActive] = useState(0)
  const item = journeyMilestones[active]
  return (
    <div className="journey-route-experience">
      <div className="journey-route-topline"><span>PERSONAL FIELD ATLAS / 001</span><span>FOUR CHAPTERS · STILL IN MOTION</span></div>
      <div className="journey-route-map">
        <svg viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="journey-route-gradient" x1="0" x2="1"><stop offset="0" stopColor="#d6df83"/><stop offset=".5" stopColor="#8fb8e8"/><stop offset="1" stopColor="#d99a80"/></linearGradient></defs>
          <path className="journey-route-shadow" d="M80 180C180 35 300 45 390 165S565 292 650 160 820 25 920 150"/>
          <path className="journey-route-line" d="M80 180C180 35 300 45 390 165S565 292 650 160 820 25 920 150"/>
          {journeyMilestones.map((point,index)=><g key={point.id} className={active===index?'route-point is-active':'route-point'} transform={['translate(80 180)','translate(390 165)','translate(650 160)','translate(920 150)'][index]}><circle className="route-point-halo" r="30"/><circle className="route-point-dot" r="9"/><text y="-24" textAnchor="middle">{point.id}</text></g>)}
        </svg>
        <div className="journey-map-compass" aria-hidden="true"><span>N</span><i>✳</i><small>FIELD / 04</small></div>
        <div className="journey-map-coordinates"><span>17° / 78°</span><span>THE ROUTE IS NOT LINEAR</span></div>
      </div>
      <div className="journey-route-selector" role="group" aria-label="Explore journey milestones">
        {journeyMilestones.map((point,index)=><button type="button" key={point.id} className={active===index?'is-active':''} onClick={()=>setActive(index)} aria-pressed={active===index} style={{'--journey-accent':point.color}}>
          <span className="journey-selector-number">{point.id}</span><span className="journey-selector-type">{point.type}</span><b>{point.title}</b><small>{point.year}</small><i>{active===index?'CURRENT VIEW':'OPEN FIELD NOTE ↗'}</i>
        </button>)}
      </div>
      <article className="journey-route-detail" aria-live="polite" key={item.id} style={{'--journey-accent':item.color}}>
        <div className="journey-detail-art"><span>{item.artifact}</span><strong>{item.mark}</strong><i>{item.id} / 04</i><small>{item.place}</small></div>
        <div className="journey-detail-copy"><span>CHAPTER {item.id} / {item.type}</span><small>{item.year}</small><h3>{item.title}</h3><p className="journey-detail-summary">{item.summary}</p><p>{item.detail}</p><div className="journey-detail-footer"><span>MAKER’S NOTEBOOK / IN PROGRESS</span><div><button type="button" onClick={()=>setActive(index=>(index+3)%4)} aria-label="Previous milestone">←</button><button type="button" onClick={()=>setActive(index=>(index+1)%4)} aria-label="Next milestone">→</button></div></div></div>
      </article>
      <div className="journey-route-colophon"><span>NOT A STRAIGHT LINE. A SERIES OF USEFUL TURNS.</span><span>05 / 08 · {item.id} OF 04</span></div>
    </div>
  )
}

function UsefulThingsEngine() {
  const [activeStage, setActiveStage] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const stage = usefulStages[activeStage]
  const handlePointerMove = event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -9, y: ((event.clientX - rect.left) / rect.width - .5) * 11 })
  }
  const resetTilt = () => setTilt({ x: 0, y: 0 })
  return (
    <div className="useful-engine" onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
      <div className="useful-engine-topline"><span>THE USEFULNESS ENGINE / 001</span><span>SELECT A STAGE TO RECONFIGURE</span></div>
      <div className="useful-engine-stage">
        <div className="useful-engine-orbit useful-orbit-one" aria-hidden="true"/>
        <div className="useful-engine-orbit useful-orbit-two" aria-hidden="true"/>
        <div className="useful-engine-orbit useful-orbit-three" aria-hidden="true"/>
        <svg className="useful-engine-wiring" viewBox="0 0 760 420" preserveAspectRatio="none" aria-hidden="true">
          <path d="M120 210H260L330 115H430L500 210H640M260 210L330 305H430L500 210M330 115V305M430 115V305" />
          <path d="M120 210H260L330 115H430L500 210H640" className="useful-wire-active"/>
          <circle cx="120" cy="210" r="5"/><circle cx="260" cy="210" r="5"/><circle cx="330" cy="115" r="5"/><circle cx="430" cy="115" r="5"/><circle cx="500" cy="210" r="5"/><circle cx="640" cy="210" r="5"/>
        </svg>
        <div className="useful-engine-core" style={{ '--core-x': `${tilt.y}deg`, '--core-y': `${tilt.x}deg`, '--stage-accent': stage.accent }}>
          <div className="useful-core-shadow"/>
          <div className="useful-core-prism">
            <span className="prism-face prism-face-front">USEFUL<br/><i>BY DESIGN</i></span>
            <span className="prism-face prism-face-side">KS / 04</span>
            <span className="prism-face prism-face-top">QUESTION → ACTION</span>
          </div>
          <span className="useful-core-index">0{activeStage + 1}</span>
          <span className="useful-core-cross">✳</span>
        </div>
        {usefulStages.map((item, index) => (
          <button type="button" key={item.key} className={`useful-stage-node useful-node-${index + 1} ${activeStage === index ? 'is-active' : ''}`} style={{ '--node-accent': item.accent }} onClick={() => setActiveStage(index)} aria-pressed={activeStage === index}>
            <span>{item.key}</span><b>{item.title}</b><i>{activeStage === index ? 'ACTIVE' : 'INSPECT'}</i>
          </button>
        ))}
        <div className="useful-engine-caption"><span>FIG. 04 / ITERATION MODEL</span><span>INPUT → UNDERSTANDING → OUTCOME</span></div>
      </div>
      <div className="useful-engine-readout" aria-live="polite">
        <div className="useful-readout-index">0{activeStage + 1}<span>/ 04</span></div>
        <div className="useful-readout-copy"><span>NOW EXPLORING / {stage.title}</span><h3>{stage.verb}</h3><p>{stage.detail}</p><small>CONNECTED WORK / {stage.example}</small></div>
        <div className="useful-readout-controls" role="group" aria-label="Explore the four stages">
          <button type="button" onClick={() => setActiveStage(index => (index + usefulStages.length - 1) % usefulStages.length)} aria-label="Previous stage">←</button>
          <button type="button" onClick={() => setActiveStage(index => (index + 1) % usefulStages.length)} aria-label="Next stage">→</button>
        </div>
      </div>
      <div className="useful-engine-foot"><span>NOT A LINEAR PROCESS</span><span>REPEAT UNTIL IT HELPS SOMEONE</span></div>
    </div>
  )
}

function App() {
  const [openingActive, setOpeningActive] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL WORK')
  const [activeSection, setActiveSection] = useState('')
  const [activeProject, setActiveProject] = useState(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeLearningCategory, setActiveLearningCategory] = useState('ALL ENTRIES')
  const [sectionTransition, setSectionTransition] = useState(null)
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archivePage, setArchivePage] = useState(0)
  const [archiveTurnDirection, setArchiveTurnDirection] = useState('next')
  const archiveSwipeStartRef = useRef(null)
  const archiveDragRef = useRef(null)
  const [activeSkillDrawer, setActiveSkillDrawer] = useState(0)
  const [activeWorkshopTool, setActiveWorkshopTool] = useState('')
  const selectedWorkshopDetail = workshopToolDetails[activeWorkshopTool] || { family: 'SYSTEM OVERVIEW', variant: 'circuit', note: 'Choose any filed tool. The bench will reconfigure to show its place in the system.', context: 'Select a drawer to inspect its tools', link: 'TOOL → SYSTEM' }
  const selectedWorkshopDiagram = workshopDiagramVariants[selectedWorkshopDetail.variant] || workshopDiagramVariants.circuit
  const sectionTransitionAction = useRef(null)
  const sectionTransitionLock = useRef(false)
  const projectShelfRef = useRef(null)
  const lenisRef = useRef(null)
  const shelfDragRef = useRef({ pointerId: null, startX: 0, scrollLeft: 0, dragged: false })

  const runPaperTransition = useCallback((onReveal) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onReveal?.()
      return
    }

    // The torn sheet first covers the old page. Only when it reaches the
    // bottom do we swap content; it then lifts away to reveal the new page.
    if (sectionTransitionLock.current) return
    sectionTransitionLock.current = true
    sectionTransitionAction.current = onReveal
    setSectionTransition('covering')
  }, [])

  const handlePaperTransitionEnd = event => {
    if (event.target !== event.currentTarget) return

    if (sectionTransition === 'covering') {
      sectionTransitionAction.current?.()
      sectionTransitionAction.current = null
      setSectionTransition('revealing')
      return
    }

    if (sectionTransition === 'revealing') {
      setSectionTransition(null)
      sectionTransitionLock.current = false
    }
  }

  const finishOpening = useCallback(() => {
    runPaperTransition(() => {
      setOpeningActive(false)
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
  }, [runPaperTransition])

  useEffect(() => {
    if (!openingActive) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setOpeningActive(false)
      document.getElementById('main-content')?.focus({ preventScroll: true })
      return undefined
    }
    const exitTimer = window.setTimeout(finishOpening, 7600)
    return () => window.clearTimeout(exitTimer)
  }, [openingActive, finishOpening])
  useEffect(() => {
    if (!openingActive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const overlay = document.querySelector('.newspaper-opening')
    if (!overlay) return undefined
    let frame = 0
    let pointerX = 50
    let pointerY = 45
    const paint = () => {
      overlay.style.setProperty('--pointer-x', `${pointerX}%`)
      overlay.style.setProperty('--pointer-y', `${pointerY}%`)
      overlay.style.setProperty('--book-tilt-x', `${tiltX}deg`)
      overlay.style.setProperty('--book-tilt-y', `${tiltY}deg`)
      frame = 0
    }
    let tiltX = 0
    let tiltY = 0
    const onPointerMove = event => {
      pointerX = Math.max(0, Math.min(100, event.clientX / window.innerWidth * 100))
      pointerY = Math.max(0, Math.min(100, event.clientY / window.innerHeight * 100))
      tiltX = ((pointerX - 50) / 50) * 2.8
      tiltY = ((45 - pointerY) / 55) * 2.1
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    const onPointerLeave = () => {
      pointerX = 50
      pointerY = 45
      tiltX = 0
      tiltY = 0
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    overlay.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      overlay.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [openingActive])

  useEffect(() => {
    if (!openingActive) return undefined
    const overlay = document.querySelector('.newspaper-opening')
    const focusable = overlay ? [...overlay.querySelectorAll('button:not([disabled]), a[href]')] : []
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        first?.click()
        return
      }
      if (event.key !== 'Tab' || !first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openingActive])

  const visibleLearning = useMemo(
    () => activeLearningCategory === 'ALL ENTRIES'
      ? learning
      : activeLearningCategory === 'CREDENTIALS'
        ? learning.filter(item => ['CERTIFICATION', 'CERTIFICATE', 'PARTICIPANT CREDENTIAL'].includes(item.record))
        : learning.filter(item => item.category === activeLearningCategory),
    [activeLearningCategory],
  )

  const archivePageCount = Math.max(1, Math.ceil(visibleLearning.length / 2))
  const currentLearningPage = visibleLearning.slice(archivePage * 2, archivePage * 2 + 2)

  useEffect(() => {
    if (!activeProject) return undefined
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousOverscroll = document.documentElement.style.overscrollBehavior
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    lenisRef.current?.stop()
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.documentElement.style.overscrollBehavior = previousOverscroll
      lenisRef.current?.start()
    }
  }, [activeProject])

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
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(500, 33)

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
      yPercent: 4,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    })
    gsap.to('.hero-edition-mark', {
      y: 12,
      rotate: 11,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    })
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
      lenisRef.current = null
      animationContext.revert()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    document.documentElement.classList.toggle('index-open', menuOpen)
    if (menuOpen) lenisRef.current?.stop()
    else lenisRef.current?.start()
    if (!menuOpen) return () => { document.body.classList.remove('menu-open'); document.documentElement.classList.remove('index-open'); lenisRef.current?.start() }
    const overlay = document.getElementById('mobile-navigation')
    const focusable = overlay ? [...overlay.querySelectorAll('a[href], button:not([disabled])')] : []
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        document.querySelector('.index-overlay-top button')?.click()
        return
      }
      if (event.key !== 'Tab' || !first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('menu-open')
      document.documentElement.classList.remove('index-open')
      lenisRef.current?.start()
      const trigger = window.matchMedia('(max-width: 950px)').matches
        ? document.querySelector('.menu-button')
        : document.querySelector('.masthead-index-prompt')
      trigger?.focus()
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

  const openMenu = () => runPaperTransition(() => setMenuOpen(true))
  const closeMenu = () => runPaperTransition(() => setMenuOpen(false))

  const navigateToSection = (href, event) => {
    if (event) event.preventDefault()
    const target = document.querySelector(href)
    if (!target) return
    runPaperTransition(() => {
      setMenuOpen(false)
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }

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
      <svg className="paper-filter-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="paper-edge-displacement" x="-20%" y="-80%" width="140%" height="260%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="17" result="paper-grain" />
            <feDisplacementMap in="SourceGraphic" in2="paper-grain" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="burn-edge-displacement" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.019" numOctaves="3" seed="29" result="burn-grain" />
            <feDisplacementMap in="SourceGraphic" in2="burn-grain" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {openingActive && <div className="newspaper-opening" role="dialog" aria-modal="true" aria-label="The Maker's Notebook opening">
        <div className="opening-vignette" />
        <div className="opening-stage">
          <div className="opening-paper">
            
            <div className="opening-paper-under"><span>THE MAKER'S NOTEBOOK</span><strong>K.S.</strong><i>VOL. 01 / 2026</i></div>
            <div className="opening-leaf opening-leaf-left">
              <span className="opening-page-running"><b>THE MAKER'S NOTEBOOK</b><i>PERSONAL EDITION / 001</i></span>
              <div className="opening-page-main">
                <p className="opening-page-kicker">A NOTE ON THE MAKER</p>
                <strong id="opening-title">KIRTAN<br/><em>SWAMY.</em></strong>
                <p className="opening-page-intro">Electronics & Communication Engineering student at SRMIST, Chennai. I build at the intersection of <b>technology, thoughtful design and public-good ideas.</b></p>
                <div className="opening-page-rule" />
                <div className="opening-page-columns">
                  <div><small>01 / STUDY</small><b>ENGINEERING</b><span>Systems · Electronics · Software</span></div>
                  <div><small>02 / PRACTICE</small><b>MAKE & ITERATE</b><span>Prototypes · Interfaces · Experiments</span></div>
                </div>
              </div>
              <i className="opening-page-footer"><b>01</b><span>CURIOUS BY NATURE. PRECISE BY PRACTICE.</span><span>INDIA</span></i>
            </div>
            <div className="opening-leaf opening-leaf-right">
              <span className="opening-page-running"><b>FIELD NOTES / 001</b><i>WHAT I'M EXPLORING</i></span>
              <div className="opening-page-main opening-page-main-right">
                <p className="opening-page-kicker">IDEAS INTO WORK</p>
                <strong className="opening-page-manifesto">MAKE IT<br/><em>MATTER.</em></strong>
                <p className="opening-page-intro">From useful tools to playful digital experiences, I enjoy taking a question apart, finding its shape and building a thoughtful first version.</p>
                <div className="opening-page-projects">
                  <div><b>01</b><span><strong>BUSHO</strong><small>HEALTHCARE WORKFLOWS</small></span><i>↗</i></div>
                  <div><b>02</b><span><strong>VARSITY</strong><small>CAMPUS EXPERIENCE</small></span><i>↗</i></div>
                  <div><b>03</b><span><strong>ELECTROLAB</strong><small>ENGINEERING SIMULATION</small></span><i>↗</i></div>
                </div>
                <div className="opening-page-stamp"><Asterisk size={30}/><small>OBSERVE<br/>BUILD<br/>REFINE</small></div>
              </div>
              <i className="opening-page-footer"><b>02</b><span>ENGINEERING / DESIGN / IDEAS</span><span>VOL. 01</span></i>
            </div>
            <div className="opening-fold" />
            <div
              className="opening-cover"
              onAnimationEnd={event => {
                if (event.animationName === 'opening-cover-hinge') {
                  event.currentTarget.closest('.opening-paper')?.classList.add('is-open')
                }
              }}
            >
              <div className="opening-cover-back" aria-hidden="true"><span>THE MAKER'S NOTEBOOK</span><strong>KS<span>.</span></strong><i>FIELD EDITION / 001</i></div>
              <div className="cover-topline"><span>FIELD NOTES</span><span>NO. 001 / 2026</span></div>
              <div className="cover-art" aria-hidden="true">
                <span className="cover-orbit cover-orbit-one" />
                <span className="cover-orbit cover-orbit-two" />
                <span className="cover-orbit cover-orbit-three" />
                <span className="cover-spark">✳</span>
                <strong>KS<span>.</span></strong>
                <i>IDEAS IN MOTION</i>
              </div>
              <div className="cover-bottomline">
                <span>THE MAKER'S<br/>NOTEBOOK</span>
                <small>ENGINEERING<br/>DESIGN / IDEAS</small>
                <b>OPEN<br/>TO EXPLORE ↗</b>
              </div>
            </div>
          </div>
        </div>
        <div className="opening-caption"><span>AN OPEN NOTEBOOK</span><span>2026 / INDIA</span></div>
        <button type="button" className="opening-skip" onClick={finishOpening}>SKIP INTRO <ArrowUpRight size={13}/></button>
      </div>}
      <a className="skip-link" href="#main-content">SKIP TO CONTENT</a>
      <div className="reading-progress" aria-hidden="true"><span className="reading-progress__bar" /></div>
      <div className="paper-grain" aria-hidden="true" />
      <nav className="chapter-rail spiral-rail" aria-label="Notebook chapter navigator">
        <span className="spiral-rail-title">CHAPTERS</span>
        <span className="spiral-binding" aria-hidden="true">{chapterItems.map(([number]) => <i key={number} />)}</span>
        <div className="spiral-rail-links">
          {chapterItems.map(([number, label, href]) => <a key={href} href={href} onClick={event => navigateToSection(href, event)} className={activeSection === href ? 'active' : ''} aria-label={label} aria-current={activeSection === href ? 'location' : undefined}><span>{number}</span><small>{label}</small></a>)}
        </div>
        <span className="spiral-rail-foot">TURN / PAGE</span>
      </nav>
      {sectionTransition && (
        <div
          className={`section-burn-transition is-${sectionTransition}`}
          aria-hidden="true"
          onAnimationEnd={handlePaperTransitionEnd}
        >
          <PaperShader
            variant="index-edge"
            active
            className="section-transition-edge"
          />
        </div>
      )}
      <header className="masthead">
        <a className="masthead-brand" href="#top" aria-label="Kirtan Swamy home">
          <span className="brand-monogram">KS<span>®</span></span>
          <span className="brand-caption">THE PERSONAL<br />EDITION</span>
        </a>
        <div className="masthead-center"><span className="live-dot" /> INDEPENDENT MIND. COLLABORATIVE SPIRIT.</div>
        <div className="masthead-meta"><span>HYDERABAD, INDIA</span><span>VOL. 01 — 2026</span></div>
        <button type="button" className="menu-button" onClick={menuOpen ? closeMenu : openMenu} aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <button type="button" className="masthead-index-prompt" onClick={openMenu} aria-controls="mobile-navigation" aria-expanded={menuOpen}><span className="index-prompt-number">08</span><span className="index-prompt-copy"><small>THE NOTEBOOK</small><strong>OPEN INDEX</strong></span><i>↗</i></button>
      </header>

      <nav id="mobile-navigation" className={`mobile-nav index-overlay ${menuOpen ? 'is-open' : ''}`} aria-label="Global index" aria-hidden={!menuOpen} inert={!menuOpen}>
        <PaperShader variant="index-edge" active={menuOpen} />
        <div className="index-overlay-top"><span>THE MAKER'S NOTEBOOK / INDEX</span><span>VOL. 01 — 2026</span><button type="button" onClick={closeMenu} aria-label="Close index"><X size={19}/><span>CLOSE</span></button></div>
        <div className="index-overlay-title"><span>CONTENTS / 08 CHAPTERS</span><strong>INDEX<span>.</span></strong></div>
        <div className="index-overlay-links">
          {navItems.map(([label, href], index) => <a key={href} href={href} onClick={event => navigateToSection(href, event)} className={activeSection === href ? 'is-current' : ''}><span>0{index + 1}</span><strong>{label}</strong><ArrowUpRight /></a>)}
        </div>
        <div className="index-overlay-bottom"><span>AN OPEN NOTEBOOK · HYDERABAD, INDIA</span><span>TURN THE PAGE / FIND THE WORK</span></div>
      </nav>

      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
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
            <p>I'm an engineering student and a technologist at heart—turning <em>curiosity into prototypes</em>, and prototypes into <em>meaningful solutions.</em></p>
            <a href="#story" className="read-link">READ MY STORY <ArrowDownRight size={16} /></a>
          </div>
          <figure className="portrait-frame notebook-portrait" aria-label="Graphite notebook portrait of Kirtan Swamy">
            <div className="portrait-art notebook-portrait-art">
              <span className="notebook-tape" aria-hidden="true" />
              <span className="notebook-paper-back" aria-hidden="true" />
              <img
                className="notebook-sketch"
                src="/images/kirtan-notebook-portrait.webp"
                alt="A hand-drawn graphite pencil portrait of Kirtan Swamy on a worn, torn notebook page"
                fetchPriority="high"
                decoding="async"
                width="638"
                height="672"
              />
              <span className="notebook-pencil-note" aria-hidden="true">STUDY NO. 01</span>
              <span className="notebook-margin-mark" aria-hidden="true">IDEA → FORM</span>
            </div>
            <figcaption className="notebook-caption">
              <span>FIG. 01 — A WORK IN PROGRESS</span>
              <span>GRAPHITE / PAPER / 2026</span>
            </figcaption>
          </figure>
          <div className="hero-aside">
            <span className="aside-index">01 / 08</span>
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
            {categories.map(category => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}<span>{String(category === 'ALL WORK' ? projects.length : projects.filter(project => project.category === category).length).padStart(2, '0')}</span></button>)}
          </div>
          <span className="archive-index-caption">FILE INDEX / 001—005</span>
        </div>
        <div className="shelf-toolbar reveal">
          <span>DRAG / SCROLL TO EXPLORE THE ARCHIVE</span>
          <div className="shelf-controls">
            <span className="shelf-counter">{String(activeProjectIndex + 1).padStart(2, '0')} <i>/</i> {String(visibleProjects.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => moveProjectShelf(-1)} disabled={activeProjectIndex === 0} aria-label="Previous project"><ArrowLeft size={16} /></button>
            <button type="button" onClick={() => moveProjectShelf(1)} disabled={activeProjectIndex >= visibleProjects.length - 1} aria-label="Next project"><ArrowRight size={16} /></button>
          </div>
        </div>
        <div key={activeCategory} className="projects-grid projects-shelf" ref={projectShelfRef} role="region" aria-label="Horizontally browsable featured project archive" tabIndex={0} aria-live="polite"
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
            const captureTarget = event.target instanceof Element ? event.target.closest('.project-art-button') : null
            ;(captureTarget || event.currentTarget).setPointerCapture(event.pointerId)
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

      <section className="recognition-section section-pad" id="recognition">
        <div className="section-index reveal"><Eyebrow>03 — MILESTONES / PEOPLE / PLATFORMS</Eyebrow><span>SELECTED RECORD / 2026</span></div>
        <div className="recognition-heading"><h2>NOT JUST<br/><em>THE WORK.</em></h2><p>A few moments beyond the screen that shaped how I work.</p></div>
        <div className="recognition-grid">
          <article className="recognition-feature reveal"><span>01 / NATIONAL DIALOGUE</span><strong>VIKSIT<br/>BHARAT.</strong><p>Selected for the Chhattisgarh state contingent at the Viksit Bharat Young Leaders Dialogue 2026; represented Balod district in New Delhi.</p><b>STATE CONTINGENT / REPRESENTATION</b><i>VB</i></article>
          <article className="recognition-card reveal"><span>02 / STUDENT LEADERSHIP</span><strong>SQAC</strong><p>Core App Development member and App Development Lead at the Software Quality Assurance Club, SRMIST.</p><b>APP DEVELOPMENT / TEAM LEADERSHIP</b></article>
          <article className="recognition-card reveal"><span>03 / EVENT OPERATIONS</span><strong>MINEVERSE</strong><p>Organising Committee Lead for the SQAC coding contest, contributing to the planning and execution of a student-led technical event.</p><b>COMMUNITY / EXECUTION</b></article>
        </div>
        <div className="recognition-foot"><span>SELECTED EXPERIENCES — NOT AN AWARDS COUNT.</span><span>DETAILS SUBJECT TO FINAL EVIDENCE REVIEW</span></div>
      </section>

      <section className="up-next-section section-pad" id="up-next">
        <div className="section-index reveal"><Eyebrow>WORKSHOP / OPEN FILES</Eyebrow><span>OPEN FILES / NOT FINISHED STORIES</span></div>
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
          <div className="field-note-label"><Eyebrow light>03 — VIKSIT BHARAT / FIELD NOTE</Eyebrow><span>FIELD NOTE / 001</span></div>
          <div className="field-note-layout">
            <div className="field-note-date">2026<span>NEW DELHI</span></div>
            <div className="field-note-copy">
              <p className="field-note-overline">VIKSIT BHARAT YOUNG LEADERS DIALOGUE</p>
              <h2>A NATIONAL<br/><em>CONVERSATION.</em></h2>
              <p className="field-note-description">Selected to represent the Chhattisgarh state contingent at the Viksit Bharat Young Leaders Dialogue 2026. Represented Balod district in New Delhi, among young leaders from across the country.</p>
              <div className="field-note-tags"><span>CHHATTISGARH</span><span>BALOD</span><span>NEW DELHI</span></div>
            </div>
            <div className="field-note-seal" aria-hidden="true"><div className="orbit-ring"><span>VIKSIT BHARAT · 2026 · </span></div><Asterisk size={100} /></div>
          </div>
          <div className="field-note-story field-note-story-compact">
            <div className="field-note-story-intro"><span>FROM BALOD TO NEW DELHI</span><p>A meaningful opportunity to represent home, listen to different perspectives and take a wider view of India’s future.</p></div>
            <article><span>01 / REPRESENTING HOME</span><h3>LOCAL ROOTS. NATIONAL ROOM.</h3><p>Representing Balod district and Chhattisgarh made the experience personal: the places we come from shape the questions we bring.</p></article>
            <article><span>02 / THE DIALOGUE</span><h3>LISTEN, EXCHANGE, LEARN.</h3><p>The gathering created space to meet young leaders from different contexts and hear how they see the country’s opportunities and challenges.</p></article>
          </div>
          <div className="field-note-bottom"><span>A MOMENT OF REPRESENTATION, PERSPECTIVE & POSSIBILITY.</span><span>03 / 08</span></div>
        </div>
      </section>

      <section className="about-section section-pad" id="about">
        <div className="section-index reveal"><Eyebrow>04 — THE PERSON BEHIND THE PROJECTS</Eyebrow><span>A LITTLE CONTEXT</span></div>
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
          </div>
        </div>
        <div className="about-north-star reveal">
          <div className="about-north-star-copy"><span>THE REASON I KEEP MAKING / 04</span><p>Make difficult things feel <em>more useful.</em></p><small>QUESTION / BUILD / LEARN / REPEAT</small></div>
          <UsefulThingsEngine />
        </div>
        <div className="about-facts reveal">
          <div><span>01 / CURRENT CHAPTER</span><strong>ECE UNDERGRADUATE</strong><small>SRMIST</small></div>
          <div><span>02 / NATURAL HABIT</span><strong>LEARN BY BUILDING</strong><small>PROTOTYPE · TEST · REFINE</small></div>
          <div><span>03 / BIG INTEREST</span><strong>TECH WITH PURPOSE</strong><small>PRODUCT · PEOPLE · IMPACT</small></div>
        </div>
        <div className="about-intersection reveal">
          <div className="about-intersection-head"><Eyebrow>THE INTERSECTION</Eyebrow><span>FLIP THROUGH THE FOUR TRACKS</span></div>
          <VinylPlayer />
        </div>

      </section>

      <section className="journey-section section-pad" id="journey">
        <div className="section-index reveal"><Eyebrow>05 — THE JOURNEY</Eyebrow><span>EDUCATION / COMMUNITY / PRACTICE</span></div>
        <div className="journey-editorial-head">
          <div className="journey-editorial-title"><span className="journey-notebook-label">THE MAKER’S NOTEBOOK <i/></span><h2>IN THE<br/><em>MAKING.</em></h2></div>
          <div className="journey-map-art"><span className="journey-map-caption">THE JOURNEY <i/></span><svg viewBox="0 0 650 260" role="img" aria-label="Hand-drawn mountains, winding route and compass rose">
            <g fill="none" stroke="#766b5a" strokeOpacity=".42" strokeWidth="1"><path d="M18 174Q90 115 155 165T295 153T430 165T635 112M4 194Q90 136 160 184T300 174T438 184T655 130M15 214Q100 157 170 204T310 195T450 205T650 152M95 80 158 25 206 77 238 44 304 106 352 70 400 120m-285-41 43-54 34 47m25 9 21-37 42 62m31-5 41-31 45 48"/></g>
            <path d="M34 145C125 116 138 205 236 171S332 80 430 113s88 84 180-33" fill="none" stroke="#34342e" strokeWidth="2" strokeDasharray="7 9"/><path d="m596 58 19 19m0-19-19 19" stroke="#bd5b3c" strokeWidth="4"/>
            <g transform="translate(515 150)" fill="none" stroke="#645b4d" strokeWidth="2"><circle r="72"/><circle r="62" strokeDasharray="2 5"/><circle r="7"/><path d="M0-65 13-8 0 0-13-8Z" fill="#b8a98f"/><path d="M0 65-13 8 0 0 13 8Z" fill="#e4d8c4"/><path d="M-78 0h156M0-78v156" strokeWidth="1"/></g>
            <g fill="#645b4d" fontFamily="Georgia,serif" fontStyle="italic" fontSize="18"><text x="510" y="64">N</text><text x="600" y="154">E</text><text x="505" y="246">S</text><text x="423" y="154">W</text></g></svg><span className="journey-map-clip">✳</span></div>
          <p className="journey-editorial-deck">A few chapters so far.<br/>More are still being written.</p>
        </div>
        <JourneyScrapbook />

      </section>

      <section className="learning-section section-pad" id="learning">
        <div className="section-index reveal"><Eyebrow>06 — THE READING ROOM</Eyebrow><span>COURSES / SIMULATIONS / CONTINUOUS LEARNING</span></div>
        <div className="learning-intro reveal">
          <div><span className="learning-notebook-label">THE READING ROOM / INDEXED NOTES</span><h2>THE<br/><em>ARCHIVE.</em></h2></div>
          <div className="learning-intro-aside"><span className="learning-aside-mark">A–Z</span><p>A working record of courses, simulations and learning in progress. Filed by subject, with the status kept honest.</p><small>SIX RECORDS / CREDENTIALS & LEARNING</small></div>
        </div>
        {archiveOpen && (
        <div className="learning-archive-bar">
          <div className="learning-filters" role="group" aria-label="Filter learning records">
            {learningCategories.map(category => <button key={category} type="button" className={activeLearningCategory === category ? 'selected' : ''} onClick={() => { setActiveLearningCategory(category); setArchivePage(0) }} aria-pressed={activeLearningCategory === category}>{category}<span>{String(category === 'ALL ENTRIES' ? learning.length : category === 'CREDENTIALS' ? learning.filter(item => ['CERTIFICATION', 'CERTIFICATE', 'PARTICIPANT CREDENTIAL'].includes(item.record)).length : learning.filter(item => item.category === category).length).padStart(2, '0')}</span></button>)}
          </div>
          <span className="learning-archive-count" aria-live="polite">SHOWING {String(visibleLearning.length).padStart(2, '0')} / {String(learning.length).padStart(2, '0')}</span>
        </div>
        )}
        {!archiveOpen ? (
          <button type="button" className="archive-file-cover archive-catalog-cover" onClick={() => { setArchiveOpen(true); setArchivePage(0) }} aria-label="Open the reading room's certificate catalogue">
            <span className="catalog-cover-kicker">THE READING ROOM <i>—</i> VOL. 06 / 2026</span>
            <span className="catalog-cover-index">INDEX<br/><b>006</b></span>
            <span className="catalog-ledger-mark" aria-hidden="true"><i/><i/><i/></span>
            <strong>THE<br/><em>RECORDS.</em></strong>
            <span className="catalog-cover-subtitle">A PERSONAL INDEX OF LEARNING, PRACTICE & MILESTONES</span>
            <span className="catalog-cover-bottom"><span>06 ENTRIES <i/> 04 CREDENTIALS</span><span className="archive-file-action">ENTER READING ROOM <ArrowUpRight size={16}/></span></span>
            <span className="catalog-spine" aria-hidden="true">KIRTAN SWAMY <i>·</i> PERSONAL ARCHIVE <i>·</i> 2026</span>
          </button>
        ) : (
          <>
            <div className="archive-open-toolbar">
              <span>FILE 06 / LEARNING RECORDS / {String(archivePage + 1).padStart(2, '0')} OF {String(archivePageCount).padStart(2, '0')}</span>
              <a className="archive-source-link" href="https://www.linkedin.com/in/kirtanswamy" target="_blank" rel="noreferrer">SOURCE PROFILE <ArrowUpRight size={12}/></a>
              <button type="button" onClick={() => { setArchiveOpen(false); setArchivePage(0) }}>CLOSE FILE <X size={14}/></button>
            </div>
            <div
              className={`archive-page-turner turn-${archiveTurnDirection}`}
              key={`${activeLearningCategory}-${archivePage}-${archiveTurnDirection}`}
              role="group"
              aria-label="Certificate archive. Swipe horizontally or use the arrow keys to turn pages."
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'ArrowRight' && archivePage < archivePageCount - 1) { event.preventDefault(); setArchiveTurnDirection('next'); setArchivePage(page => Math.min(archivePageCount - 1, page + 1)) }
                if (event.key === 'ArrowLeft' && archivePage > 0) { event.preventDefault(); setArchiveTurnDirection('previous'); setArchivePage(page => Math.max(0, page - 1)) }
              }}
              onPointerDown={event => {
                if (event.target.closest('button, a')) return
                const rect = event.currentTarget.getBoundingClientRect()
                const localX = event.clientX - rect.left
                const fromRight = localX >= rect.width * 0.52
                const direction = fromRight ? 'next' : 'previous'
                if ((direction === 'next' && archivePage >= archivePageCount - 1) || (direction === 'previous' && archivePage <= 0)) return
                event.preventDefault()
                event.currentTarget.setPointerCapture?.(event.pointerId)
                archiveDragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, direction, width: rect.width }
                event.currentTarget.classList.add('is-dragging', `is-dragging-${direction}`)
                event.currentTarget.style.setProperty('--page-turn-progress', '0')
                event.currentTarget.style.setProperty('--page-turn-angle', '0deg')
              }}
              onPointerMove={event => {
                const drag = archiveDragRef.current
                if (!drag || drag.pointerId !== event.pointerId) return
                const dx = event.clientX - drag.startX
                const signed = drag.direction === 'next' ? -dx : dx
                const progress = Math.max(0, Math.min(1, signed / (drag.width * 0.42)))
                const angle = Math.min(154, progress * 154)
                event.currentTarget.style.setProperty('--page-turn-progress', progress.toFixed(3))
                event.currentTarget.style.setProperty('--page-turn-angle', `${drag.direction === 'next' ? -angle : angle}deg`)
                event.currentTarget.style.setProperty('--page-turn-x', `${Math.max(0, Math.min(100, (event.clientX - event.currentTarget.getBoundingClientRect().left) / drag.width * 100))}%`)
              }}
              onPointerUp={event => {
                const drag = archiveDragRef.current
                if (!drag || drag.pointerId !== event.pointerId) return
                const dx = event.clientX - drag.startX
                const signed = drag.direction === 'next' ? -dx : dx
                const progress = Math.max(0, signed / (drag.width * 0.42))
                archiveDragRef.current = null
                event.currentTarget.classList.remove('is-dragging', 'is-dragging-next', 'is-dragging-previous')
                event.currentTarget.style.setProperty('--page-turn-progress', '0')
                event.currentTarget.style.setProperty('--page-turn-angle', '0deg')
                if (progress > 0.24) {
                  setArchiveTurnDirection(drag.direction)
                  setArchivePage(page => drag.direction === 'next'
                    ? Math.min(archivePageCount - 1, page + 1)
                    : Math.max(0, page - 1))
                }
              }}
              onPointerCancel={event => {
                archiveDragRef.current = null
                event.currentTarget.classList.remove('is-dragging')
                event.currentTarget.style.setProperty('--page-turn-progress', '0')
                event.currentTarget.style.setProperty('--page-turn-angle', '0deg')
              }}
            >
              
              
              <div className="archive-page-spread">
                {currentLearningPage.map((item, pageIndex) => <article className={`learning-card reveal credential-${item.category.toLowerCase()} ${item.category === 'DIGITAL' ? 'issuer-google' : item.category === 'BUSINESS' ? 'issuer-goldman' : item.category === 'NATIONAL' ? 'issuer-vbyld' : item.issuer === 'LinkedIn' ? 'issuer-linkedin' : 'issuer-qualcomm'}`} key={item.name}>
                  <div className="learning-card-top"><span>DOCUMENT / {String(learning.indexOf(item) + 1).padStart(2, '0')} — KS</span><span className="learning-record-type">{item.record}</span></div>
                  <div className="learning-issuer-lockup"><span className="learning-issuer-monogram">{item.category === 'DIGITAL' ? 'G' : item.category === 'BUSINESS' ? 'GS' : item.category === 'NATIONAL' ? 'VB' : item.issuer === 'LinkedIn' ? 'in' : 'Q'}</span><span>{item.issuer}</span><i>SOURCE LISTED</i></div>
                  <div className="learning-document-heading">
                    {item.record === 'JOB SIMULATION' ? 'SIMULATION COMPLETION RECORD' : item.record === 'PARTICIPANT CREDENTIAL' ? 'PARTICIPATION RECORD' : item.record === 'COURSE RECORD' ? 'COURSE COMPLETION RECORD' : 'CERTIFICATE OF ACHIEVEMENT'}
                  </div>
                  <div className="learning-card-body">
                    <div className="learning-card-copy">
                      <p>{item.kind}</p><h3>{item.name}</h3><h4>{item.detail}</h4>
                      <dl className="learning-record-meta"><div><dt>ISSUED BY</dt><dd>{item.issuer}</dd></div><div><dt>ISSUED</dt><dd>{item.issued}</dd></div>{item.expires && <div><dt>VALID UNTIL</dt><dd>{item.expires}</dd></div>}</dl>
                    </div>
                    <span className="learning-card-index" aria-hidden="true">{String(learning.indexOf(item) + 1).padStart(2, '0')}</span>
                    <span className="learning-certificate-seal" aria-hidden="true"><b>KS</b><small>{item.record === 'JOB SIMULATION' ? 'SIMULATION' : item.record === 'PARTICIPANT CREDENTIAL' ? 'PARTICIPATION' : item.record === 'COURSE RECORD' ? 'COURSE' : 'CREDENTIAL'}</small></span>
                    <span className="learning-card-tab" aria-hidden="true">{item.category}</span>
                  </div>
                  <div className="learning-card-foot"><span className="learning-status">{item.status}</span><span className="learning-card-seal" aria-hidden="true"><b>KS</b><small>ARCHIVE</small></span><span className="learning-card-open" aria-hidden="true">↗</span></div>
                  {item.credentialId && <div className="learning-credential-id">CREDENTIAL ID <b>{item.credentialId}</b></div>}
                </article>)}
                {currentLearningPage.length === 1 && <div className="archive-empty-page"><span>END OF FILE</span><strong>MORE<br/>TO COME.</strong><small>NEW RECORDS WILL BE ADDED WHEN VERIFIED</small></div>}
              </div>
            </div>
            <div className="archive-page-controls">
              <button type="button" onClick={() => { setArchiveTurnDirection('previous'); setArchivePage(page => Math.max(0, page - 1)) }} disabled={archivePage === 0}><ArrowLeft size={15}/> PREVIOUS SPREAD</button>
              <span>SPREAD {String(archivePage + 1).padStart(2, '0')} <i>/</i> {String(archivePageCount).padStart(2, '0')} <small>DRAG OR USE PAGE CORNERS</small></span>
              <button type="button" onClick={() => { setArchiveTurnDirection('next'); setArchivePage(page => Math.min(archivePageCount - 1, page + 1)) }} disabled={archivePage >= archivePageCount - 1}>NEXT SPREAD <ArrowRight size={15}/></button>
            </div>
          </>
        )}
        <div className="learning-colophon"><span>COURSES ARE NOT CERTIFICATIONS. SIMULATIONS ARE NOT EMPLOYMENT.</span><span>VERIFY FIRST / PUBLISH SECOND</span></div>
      </section>

      <section className="skills-section" id="skills">
        <div className="skills-inner section-pad">
          <div className="section-index reveal"><Eyebrow light>07 — THE WORKSHOP</Eyebrow><span>TOOLS / METHODS / PRACTICE</span></div>
          <div className="skills-heading">
            <div className="skills-title-wrap"><span className="workshop-kicker">A FIELD GUIDE TO THE KIT</span><h2>THE<br /><em>TOOLBOX.</em></h2></div>
            <div className="workshop-intro"><span className="workshop-index-mark" aria-hidden="true">07</span><p>From circuits to interfaces. A changing set of tools for building, testing ideas and understanding systems.</p><small>{skills.reduce((total, group) => total + group.items.length, 0)} ENTRIES / 03 DRAWERS</small></div>
          </div>
          <div className="workshop-layout">
            <div className="skills-groups" aria-label="Skills and tools">
              {skills.map((group, groupIndex) => <section className={`skill-group reveal ${activeSkillDrawer === groupIndex ? 'is-open' : ''}`} key={group.group} aria-label={group.group}>
                <button type="button" className="skill-group-heading" aria-expanded={activeSkillDrawer === groupIndex} onClick={() => { const nextDrawer = activeSkillDrawer === groupIndex ? -1 : groupIndex; setActiveSkillDrawer(nextDrawer); setActiveWorkshopTool(nextDrawer < 0 ? '' : group.items[0]) }}>
                  <span>DRAWER / {String(groupIndex + 1).padStart(2, '0')}</span><h3>{group.group}</h3><small>{String(group.items.length).padStart(2, '0')} FILED</small><i aria-hidden="true">{activeSkillDrawer === groupIndex ? '−' : '+'}</i>
                </button>
                {activeSkillDrawer === groupIndex && <div className="skill-tool-list">{group.items.map((item, itemIndex) => <button type="button" className="workshop-tool" key={item} aria-pressed={activeWorkshopTool === item} onClick={() => setActiveWorkshopTool(item)}><i aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</i><b>{item}</b><span className="tool-cross" aria-hidden="true">↗</span></button>)}</div>}
              </section>)}
            </div>
            <aside className="workshop-side-note" aria-label="Workshop field note">
              <div className="workshop-side-top"><span>{activeWorkshopTool ? 'SELECTED TOOL / 007' : 'BENCH NOTE / 007'}</span><span>ECE × SOFTWARE</span></div>
              <svg className={`workshop-circuit workshop-circuit--${(workshopToolDetails[activeWorkshopTool]?.variant || 'circuit')}`} viewBox="0 0 360 260" role="img" aria-label={`Animated ${selectedWorkshopDetail.family.toLowerCase()} schematic for ${activeWorkshopTool || 'the workshop'}`}>
                <defs><linearGradient id="workshop-signal-gradient" x1="0" x2="1"><stop offset="0" stopColor="#d6df83" stopOpacity=".15"/><stop offset=".5" stopColor="#d6df83"/><stop offset="1" stopColor="#d6df83" stopOpacity=".15"/></linearGradient></defs>
                <g fill="none" stroke="currentColor" strokeWidth="1.25" opacity=".48">
                  <path d={selectedWorkshopDiagram.path}/>
                  <path d={selectedWorkshopDiagram.path} className="workshop-signal-line" stroke="url(#workshop-signal-gradient)" strokeWidth="2.6" strokeLinecap="round"/>
                  <rect x="145" y="92" width="70" height="53" rx="3" stroke="#d6df83" strokeWidth="1.8" fill="#d6df83" fillOpacity=".035"/>
                  <path d="M156 104h48m-48 10h48m-48 10h48m-48 10h48" stroke="#d6df83" opacity=".65"/>
                  {selectedWorkshopDiagram.nodes.map(([x,y],index)=><circle key={`${activeWorkshopTool}-node-${index}`} cx={x} cy={y} r="4.2" className="workshop-node" style={{animationDelay:`${index * -0.55}s`}}/>)}
                </g>
                <g fill="currentColor" fontFamily="monospace" fontSize="8" opacity=".78">
                  {selectedWorkshopDiagram.labels.map((label,index)=><text key={label} x={[18,145,280,310][index]} y={[32,82,42,142][index]}>{label}</text>)}
                  <text x="180" y="163" textAnchor="middle" fill="#d6df83" fontSize="7">{activeWorkshopTool ? activeWorkshopTool.toUpperCase() : 'SELECT A TOOL'}</text>
                  <text x="180" y="246" textAnchor="middle" fontSize="7" letterSpacing="1.4">SIGNAL PATH / {selectedWorkshopDetail.link}</text>
                </g>
              </svg>
              <div className="workshop-side-caption"><span>{activeWorkshopTool ? `ON THE BENCH / ${selectedWorkshopDetail.family}` : 'FIG. 07 / A SYSTEM IN PIECES'}</span><p>{activeWorkshopTool ? selectedWorkshopDetail.note : 'Choose any filed tool. The bench will reconfigure to show its place in the system.'}</p><div className="workshop-bench-readout"><span><small>CONTEXT</small><b>{activeWorkshopTool ? selectedWorkshopDetail.context : 'SELECT A DRAWER'}</b></span><span><small>PATH</small><b>{activeWorkshopTool ? selectedWorkshopDetail.link : 'TOOL → SYSTEM'}</b></span></div>{activeWorkshopTool && selectedWorkshopDetail.evidenceIds?.length > 0 && <div className="workshop-evidence"><span className="workshop-evidence-label">RELATED PROJECT FILES</span><div className="workshop-evidence-links">{selectedWorkshopDetail.evidenceIds.map(id => { const project = projects.find(item => item.id === id); return project ? <button type="button" key={id} onClick={() => setActiveProject(project)}><span>{project.id}</span>{project.name}<ArrowUpRight size={13}/></button> : null })}</div></div>}</div>
              <div className="workshop-side-foot"><span>KEEP EXPERIMENTING</span><span>END OF NOTE ↗</span></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="section-index reveal"><Eyebrow>08 — THE FINAL PAGE</Eyebrow><span>THE NOTEBOOK STAYS OPEN</span></div>
        <div className="contact-final contact-final-envelope">
          <div className="contact-final-heading">
            <span className="contact-final-kicker">A NOTE BEFORE YOU GO / 008</span>
            <h2>HAVE A<br />GOOD <em>IDEA?</em></h2>
            <p>Some of the best things begin with a question, a shared curiosity or a problem worth solving. If something here sparked a thought, I'd be glad to hear it.</p>
            <span className="contact-envelope-hint"><i aria-hidden="true" /> A LITTLE NOTE IS WAITING FOR YOU</span>
          </div>
          <div
            className={`contact-envelope-stage${envelopeOpen ? ' is-open' : ''}`}
            onPointerEnter={event => {
              if (event.pointerType !== 'mouse') return
              const stage = event.currentTarget
              stage.style.setProperty('--envelope-progress', '1')
              stage.style.setProperty('--flap-angle', '-168deg')
              stage.style.setProperty('--letter-layer', '6')
              stage.style.setProperty('--letter-top', '2%')
              stage.style.setProperty('--letter-height', '84%')
              setEnvelopeOpen(true)
            }}
            onPointerLeave={event => {
              if (event.pointerType !== 'mouse' || event.currentTarget.matches(':focus-within')) return
              const stage = event.currentTarget
              stage.style.setProperty('--envelope-progress', '0')
              stage.style.setProperty('--flap-angle', '0deg')
              stage.style.setProperty('--letter-layer', '3')
              stage.style.setProperty('--letter-top', '31%')
              stage.style.setProperty('--letter-height', '60%')
              setEnvelopeOpen(false)
            }}
            onFocus={event => {
              if (event.target.closest('.contact-envelope-choices') || event.target.closest('.contact-envelope-toggle')) {
                const stage = event.currentTarget
                stage.style.setProperty('--envelope-progress', '1')
                stage.style.setProperty('--flap-angle', '-168deg')
                stage.style.setProperty('--letter-layer', '6')
                stage.style.setProperty('--letter-top', '2%')
                stage.style.setProperty('--letter-height', '84%')
                setEnvelopeOpen(true)
              }
            }}
            onBlur={event => {
              if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
                const stage = event.currentTarget
                stage.style.setProperty('--envelope-progress', '0')
                stage.style.setProperty('--flap-angle', '0deg')
                stage.style.setProperty('--letter-layer', '3')
                stage.style.setProperty('--letter-top', '31%')
                stage.style.setProperty('--letter-height', '60%')
                setEnvelopeOpen(false)
              }
            }}
          >
            <div className="contact-envelope-orbit" aria-hidden="true" />
            <div className="contact-envelope-scene">
              <div className="contact-envelope-letter">
                <div className="contact-envelope-letter-top"><span>PERSONAL CORRESPONDENCE</span><span>KS / 2026</span></div>
                <div className="contact-envelope-letter-body">
                  <span className="contact-envelope-overline">THE NEXT CONVERSATION</span>
                  <h3>LET'S<br /><em>CONNECT.</em></h3>
                  <p>Choose your preferred way to say hello.</p>
                  <div className="contact-envelope-choices" aria-hidden={!envelopeOpen}>
                    <a href="https://www.linkedin.com/in/kirtanswamy" target="_blank" rel="noreferrer" aria-label="Connect with Kirtan on LinkedIn" tabIndex={envelopeOpen ? 0 : -1}>
                      <span className="contact-choice-icon" aria-hidden="true">in</span><span><small>01 / PROFESSIONAL</small><b>LinkedIn</b></span><ArrowUpRight />
                    </a>
                    <a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer" aria-label="Explore Kirtan's GitHub" tabIndex={envelopeOpen ? 0 : -1}>
                      <span className="contact-choice-icon contact-choice-github" aria-hidden="true">⌘</span><span><small>02 / OPEN WORK</small><b>GitHub</b></span><ArrowUpRight />
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kirtankswamy%40gmail.com&su=Hello%20Kirtan%20%E2%80%94%20Portfolio%20enquiry" target="_blank" rel="noreferrer" aria-label="Write an email to Kirtan using Gmail" tabIndex={envelopeOpen ? 0 : -1}>
                      <span className="contact-choice-icon contact-choice-mail" aria-hidden="true">✉</span><span><small>03 / A DIRECT NOTE</small><b>Gmail</b></span><ArrowUpRight />
                    </a>
                  </div>
                </div>
                <div className="contact-envelope-letter-foot"><span>NO FORMALITIES REQUIRED</span><span>JUST SAY HELLO ↗</span></div>
              </div>
              <div className="contact-envelope-back" aria-hidden="true" />
              <div className="contact-envelope-pocket" aria-hidden="true" />
              <div className="contact-envelope-flap" aria-hidden="true" />
              <span className="contact-envelope-wax-seal" aria-hidden="true"><b>KS</b><small>SEALED<br />WITH INTENT</small></span>
              <button
                type="button"
                className="contact-envelope-toggle"
                aria-expanded={envelopeOpen}
                onClick={event => {
                  const stage = event.currentTarget.closest('.contact-envelope-stage')
                  const opening = !envelopeOpen
                  stage?.style.setProperty('--envelope-progress', opening ? '1' : '0')
                  stage?.style.setProperty('--flap-angle', opening ? '-168deg' : '0deg')
                  stage?.style.setProperty('--letter-layer', opening ? '6' : '3')
                  stage?.style.setProperty('--letter-top', opening ? '2%' : '31%')
                  stage?.style.setProperty('--letter-height', opening ? '84%' : '60%')
                  setEnvelopeOpen(opening)
                }}
              >
                <span>{envelopeOpen ? 'LETTER OPEN' : 'OPEN THE LETTER'}</span><ArrowUpRight size={15} />
              </button>
            </div>
            <p className="contact-envelope-instruction">{envelopeOpen ? 'YOUR NOTE IS READY — PICK A WAY TO CONNECT' : 'TAP OPEN THE LETTER TO REVEAL CONTACT ROUTES'}</p>
          </div>
        </div>
        <div className="contact-closing-line"><span>THE WORK CONTINUES.</span><a href="#top">RETURN TO THE FIRST PAGE <ArrowUp size={13} /></a></div>
        <footer className="footer">
          <a className="footer-brand" href="#top"><span className="brand-monogram">KS<span>®</span></span><span>THE PERSONAL EDITION<br />HYDERABAD, INDIA</span></a>
          <div className="footer-links"><a href="#work">SELECTED WORK <ArrowUpRight size={12} /></a><a href="#skills">THE WORKSHOP <ArrowUpRight size={12} /></a><a href="#top">BACK TO TOP <ArrowUp size={12} /></a></div>
          <span className="footer-copy">© 2026 KIRTAN SWAMY<br />PRINTED ON THE INTERNET.</span>
        </footer>
      </section>

      {activeProject && <div className="project-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setActiveProject(null) }}>
        <section className={`project-dialog project-${activeProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
          <div className="project-dialog-top"><span>THE PROJECT FILE / {activeProject.id}</span><button type="button" onClick={() => setActiveProject(null)} aria-label="Close project note"><X size={20} /></button></div>
          <div className="project-dialog-body" data-lenis-prevent>
            <div className="project-dialog-art"><span>{activeProject.id} / SYSTEM SKETCH</span><strong>{activeProject.name}</strong><small>{activeProject.note}</small><ProjectVisual project={activeProject} /></div>
            <div className="project-dialog-copy"><Eyebrow>{activeProject.category} · {activeProject.year}</Eyebrow><h2 id="project-dialog-title">{activeProject.name}<span>.</span></h2><p className="project-dialog-type">{activeProject.type}</p><p className="project-dialog-description">{activeProject.description}</p>
              <div className="project-dialog-meta"><div><span>CONTRIBUTION</span><strong>{activeProject.contribution}</strong></div><div><span>STAGE</span><strong>{activeProject.stage}</strong></div><div className="project-focus-meta"><span>FOCUS AREAS</span><div className="project-tag-list">{activeProject.tags.map(tag => <b key={tag}>{tag}</b>)}</div></div><div><span>FILED</span><strong>{activeProject.year} / {activeProject.category}</strong></div></div>
              <div className="project-manifesto"><span>THE CENTRAL IDEA</span><strong>“{activeProject.note}”</strong><small>PROJECT FILE / {activeProject.id} — {activeProject.stage}</small></div>
              <div className="project-case-heading"><span>INSIDE THE FILE</span><small>THE THINKING / THE BUILD / THE NEXT STEP</small></div>
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
