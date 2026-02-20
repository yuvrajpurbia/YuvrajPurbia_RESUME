import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import config from '../config'
import '../styles/About.css'

const PlanetScene = lazy(() => import('./earth/PlanetScene'))

const About = () => {
  const sectionRef = useRef(null)
  const [showPlanet, setShowPlanet] = useState(() => window.innerWidth >= 1025)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const onChange = (e) => setShowPlanet(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const words = sectionRef.current?.querySelectorAll('.about-word')
      if (!words) return

      gsap.fromTo(words,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          }
        }
      )

      gsap.fromTo('.about-me h3',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }

    loadGsap()
  }, [])

  const words = config.about.description.split(' ')

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      {showPlanet && (
        <div className="about-planet-bg">
          <Suspense fallback={null}>
            <PlanetScene sectionRef={sectionRef} />
          </Suspense>
        </div>
      )}

      <div className="about-me">
        <h3>{config.about.title}</h3>
        <p>
          {words.map((word, i) => (
            <span key={i} className="about-word split-word">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

export default About
