import { useEffect, useState } from 'react'
import config from '../config'
import '../styles/Navbar.css'

const HoverLink = ({ text }) => (
  <div className="hover-link">
    <div className="hover-in">
      {text}
      <div>{text}</div>
    </div>
  </div>
)

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (e, target) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title">
          {config.developer.fullName}
        </a>
        <a href={`mailto:${config.social.email}`} className="navbar-connect">
          {config.social.email}
        </a>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <ul className={menuOpen ? 'nav-open' : ''}>
          <li>
            <a href="#about" onClick={(e) => scrollTo(e, '#about')}>
              <HoverLink text="ABOUT" />
            </a>
          </li>
          <li>
            <a href="#work" onClick={(e) => scrollTo(e, '#work')}>
              <HoverLink text="WORK" />
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>
              <HoverLink text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>
      <div className={`nav-fade ${scrolled ? 'visible' : ''}`} />
    </>
  )
}

export default Navbar
