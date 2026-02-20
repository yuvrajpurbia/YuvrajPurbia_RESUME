import { useState, useRef } from 'react'
import '../styles/Loading.css'

const Loading = ({ onComplete }) => {
  const [clicked, setClicked] = useState(false)
  const wrapRef = useRef(null)

  const handleMouseMove = (e) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    wrap.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    wrap.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const handleClick = () => {
    setClicked(true)
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  return (
    <div className={`loading-screen ${clicked ? 'loaded' : ''}`}>
      <div className="loading-scene">
        <div className="loading-subtitle">Portfolio</div>
        <div
          ref={wrapRef}
          className={`loading-wrap ${clicked ? 'loading-clicked' : ''}`}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <div className="loading-hover" />
          <button className="loading-button">
            <div className="loading-content">
              Launch Into The Void
            </div>
          </button>
        </div>
        <div className="loading-hint">Click to enter</div>
      </div>
    </div>
  )
}

export default Loading
