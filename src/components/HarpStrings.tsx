import { useState, useRef, TouchEvent as ReactTouchEvent, useEffect } from 'react'
import './HarpStrings.css'
import { HarpString, PedalPositions } from '../types'
import { generateHarpStrings, HarpRange, applyPedalToNote } from '../utils/musicTheory'

interface HarpStringsProps {
  range: HarpRange
  pedalPositions: PedalPositions
  onStringPlay: (note: string, octave: number) => void
  onGlissando: (notes: Array<{note: string, octave: number}>) => void
}

function HarpStrings({ range, pedalPositions, onStringPlay, onGlissando }: HarpStringsProps) {
  const [strings, setStrings] = useState<HarpString[]>(() => generateHarpStrings(range))
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const isTouchingRef = useRef(false)
  const lastPlayedStringRef = useRef<number>(-1)
  const touchStartTimeRef = useRef<number>(0)
  const lastPlayTimeRef = useRef<number>(0)

  useEffect(() => {
    setStrings(generateHarpStrings(range))
    setActiveStrings(new Set())
  }, [range])

  const getActualNoteName = (string: HarpString): string => {
    const { note } = applyPedalToNote(string.note, string.octave, pedalPositions)
    return `${note}${string.octave}`
  }

  const getStringAtPosition = (x: number): number => {
    if (!containerRef.current) return -1
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = x - rect.left
    const stringWidth = rect.width / strings.length
    const stringIndex = Math.floor(relativeX / stringWidth)
    
    // Clamp to valid range
    if (stringIndex < 0) return 0
    if (stringIndex >= strings.length) return strings.length - 1
    
    return stringIndex
  }

  const playString = (stringIndex: number, force = false) => {
    if (stringIndex < 0 || stringIndex >= strings.length) return
    
    // Only debounce if it's the same string being played repeatedly
    const now = Date.now()
    const timeSinceLastPlay = now - lastPlayTimeRef.current
    const isSameString = stringIndex === lastPlayedStringRef.current
    
    // Prevent rapid re-triggering of the same string, but allow different strings immediately
    if (!force && isSameString && timeSinceLastPlay < 30) return
    
    lastPlayTimeRef.current = now
    
    const string = strings[stringIndex]
    setActiveStrings(prev => new Set(prev).add(stringIndex))
    onStringPlay(string.note, string.octave)
    
    setTimeout(() => {
      setActiveStrings(prev => {
        const newSet = new Set(prev)
        newSet.delete(stringIndex)
        return newSet
      })
    }, 200) // Even shorter visual feedback for smoother glissando
  }

  const handleTouchStart = (e: ReactTouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const touch = e.touches[0]
    const stringIndex = getStringAtPosition(touch.clientX)
    
    touchStartTimeRef.current = Date.now()
    
    if (stringIndex >= 0 && stringIndex < strings.length) {
      isTouchingRef.current = true
      lastPlayedStringRef.current = stringIndex
      playString(stringIndex)
    }
  }

  const handleTouchMove = (e: ReactTouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isTouchingRef.current) return
    
    const touch = e.touches[0]
    const stringIndex = getStringAtPosition(touch.clientX)
    
    // Play each string as we move across them - no delay for smooth glissando
    if (stringIndex >= 0 && stringIndex !== lastPlayedStringRef.current) {
      lastPlayedStringRef.current = stringIndex
      playString(stringIndex)
    }
  }

  const handleTouchEnd = (e: ReactTouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Just clean up the state
    isTouchingRef.current = false
    lastPlayedStringRef.current = -1
  }

  const handleMouseDown = (e: React.MouseEvent, stringIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
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
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            <div className="string-line" />
            <div className="string-label">
              {getActualNoteName(string)}
            </div>
          </div>
        ))}
      </div>
      <div className="glissando-trail" />
    </div>
  )
}

export default HarpStrings