import { useEffect, useRef, lazy, Suspense } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope, FaXTwitter } from 'react-icons/fa6'
import config from '../config'
import '../styles/Landing.css'

const EarthScene = lazy(() => import('./earth/EarthScene'))

const Landing = () => {
  const sectionRef = useRef(null)
  const introInnerRef = useRef(null)
  const infoInnerRef = useRef(null)

  // 3D mouse-tracking tilt (desktop only, rAF-throttled)
  useEffect(() => {
    let rafId = 0
    let mx = 0, my = 0

    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (introInnerRef.current) {
            introInnerRef.current.style.transform =
              `perspective(800px) rotateY(${mx * 3}deg) rotateX(${-my * 2}deg)`
          }
          if (infoInnerRef.current) {
            infoInnerRef.current.style.transform =
              `perspective(800px) rotateY(${mx * 4}deg) rotateX(${-my * 3}deg)`
          }
          rafId = 0
        })
      }
    }

    const mq = window.matchMedia('(min-width: 1025px)')
    const toggle = () => {
      if (mq.matches) {
        window.addEventListener('mousemove', onMove)
      } else {
        window.removeEventListener('mousemove', onMove)
        if (introInnerRef.current) introInnerRef.current.style.transform = ''
        if (infoInnerRef.current) infoInnerRef.current.style.transform = ''
      }
    }
    toggle()
    mq.addEventListener('change', toggle)
    return () => {
      mq.removeEventListener('change', toggle)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')

      const tl = gsap.timeline({ delay: 0.5 })

      tl.fromTo('.landing-intro h2',
        { opacity: 0, y: 30, rotateX: -40 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.landing-name-char',
        { opacity: 0, y: 50, rotateY: 90, scale: 0.5 },
        { opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 0.6, stagger: 0.04, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo('.landing-glow-line',
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.inOut' },
        '-=0.2'
      )
      .fromTo('.landing-info h3',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.landing-info-h2',
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.landing-h2-info',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.social-icons a',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      )
    }

    loadGsap()
  }, [])

  const renderChars = (text) =>
    text.split('').map((char, i) => (
      <span key={i} className="landing-name-char">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  return (
    <section className="landing-section" ref={sectionRef}>
      <div className="landing-earth-bg">
        <Suspense fallback={
          <div className="avatar-loading">
            <div className="avatar-loading-orb" />
          </div>
        }>
          <EarthScene />
        </Suspense>
      </div>

      <div className="landing-container">
        <div className="landing-intro">
          <div className="landing-intro-inner" ref={introInnerRef}>
            <h2>Hello, I'm</h2>
            <h1>
              {renderChars(config.developer.name)}
              <br />
              {renderChars('Purbia')}
            </h1>
            <div className="landing-glow-line" />
          </div>
        </div>

        <div className="landing-info">
          <div className="landing-info-inner" ref={infoInnerRef}>
            <h3>I am a</h3>
            <h2 className="landing-info-h2">
              {config.developer.title}
            </h2>
            <div className="landing-h2-info">
              <span>Building Intelligent Systems</span>
              <span className="landing-cursor" />
            </div>
          </div>
        </div>
      </div>

      <div className="social-icons">
        <a href={config.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href={config.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
        <a href={config.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaXTwitter />
        </a>
        <a href={`mailto:${config.social.email}`} aria-label="Email">
          <FaEnvelope />
        </a>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  )
}

export default Landing
