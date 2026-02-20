import { useEffect, useRef, useState } from 'react'
import { FaBolt, FaBrain, FaChartLine, FaYoutube } from 'react-icons/fa'
import config from '../config'
import '../styles/Works.css'

const projectIcons = {
  'BlitzScale': FaBolt,
  'MockMind': FaBrain,
  'SpeedSense': FaChartLine,
  'YouTube Clone': FaYoutube,
}

const Works = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [ready, setReady] = useState(false)

  // Mark ready after first paint so track has real dimensions
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!ready) return

    let ctx
    const isDesktop = window.matchMedia('(min-width: 769px)')
    let setupRef

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const setup = () => {
        if (ctx) ctx.revert()

        // Clear any leftover inline transforms from GSAP
        track.style.transform = ''

        ctx = gsap.context(() => {
          gsap.fromTo('.work-section h2',
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              }
            }
          )

          // Only pin + horizontal scroll on desktop
          if (isDesktop.matches) {
            const distance = track.scrollWidth - window.innerWidth
            if (distance <= 0) return

            gsap.to(track, {
              x: -distance,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=' + distance,
                scrub: 1,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true,
              }
            })
          } else {
            // Mobile: fade-in cards on scroll
            gsap.fromTo('.work-card',
              { opacity: 0, y: 40 },
              {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: {
                  trigger: '.work-train-track',
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                }
              }
            )
          }
        }, section)
      }

      setupRef = setup
      setup()
      isDesktop.addEventListener('change', setup)
    }

    init()
    return () => {
      if (ctx) ctx.revert()
      if (setupRef) isDesktop.removeEventListener('change', setupRef)
    }
  }, [ready])

  const cards = config.projects

  return (
    <section className="work-section" id="work" ref={sectionRef}>
      <div className="work-venus" aria-hidden="true">
        <div className="venus-glow" />
        <div className="venus-surface" />
      </div>

      <h2>My <span>Works</span></h2>

      <div className="work-train-track" ref={trackRef}>
        {cards.map((project, i) => {
          const Icon = projectIcons[project.title] || FaBolt
          const techs = project.technologies.split(', ')

          return (
            <div className="work-card" key={project.id}>
              <div className="work-card-top">
                <div className="work-card-number">0{i + 1}</div>
                <div className="work-card-header">
                  <h3>{project.title}</h3>
                  <div className="work-card-category">{project.category}</div>
                </div>
              </div>

              <div className="work-card-body">
                <div className="work-card-details">
                  <p className="work-card-desc">{project.description}</p>
                  <div className="work-card-label">Tools and features</div>
                  <div className="work-card-tech">
                    {techs.map((tech, j) => (
                      <span key={j}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="work-card-thumbnail">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} loading="lazy" decoding="async" />
                  ) : (
                    <div className="work-card-thumb-placeholder">
                      <Icon className="work-card-placeholder-icon" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Works
