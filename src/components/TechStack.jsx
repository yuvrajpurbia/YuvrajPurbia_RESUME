import { useEffect, useRef } from 'react'
import {
  SiJavascript, SiTypescript, SiPython, SiReact, SiNextdotjs,
  SiNodedotjs, SiExpress, SiMongodb, SiRedis, SiDocker,
  SiOpenai, SiGit, SiTailwindcss, SiHtml5, SiCss3, SiPostgresql,
  SiFirebase, SiVercel, SiVite, SiShopify, SiAngular, SiRedux
} from 'react-icons/si'
import { FaBolt, FaServer, FaProjectDiagram, FaRobot } from 'react-icons/fa'
import config from '../config'
import '../styles/TechStack.css'

const iconMap = {
  SiJavascript, SiTypescript, SiPython, SiReact, SiNextdotjs,
  SiNodedotjs, SiExpress, SiMongodb, SiRedis, SiDocker,
  SiOpenai, SiGit, SiTailwindcss, SiHtml5, SiCss3, SiPostgresql,
  SiFirebase, SiVercel, SiVite, SiShopify, SiAngular, SiRedux,
  FaBolt, FaServer, FaProjectDiagram, FaRobot,
}

const TechStack = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo('.techstack-content h2',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.techstack',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.techstack-item',
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.techstack-pyramid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }

    loadGsap()
  }, [])

  const items = config.techStack
  const rows = [
    items.slice(0, 7),
    items.slice(7, 13),
    items.slice(13, 18),
    items.slice(18, 22),
    items.slice(22, 25),
    items.slice(25, 27),
    items.slice(27, 28),
  ]

  return (
    <section className="techstack" ref={sectionRef}>
      <div className="techstack-moon" aria-hidden="true">
        <div className="moon-glow" />
        <div className="moon-surface" />
      </div>
      <div className="techstack-content">
        <h2>Tech Stack</h2>
        <div className="techstack-pyramid">
          {rows.map((row, i) => (
            <div className="techstack-row" key={i}>
              {row.map((tech, j) => {
                const Icon = iconMap[tech.icon]
                return (
                  <div className="techstack-item" key={j} data-tooltip={tech.name} tabIndex={0} role="img" aria-label={tech.name}>
                    {Icon && <Icon className="tech-icon" />}
                    <span>{tech.name}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
