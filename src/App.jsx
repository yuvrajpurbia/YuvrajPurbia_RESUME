import { useState, useEffect } from 'react'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import About from './components/About'
import Career from './components/Career'
import WhatIDo from './components/WhatIDo'
import Works from './components/Works'
import TechStack from './components/TechStack'
import Contact from './components/Contact'
import Cursor from './components/Cursor'

const SectionDivider = () => <div className="section-divider" aria-hidden="true" />

function App() {
  const [loaded, setLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const handleLoadComplete = () => {
    setLoaded(true)
    document.body.style.overflow = 'auto'
    setTimeout(() => setShowContent(true), 600)
  }

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden'
    }
  }, [loaded])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Loading onComplete={handleLoadComplete} />
      <Cursor />

      {loaded && (
        <main className={showContent ? '' : 'main-active'}>
          <Navbar />

          <div className="container-main">
            <Landing />
            <SectionDivider />
            <About />
            <SectionDivider />
            <WhatIDo />
            <SectionDivider />
            <Career />
            <SectionDivider />
            <Works />
            <SectionDivider />
            <TechStack />
            <SectionDivider />
            <Contact />
          </div>

          <button
            className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </main>
      )}
    </>
  )
}

export default App
