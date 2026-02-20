import { useEffect, useRef } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import config from '../config'
import '../styles/Contact.css'

const Contact = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      })

      tl.fromTo('.contact-section h3',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.contact-box',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        '-=0.4'
      )
    }

    loadGsap()
  }, [])

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-orb" aria-hidden="true">
        <div className="contact-orb-glow" />
        <div className="contact-orb-surface" />
      </div>
      <h3>Get In Touch</h3>

      <div className="contact-flex">
        <div className="contact-box">
          <h4>EMAIL</h4>
          <p>
            <a className="contact-social" href={`mailto:${config.contact.email}`}>
              {config.contact.email}
            </a>
          </p>

          <h4>PHONE</h4>
          <p>
            <a className="contact-social" href={`tel:${config.contact.phone}`}>
              {config.contact.phone}
            </a>
          </p>
        </div>

        <div className="contact-box">
          <h4>SOCIALS</h4>
          <p>
            <a className="contact-social" href={config.contact.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
          <p>
            <a className="contact-social" href={config.contact.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
          <p>
            <a className="contact-social" href={config.contact.twitter} target="_blank" rel="noopener noreferrer">
              Twitter / X
            </a>
          </p>
        </div>

        <div className="contact-box">
          <h4>LOCATION</h4>
          <p>{config.contact.location}</p>

          <h2>
            Let's build something <span>intelligent</span> together.
          </h2>
        </div>
      </div>

      <div className="contact-cta">
        <p>&copy; {new Date().getFullYear()} {config.developer.fullName}. All rights reserved.</p>
        <a className="cta-btn cta-btn-hire" href={`mailto:${config.contact.email}`}>
          Hire Me <FaArrowRight />
        </a>
      </div>
    </section>
  )
}

export default Contact
