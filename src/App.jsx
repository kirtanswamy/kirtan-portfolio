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
    href: 'https://project1busho.vercel.app/', repo: 'https://github.com/kirtanswamy/BUSHO',
    tags: ['React', 'Supabase', 'Workflow design'],
    note: 'From the field, for the field.',
  },
  {
    id: '02', name: 'VARSITY', category: 'CAMPUS LIFE', type: 'Ed-tech · Student experience',
    description: 'A student-first campus companion bringing attendance, academic resources, previous-year papers and everyday planning into one considered experience.',
    stage: 'PRODUCT BUILD', year: '2026', tone: 'orange',
    href: 'https://github.com/aalindmukati/Varsity', repo: 'https://github.com/aalindmukati/Varsity',
    tags: ['React Native', 'Expo', 'Product design'],
    note: 'Make campus life feel connected.',
  },
  {
    id: '03', name: 'ELECTROLAB', category: 'ENGINEERING', type: 'Electronics · Simulation',
    description: 'An interactive electronics workbench for exploring diode behaviour through live calculations, voltage sweeps and visual circuit intuition.',
    stage: 'WORKING PROTOTYPE', year: '2026', tone: 'green',
    href: 'https://github.com/kirtanswamy/ElectroLab', repo: 'https://github.com/kirtanswamy/ElectroLab',
    tags: ['React', 'TypeScript', 'Electronics'],
    note: 'Making invisible behaviour visible.',
  },
  {
    id: '04', name: 'JANSEVA ONE', category: 'CIVIC INNOVATION', type: 'Civic-tech · Public impact',
    description: 'A unified civic action concept focused on making local infrastructure issues easier to report, track and resolve through community participation.',
    stage: 'CONCEPT / PRESENTED', year: '2026', tone: 'red',
    href: 'https://github.com/kirtanswamy', repo: 'https://github.com/kirtanswamy',
    tags: ['Civic technology', 'Research', 'Public systems'],
    note: 'A small report should start a real response.',
  },
]

const categories = ['ALL WORK', 'PUBLIC SYSTEMS', 'CAMPUS LIFE', 'ENGINEERING', 'CIVIC INNOVATION']

const learning = [
  { name: 'Qualcomm AI Upskilling', detail: 'Technical Foundations', kind: 'AI / MACHINE LEARNING', status: 'COURSE COMPLETED · CREDENTIAL TO VERIFY' },
  { name: 'Goldman Sachs', detail: 'Operations Job Simulation · Forage', kind: 'BUSINESS / OPERATIONS', status: 'JOB SIMULATION COMPLETED' },
  { name: 'Google Ads & Analytics', detail: 'Digital marketing and measurement learning', kind: 'ANALYTICS', status: 'COURSE DETAILS TO VERIFY' },
  { name: 'Microsoft × LinkedIn', detail: 'Generative AI learning programme', kind: 'GENERATIVE AI', status: 'COURSE COMPLETED · TITLE TO VERIFY' },
]

const skills = [
  { group: 'BUILD', items: ['JavaScript', 'React', 'React Native', 'Flutter', 'Python', 'C / C++', 'Java'] },
  { group: 'DESIGN', items: ['UI / UX', 'Interaction design', 'Visual storytelling', 'Prototyping'] },
  { group: 'SYSTEMS', items: ['Git & GitHub', 'Vite', 'Supabase', 'Electronics', 'AI / ML foundations'] },
]

const navItems = [
  ['WORK', '#work'], ['STORY', '#story'], ['ABOUT', '#about'], ['JOURNEY', '#journey'],
  ['FIELD NOTES', '#field-notes'], ['CONTACT', '#contact'],
]

function Eyebrow({ children, light = false }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>
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
          <a href={project.repo} target="_blank" rel="noreferrer" className="project-repo" aria-label={`View ${project.name} repository`}><Code2 size={17} /><ArrowUpRight size={13} /></a>
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
  const projectShelfRef = useRef(null)

  const visibleProjects = useMemo(
    () => activeCategory === 'ALL WORK' ? projects : projects.filter(project => project.category === activeCategory),
    [activeCategory],
  )

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion')
      return undefined
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 1.35 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
    intro
      .fromTo('.masthead', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo('.hero-overline > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, '-=0.3')
      .fromTo('.hero-headline .headline-row', { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.1 }, '-=0.25')
      .fromTo('.hero-deck, .hero-aside, .portrait-frame', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, '-=0.45')

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

    gsap.to('.orbit-ring', { rotate: 360, duration: 38, repeat: -1, ease: 'none' })
    gsap.to('.hero-starburst', { rotate: -360, duration: 54, repeat: -1, ease: 'none' })

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      gsap.killTweensOf('*')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const nodes = navItems.map(([, href]) => document.querySelector(href)).filter(Boolean)
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
    const onKeyDown = event => { if (event.key === 'Escape') setActiveProject(null) }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('dialog-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('dialog-open')
    }
  }, [activeProject])

  useEffect(() => {
    if (projectShelfRef.current) projectShelfRef.current.scrollTo({ left: 0, behavior: 'auto' })
    setActiveProjectIndex(0)
  }, [activeCategory])

  return (
    <main className="site-shell" id="top">
      <div className="paper-grain" aria-hidden="true" />
      <header className="masthead">
        <a className="masthead-brand" href="#top" aria-label="Kirtan Swamy home">
          <span className="brand-monogram">KS<span>®</span></span>
          <span className="brand-caption">THE PERSONAL<br />EDITION</span>
        </a>
        <div className="masthead-center"><span className="live-dot" /> INDEPENDENT MIND. COLLABORATIVE SPIRIT.</div>
        <div className="masthead-meta"><span>CHENNAI, INDIA</span><span>VOL. 01 — 2026</span></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={href} className={activeSection === href ? 'active' : ''} href={href}>{label}<span>↗</span></a>)}
        </nav>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <Eyebrow>THE CONTENTS</Eyebrow>
        {navItems.map(([label, href], index) => <a key={href} href={href} onClick={closeMenu}><span>0{index + 1}</span>{label}<ArrowUpRight /></a>)}
        <p>AN OPEN NOTEBOOK · CHENNAI, INDIA</p>
      </div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overline">
          <Eyebrow>ENGINEERING / DESIGN / IDEAS</Eyebrow>
          <span className="edition-label">A WORK IN PROGRESS — ALWAYS</span>
          <span className="issue-date">TUESDAY, 10 NOVEMBER 2026</span>
        </div>
        <div className="hero-headline">
          <div className="headline-kicker"><span>THE MAKER'S</span><span className="headline-rule" /><span>NOTEBOOK</span></div>
          <h1 id="hero-title">
            <span className="headline-row">KIRTAN</span>
            <span className="headline-row headline-second">SWAMY<span className="headline-period">.</span><span className="hero-starburst"><Asterisk /></span></span>
          </h1>
          <div className="hero-bottomline"><span>CURIOUS BY NATURE.</span><span>BUILT BY TRYING.</span><span>GROUNDED IN PURPOSE.</span></div>
        </div>
        <div className="hero-lower">
          <div className="hero-deck">
            <span className="drop-cap">I</span>
            <p>I'm an engineering student and creative builder exploring the space between <em>technology, design and people.</em> I like turning questions into prototypes—and prototypes into things that matter.</p>
            <a href="#story" className="read-link">READ MY STORY <ArrowDownRight size={16} /></a>
          </div>
          <div className="portrait-frame" aria-label="Illustrated character artwork will be added in a later stage">
            <div className="portrait-top"><span>THE MAKER, IN PRINT</span><span>FIG. 001</span></div>
            <div className="portrait-art" aria-hidden="true">
              <div className="portrait-sun" />
              <div className="portrait-arch" />
              <div className="portrait-lines"><i /><i /><i /><i /><i /><i /></div>
              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />
              <div className="portrait-star">✳</div>
              <span className="portrait-coordinates">13°04' N<br />80°16' E</span>
            </div>
            <div className="portrait-caption"><span>AN ORIGINAL ILLUSTRATED IDENTITY</span><span>TO BE PRINTED SOON ↗</span></div>
          </div>
          <div className="hero-aside">
            <span className="aside-index">01 / 08</span>
            <p>NOT A FINISHED STORY.<br />A RECORD OF WHAT I'M<br />LEARNING TO MAKE.</p>
            <a href="#work" className="round-arrow" aria-label="Explore selected work"><ArrowDown /></a>
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
        <div className="project-filters" role="group" aria-label="Filter projects">
          {categories.map(category => <button key={category} className={activeCategory === category ? 'selected' : ''} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category}>{category}<span>{category === 'ALL WORK' ? '04' : String(projects.filter(project => project.category === category).length).padStart(2, '0')}</span></button>)}
        </div>
        <div className="shelf-toolbar reveal">
          <span>DRAG / SCROLL TO EXPLORE THE ARCHIVE</span>
          <div className="shelf-controls">
            <span className="shelf-counter">{String(activeProjectIndex + 1).padStart(2, '0')} <i>/</i> {String(visibleProjects.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => moveProjectShelf(-1)} disabled={activeProjectIndex === 0} aria-label="Previous project"><ArrowLeft size={16} /></button>
            <button type="button" onClick={() => moveProjectShelf(1)} disabled={activeProjectIndex >= visibleProjects.length - 1} aria-label="Next project"><ArrowRight size={16} /></button>
          </div>
        </div>
        <div className="projects-grid projects-shelf" ref={projectShelfRef} aria-live="polite" onScroll={event => {
          const shelf = event.currentTarget
          const card = shelf.querySelector('.project-card')
          if (card) setActiveProjectIndex(Math.min(visibleProjects.length - 1, Math.max(0, Math.round(shelf.scrollLeft / (card.getBoundingClientRect().width + 22)))))
        }}>
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} onOpen={setActiveProject} />)}
        </div>
        <div className="work-foot reveal"><span>MORE EXPERIMENTS ARE ALWAYS IN THE WORKS.</span><a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer">EXPLORE GITHUB <ArrowUpRight size={14} /></a></div>
      </section>

      <section className="field-note" id="field-notes">
        <div className="field-note-inner">
          <div className="field-note-label"><Eyebrow light>03 — OUTSIDE THE WORKSHOP</Eyebrow><span>FIELD NOTE / 001</span></div>
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
          <div className="field-note-bottom"><span>A MOMENT THAT REMINDED ME WHY BUILDING MATTERS.</span><span>03 / 08</span></div>
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
            <p className="about-lede">I'm Kirtan—an Electronics & Communication Engineering student at SRM Institute of Science and Technology, Chennai.</p>
            <p>My curiosity rarely stays in one lane. Some days it's a circuit, a simulation or a line of code. Other days it's a product flow, a civic problem or a visual detail that makes an experience feel right.</p>
            <p>I enjoy the full journey: understanding a problem, asking better questions, designing a direction, building a first version and learning from what breaks. I'm especially drawn to technology that can make everyday systems work a little better.</p>
            <p>Outside the screen, I'm interested in public innovation, storytelling, communities and the small details that make people feel considered.</p>
            <div className="about-signoff"><span>IN PROGRESS, BY DESIGN.</span><span>— K.S.</span></div>
          </div>
        </div>
        <div className="about-facts reveal">
          <div><span>01 / CURRENT CHAPTER</span><strong>ECE UNDERGRADUATE</strong><small>SRMIST · CHENNAI</small></div>
          <div><span>02 / NATURAL HABIT</span><strong>LEARN BY BUILDING</strong><small>PROTOTYPE · TEST · REFINE</small></div>
          <div><span>03 / BIG INTEREST</span><strong>TECH WITH PURPOSE</strong><small>PRODUCT · PEOPLE · IMPACT</small></div>
        </div>
      </section>

      <section className="journey-section section-pad" id="journey">
        <div className="section-index reveal"><Eyebrow>05 — THE LEARNING CURVE</Eyebrow><span>EDUCATION / COMMUNITY / PRACTICE</span></div>
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
            <div><h3>Research, experiments & independent builds</h3><p>AI / ML · Electronics · Product development</p><small>Learning through practical projects, technical exploration and collaboration.</small></div>
            <span className="journey-mark"><Sparkles /></span>
          </article>
        </div>
      </section>

      <section className="learning-section section-pad">
        <div className="section-index reveal"><Eyebrow>06 — THE READING ROOM</Eyebrow><span>COURSES / SIMULATIONS / CONTINUOUS LEARNING</span></div>
        <div className="learning-intro reveal"><div><h2>ALWAYS<br /><em>LEARNING.</em></h2></div><p>Not every useful lesson comes with a certificate. This is a growing record of courses, simulations and learning paths. Credential links will be added when each record is verified.</p></div>
        <div className="learning-grid">
          {learning.map((item, index) => <article className="learning-card reveal" key={item.name}>
            <div className="learning-card-top"><span>0{index + 1} / LEARNING LOG</span><BookOpen size={19} /></div>
            <p>{item.kind}</p><h3>{item.name}</h3><h4>{item.detail}</h4><span className="learning-status">{item.status}</span>
          </article>)}
        </div>
        <p className="learning-disclaimer">STATUS IS LABELLED AS COURSE OR SIMULATION COMPLETION—NOT AS A PROFESSIONAL CERTIFICATION UNLESS A VERIFIED CREDENTIAL IS LINKED.</p>
      </section>

      <section className="skills-section">
        <div className="skills-inner section-pad">
          <div className="section-index reveal"><Eyebrow light>07 — THINGS I WORK WITH</Eyebrow><span>TOOLS ARE MEANS, NOT THE POINT.</span></div>
          <div className="skills-heading"><h2>THE<br /><em>TOOLBOX.</em></h2><p>My toolkit keeps changing.<br />The curiosity doesn't.</p></div>
          <div className="skills-groups">
            {skills.map(group => <div className="skill-group reveal" key={group.group}><span>{group.group}</span><div>{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}
          </div>
        </div>
      </section>

      <section className="contact-section section-pad" id="contact">
        <div className="section-index reveal"><Eyebrow>08 — THE NEXT PAGE IS OPEN</Eyebrow><span>LET'S MAKE SOMETHING USEFUL</span></div>
        <div className="contact-main">
          <div className="contact-copy"><p>HAVE A QUESTION, AN IDEA<br />OR A GOOD PROBLEM?</p><h2>LET'S<br /><em>MAKE IT.</em></h2><span className="contact-footnote">GOOD CONVERSATIONS CAN START ANYWHERE.</span></div>
          <div className="contact-action">
            <span className="contact-stamp"><Send size={28} /><span>OPEN<br />CHANNEL</span></span>
            <a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer" className="contact-link">FIND ME ON GITHUB <ArrowUpRight /></a>
            <p>For collaborations, project conversations and interesting ideas.</p>
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
            <div className="project-dialog-art"><span>{activeProject.id}</span><strong>{activeProject.name}</strong><small>{activeProject.note}</small></div>
            <div className="project-dialog-copy"><Eyebrow>{activeProject.category} · {activeProject.year}</Eyebrow><h2 id="project-dialog-title">{activeProject.name}<span>.</span></h2><p className="project-dialog-type">{activeProject.type}</p><p className="project-dialog-description">{activeProject.description}</p>
              <div className="project-dialog-meta"><div><span>CURRENT CHAPTER</span><strong>{activeProject.stage}</strong></div><div><span>FOCUS AREAS</span><strong>{activeProject.tags.join(' · ')}</strong></div></div>
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
