import { useEffect, useRef } from 'react'
import '../styles/Cursor.css'

const Cursor = () => {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target && target.dataset.cursor === 'disable') {
        cursor.classList.add('cursor-disable')
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor]')
      if (target && target.dataset.cursor === 'disable') {
        cursor.classList.remove('cursor-disable')
      }
    }

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15

      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    const animId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <div ref={cursorRef} className="cursor-main" />
}

export default Cursor
