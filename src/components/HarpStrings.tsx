import { useState, useRef, TouchEvent as ReactTouchEvent } from 'react'
import './HarpStrings.css'
import { PedalPositions, HarpString } from '../types'
import { generateHarpStrings } from '../utils/musicTheory'

interface HarpStringsProps {
  pedalPositions: PedalPositions
  onStringPlay: (note: string, octave: number) => void
  onGlissando: (notes: Array<{note: string, octave: number}>) => void
}

function HarpStrings({ pedalPositions, onStringPlay, onGlissando }: HarpStringsProps) {
  const [strings] = useState<HarpString[]>(() => generateHarpStrings())
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set())
  const [glissandoNotes, setGlissandoNotes] = useState<Array<{note: string, octave: number}>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isGlissandoRef = useRef(false)
  const lastPlayedStringRef = useRef<number>(-1)

  const getStringAtPosition = (x: number): number => {
    if (!containerRef.current) return -1
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = x - rect.left
    const stringWidth = rect.width / strings.length
    const stringIndex = Math.floor(relativeX / stringWidth)
    return Math.max(0, Math.min(stringIndex, strings.length - 1))
  }

  const playString = (stringIndex: number) => {
    if (stringIndex < 0 || stringIndex >= strings.length) return
    
    const string = strings[stringIndex]
    setActiveStrings(prev => new Set(prev).add(stringIndex))
    onStringPlay(string.note, string.octave)
    
    setTimeout(() => {
      setActiveStrings(prev => {
        const newSet = new Set(prev)
        newSet.delete(stringIndex)
        return newSet
      })
    }, 500)
  }

  const handleTouchStart = (e: ReactTouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const stringIndex = getStringAtPosition(touch.clientX)
    
    if (stringIndex >= 0) {
      isGlissandoRef.current = true
      lastPlayedStringRef.current = stringIndex
      setGlissandoNotes([strings[stringIndex]])
      playString(stringIndex)
    }
  }

  const handleTouchMove = (e: ReactTouchEvent) => {
    e.preventDefault()
    if (!isGlissandoRef.current) return
    
    const touch = e.touches[0]
    const stringIndex = getStringAtPosition(touch.clientX)
    
    if (stringIndex >= 0 && stringIndex !== lastPlayedStringRef.current) {
      lastPlayedStringRef.current = stringIndex
      const string = strings[stringIndex]
      setGlissandoNotes(prev => [...prev, string])
      playString(stringIndex)
    }
  }

  const handleTouchEnd = (e: ReactTouchEvent) => {
    e.preventDefault()
    if (isGlissandoRef.current && glissandoNotes.length > 1) {
      onGlissando(glissandoNotes)
    }
    isGlissandoRef.current = false
    lastPlayedStringRef.current = -1
    setGlissandoNotes([])
  }

  const handleMouseDown = (stringIndex: number) => {
    playString(stringIndex)
  }

  return (
    <div 
      className="harp-strings-container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="strings-wrapper">
        {strings.map((string, index) => (
          <div
            key={index}
            className={`harp-string ${string.color} ${activeStrings.has(index) ? 'active' : ''}`}
            onMouseDown={() => handleMouseDown(index)}
          >
            <div className="string-line" />
            <div className="string-label">
              {string.note}{string.octave}
            </div>
          </div>
        ))}
      </div>
      <div className="glissando-trail" />
    </div>
  )
}

export default HarpStrings