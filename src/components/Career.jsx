import { useEffect, useRef, lazy, Suspense } from 'react'
import config from '../config'
import '../styles/Career.css'

const GenericPlanetScene = lazy(() => import('./earth/GenericPlanetScene'))

const Career = () => {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo('.career-section h2',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.career-info-box',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.career-info',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => {
          if (timelineRef.current) {
            timelineRef.current.classList.add('visible')
          }
        },
      })
    }

    loadGsap()
  }, [])

  const getYear = (period) => {
    if (period.includes('Present')) return 'Present'
    const parts = period.split('–')
    return parts[parts.length - 1]?.trim() || period
  }

  return (
    <section className="career-section" ref={sectionRef}>
      <div className="career-planet-bg">
        <Suspense fallback={null}>
          <GenericPlanetScene sectionRef={sectionRef} preset="saturn" />
        </Suspense>
      </div>
      <h2>
        My <span>Career</span><br />Journey
      </h2>

      <div className="career-container">
        <div className="career-info">
          <div className="career-timeline" ref={timelineRef}>
            <div className="career-dot" />
          </div>

          {config.experiences.map((exp, i) => (
            <div className="career-info-box" key={i}>
              <div className="career-info-in">
                <div>
                  <h3>{exp.position}</h3>
                  <h5>{exp.company}</h5>
                </div>
                <h4>{getYear(exp.period)}</h4>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Career
