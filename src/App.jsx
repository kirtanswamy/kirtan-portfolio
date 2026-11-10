import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Code2,
  Menu,
  MoveUpRight,
  X,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    name: 'BUSHO',
    type: 'HEALTH-TECH / PUBLIC SYSTEMS',
    description: 'A community-first healthcare operations platform connecting frontline health workers, supervisors and the systems behind them.',
    year: '2026',
    tone: 'busho',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85',
    href: 'https://project1busho.vercel.app/',
    linkLabel: 'VISIT PROJECT',
  },
  {
    number: '02',
    name: 'VARSITY',
    type: 'ED-TECH / CAMPUS EXPERIENCE',
    description: 'A student-first campus companion bringing attendance, academic resources, previous papers and everyday planning into one place.',
    year: '2026',
    tone: 'varsity',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=85',
    href: 'https://github.com/aalindmukati/Varsity',
    linkLabel: 'VIEW REPOSITORY',
  },
  {
    number: '03',
    name: 'ELECTROLAB',
    type: 'ENGINEERING / INTERACTIVE SIMULATION',
    description: 'An interactive electronics workbench exploring diode behaviour, live calculations and voltage sweeps through visual simulation.',
    year: '2026',
    tone: 'electrolab',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    href: 'https://github.com/kirtanswamy/ElectroLab',
    linkLabel: 'VIEW REPOSITORY',
  },
  {
    number: '04',
    name: 'JANSEVA ONE',
    type: 'CIVIC-TECH / SOCIAL INNOVATION',
    description: 'A unified civic action concept designed to make local infrastructure issues easier to report, track and resolve.',
    year: 'CONCEPT',
    tone: 'janseva',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=85',
    href: 'https://github.com/kirtanswamy',
    linkLabel: 'EXPLORE MY WORK',
  },
]

const expertise = [
  'Creative development',
  'Frontend engineering',
  'App development',
  'UI / UX design',
  'AI & machine learning',
  'Electronics engineering',
]

function ProjectCard({ project }) {
  return (
    <a className={`project-card ${project.tone} reveal`} href={project.href} target="_blank" rel="noreferrer">
      <div className="project-visual">
        <img src={project.image} alt={`${project.name} project visual`} loading="lazy" />
        <div className="project-visual-shade" />
        <span className="project-visual-number">{project.number} / 04</span>
        <span className="project-open"><ArrowUpRight size={22} strokeWidth={1.5} /></span>
        <span className="project-visual-word">{project.name}</span>
      </div>
      <div className="project-meta">
        <div>
          <p className="eyebrow">{project.type}</p>
          <h3>{project.name}<sup>®</sup></h3>
        </div>
        <span className="project-year">{project.year}</span>
      </div>
      <div className="project-description">
        <p>{project.description}</p>
        <span>{project.linkLabel} <ArrowUpRight size={14} /></span>
      </div>
    </a>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion')
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
    intro
      .fromTo('.topbar', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo('.hero-kicker', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.35')
      .fromTo('.hero-line', { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.25, stagger: 0.12 }, '-=0.35')
      .fromTo('.hero-foot', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.55')
      .fromTo('.intro-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 }, '-=0.45')

    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(element, { y: 42, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      })
    })

    gsap.utils.toArray('.section-heading').forEach((element) => {
      gsap.fromTo(element.querySelectorAll('.heading-line'), { yPercent: 110 }, {
        yPercent: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: element, start: 'top 82%', once: true },
      })
    })

    gsap.to('.manifesto-orbit', {
      rotate: 360,
      duration: 28,
      repeat: -1,
      ease: 'none',
    })

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.killTweensOf('*')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen)
    return () => document.body.classList.remove('menu-is-open')
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="site-shell">
      <div className="paper-grain" aria-hidden="true" />
      <header className="topbar">
        <a href="#top" className="brand" aria-label="Kirtan Swamy home">
          <span className="brand-mark">KS<span>®</span></span>
          <span className="brand-caption">INDEPENDENT<br />DIGITAL MAKER</span>
        </a>
        <div className="topbar-center">
          <span className="availability-dot" />
          OPEN TO INTERESTING IDEAS
        </div>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">WORK <sup>04</sup></a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT <ArrowUpRight size={12} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <span className="eyebrow">EXPLORE THE PORTFOLIO</span>
        <a href="#work" onClick={closeMenu}>Selected work <ArrowUpRight /></a>
        <a href="#about" onClick={closeMenu}>A little about me <ArrowUpRight /></a>
        <a href="#contact" onClick={closeMenu}>Get in touch <ArrowUpRight /></a>
        <p>CHENNAI, INDIA · © 2026</p>
      </div>

      <section className="hero" id="top">
        <div className="hero-topline">
          <p className="hero-kicker"><span>PORTFOLIO / 2026</span><span>ENGINEERING × CREATIVITY</span></p>
          <p className="hero-index">SELECTED WORK<br />AND THOUGHTS — N° 01</p>
        </div>
        <div className="hero-title-wrap">
          <h1 className="hero-title">
            <span className="hero-line hero-line-first">KIRTAN</span>
            <span className="hero-line hero-line-second">SWAMY<span className="hero-star"><Asterisk size="clamp(36px, 7vw, 100px)" strokeWidth={1.3} /></span></span>
          </h1>
        </div>
        <div className="hero-foot">
          <p className="hero-intro">I turn curious ideas<br />into thoughtful realities.</p>
          <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={18} /></div>
          <p className="hero-location">BASED IN CHENNAI, INDIA<br />ECE UNDERGRAD · CREATIVE BUILDER</p>
        </div>
      </section>

      <section className="intro-grid" aria-label="Introduction and featured projects">
        <a className="intro-card intro-card-image" href="#about">
          <div className="intro-photo">
            <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85" alt="Creative studio interior with natural light" loading="lazy" />
            <span className="photo-note">A MIND IN<br />PROGRESS ↗</span>
          </div>
          <div className="intro-card-bottom"><span className="eyebrow">A LITTLE INTRODUCTION</span><ArrowUpRight size={18} /></div>
        </a>
        <div className="intro-card intro-card-center">
          <p className="eyebrow">NOT JUST CODE. A POINT OF VIEW.</p>
          <h2>IDEAS<br />INTO <em>impact.</em></h2>
          <p className="intro-center-copy">A curious engineering student exploring the space where technology, design and people meet.</p>
          <a href="#about" className="text-link">GET TO KNOW ME <ArrowUpRight size={14} /></a>
        </div>
        <a className="intro-card intro-card-feature" href="#work">
          <div className="feature-art">
            <span className="feature-art-top">SELECTED / 2026</span>
            <span className="feature-art-big">04</span>
            <span className="feature-art-bottom">PROJECTS<br />IN FOCUS</span>
            <div className="feature-asterisk"><Asterisk size={68} strokeWidth={1} /></div>
          </div>
          <div className="intro-card-bottom"><span className="eyebrow">THE WORK INDEX</span><ArrowUpRight size={18} /></div>
        </a>
      </section>

      <section className="statement reveal">
        <p className="eyebrow">01 — THE WAY I SEE IT</p>
        <div className="statement-copy">
          <p>Technology should feel</p>
          <h2>HUMAN<span>.</span></h2>
          <p className="statement-last">Design should mean something.<br />And good ideas should make it out into the world.</p>
        </div>
        <div className="statement-aside"><span className="side-rule" />THINK DEEPLY.<br />MAKE WITH INTENT.</div>
      </section>

      <section className="work-section" id="work">
        <div className="section-top reveal">
          <p className="eyebrow">02 — SELECTED WORK / 2025—26</p>
          <p className="section-note">A FEW THINGS I'VE BEEN<br />THINKING, DESIGNING & BUILDING.</p>
        </div>
        <div className="section-heading">
          <h2><span className="heading-line">SELECTED</span><span className="heading-line">WORK<span className="heading-period">.</span></span></h2>
          <span className="heading-side">A CONSTANT<br />WORK IN PROGRESS ↘</span>
        </div>
        <div className="projects-grid">
          {projects.map((project) => <ProjectCard key={project.number} project={project} />)}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-top reveal">
          <p className="eyebrow">03 — THE PERSON BEHIND THE PIXELS</p>
          <p className="section-note">ENGINEERING MIND.<br />CREATIVE INSTINCT.</p>
        </div>
        <div className="about-layout">
          <div className="about-heading section-heading">
            <h2><span className="heading-line">A BIT</span><span className="heading-line">ABOUT</span><span className="heading-line"><em>ME.</em></span></h2>
            <div className="about-stamp"><span>CURIOUS<br />BY NATURE</span><Asterisk size={42} /></div>
          </div>
          <div className="about-copy reveal">
            <p className="about-lede">I'm Kirtan — an Electronics & Communication Engineering student, developer and builder who enjoys turning complex problems into simple, useful experiences.</p>
            <p>I move between code, interfaces and ideas. From building digital products to exploring electronics and AI, I'm interested in the craft behind things that work beautifully and solve something real.</p>
            <p>Currently learning, building and collaborating from Chennai, India.</p>
            <a className="text-link" href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer">MORE ON GITHUB <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      <section className="expertise-section reveal">
        <div className="expertise-header">
          <p className="eyebrow">04 — THE TOOLKIT</p>
          <span className="eyebrow">ALWAYS LEARNING / ALWAYS MAKING</span>
        </div>
        <div className="expertise-title"><h2>AREAS OF<br /><em>EXPLORATION.</em></h2><Asterisk className="expertise-star" size={100} strokeWidth={0.9} /></div>
        <div className="expertise-list">
          {expertise.map((skill, index) => (
            <div className="expertise-row" key={skill}><span className="expertise-number">0{index + 1}</span><span>{skill}</span><ArrowUpRight size={18} /></div>
          ))}
        </div>
      </section>

      <section className="recognition reveal">
        <div className="recognition-label"><p className="eyebrow">05 — A MOMENT THAT MATTERED</p><span>IDEAS BEYOND THE SCREEN</span></div>
        <div className="recognition-body">
          <div className="recognition-year">2026</div>
          <div className="recognition-copy">
            <p className="eyebrow">VIKSIT BHARAT YOUNG LEADERS DIALOGUE</p>
            <h2>INNOVATION<br />WITH <em>TRADITION.</em></h2>
            <p>Selected to represent the state contingent at the Viksit Bharat Young Leaders Dialogue 2026, presenting a civic-tech vision for building a more responsive and connected Bharat.</p>
            <span className="recognition-tag">JANSEVA ONE · CIVIC TECHNOLOGY</span>
          </div>
          <div className="recognition-symbol"><Asterisk size={100} strokeWidth={0.8} /></div>
        </div>
      </section>

      <section className="marquee" aria-label="Let's build something meaningful">
        <div className="marquee-track">
          {[0, 1, 2, 3].map((item) => <span key={item}>LET'S MAKE SOMETHING MEANINGFUL <Asterisk size={38} strokeWidth={1} /></span>)}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-top">
          <p className="eyebrow">06 — HAVE A GOOD ONE IN MIND?</p>
          <p className="footer-availability"><span className="availability-dot" /> OPEN TO COLLABORATION & CONVERSATION</p>
        </div>
        <div className="footer-heading">
          <h2>LET'S TALK<br /><em>IDEAS.</em></h2>
          <a className="footer-contact" href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer" aria-label="Visit Kirtan's GitHub profile"><MoveUpRight size={54} strokeWidth={1} /></a>
        </div>
        <div className="footer-bottom">
          <a className="brand footer-brand" href="#top"><span className="brand-mark">KS<span>®</span></span><span className="brand-caption">MADE WITH CURIOSITY<br />IN CHENNAI, INDIA</span></a>
          <div className="footer-links">
            <a href="https://github.com/kirtanswamy" target="_blank" rel="noreferrer"><Code2 size={15} /> GITHUB <ArrowUpRight size={12} /></a>
            <span className="footer-profile-note">LINKEDIN URL TO BE ADDED</span>
          </div>
          <span className="copyright">© 2026 KIRTAN SWAMY<br />ALL RIGHTS RESERVED</span>
          <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight size={14} /></a>
        </div>
      </footer>
    </main>
  )
}

export default App
