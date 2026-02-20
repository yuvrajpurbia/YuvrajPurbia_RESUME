import { useState, useRef, lazy, Suspense } from 'react'
import config from '../config'
import '../styles/WhatIDo.css'

const BluePlanetScene = lazy(() => import('./earth/BluePlanetScene'))

const WhatIDo = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const skills = [config.skills.develop, config.skills.design, config.skills.webApps]

  return (
    <section className="whatIDO" ref={sectionRef}>
      <div className="whatido-planet-bg">
        <Suspense fallback={null}>
          <BluePlanetScene sectionRef={sectionRef} />
        </Suspense>
      </div>
      <div className="what-box">
        <h2>
          W<span className="hat-h2">hat</span><br />
          I <span className="do-h2">Do</span>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`what-content ${
                activeIndex === i ? 'what-content-active' : ''
              } ${activeIndex !== i ? 'what-sibling' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIndex(i) } }}
              role="button"
              tabIndex={0}
              aria-expanded={activeIndex === i}
            >
              <div className="what-corner" />
              <div className="what-content-in">
                <h3>{skill.title}</h3>
                <h4>{skill.description}</h4>
                <p>{skill.details}</p>
                <h5>TOOLS & TECHNOLOGIES</h5>
                <div className="what-content-flex">
                  {skill.tools.map((tool, j) => (
                    <span key={j} className="what-tags">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhatIDo
