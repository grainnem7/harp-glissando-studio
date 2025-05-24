import { useState, useRef, useEffect, PointerEvent as ReactPointerEvent } from 'react'
import './HarpStrings.css'
import { HarpString, PedalPositions } from '../types'
import { generateHarpStrings, HarpRange, applyPedalToNote } from '../utils/musicTheory'

interface HarpStringsProps {
  range: HarpRange
  pedalPositions: PedalPositions
  onStringPlay: (note: string, octave: number) => void
  onGlissando: (notes: Array<{note: string, octave: number}>) => void
  hoverMode?: boolean
}

function HarpStrings({ range, pedalPositions, onStringPlay, hoverMode = false }: HarpStringsProps) {
  const [strings, setStrings] = useState<HarpString[]>(() => generateHarpStrings(range))
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const isPointerDownRef = useRef(false)
  const lastPlayedStringRef = useRef<number>(-1)
  const touchMapRef = useRef<Map<number, number>>(new Map()) // pointerId -> stringIndex

  useEffect(() => {
    setStrings(generateHarpStrings(range))
    setActiveStrings(new Set())
  }, [range])

  const getActualNoteName = (string: HarpString): string => {
    const { note } = applyPedalToNote(string.note, string.octave, pedalPositions)
    return `${note}${string.octave}`
  }

  const getStringIndexFromElement = (element: Element | null): number => {
    if (!element) return -1
    
    // Check if the element is a harp string or its child
    const stringElement = element.closest('.harp-string')
    if (!stringElement) return -1
    
    // Find the index by iterating through all string elements
    const allStrings = containerRef.current?.querySelectorAll('.harp-string')
    if (!allStrings) return -1
    
    return Array.from(allStrings).indexOf(stringElement)
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
    }, 100) // Very short visual feedback for smooth glissando
  }

  const handlePointerDown = (e: ReactPointerEvent) => {
    e.preventDefault()
    
    // In hover mode, don't handle pointer down for mouse (only touch devices)
    if (hoverMode && e.pointerType === 'mouse') {
      return
    }
    
    // Get the element under the pointer
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const stringIndex = getStringIndexFromElement(element)
    
    if (stringIndex >= 0) {
      isPointerDownRef.current = true
      touchMapRef.current.set(e.pointerId, stringIndex)
      lastPlayedStringRef.current = stringIndex
      playString(stringIndex)
      
      // Capture pointer for consistent tracking
      if (e.currentTarget && 'setPointerCapture' in e.currentTarget) {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
      }
    }
  }

  const handlePointerMove = (e: ReactPointerEvent) => {
    e.preventDefault()
    
    if (!isPointerDownRef.current) return
    
    // Get the element under the pointer
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const stringIndex = getStringIndexFromElement(element)
    
    if (stringIndex >= 0) {
      const previousIndex = touchMapRef.current.get(e.pointerId)
      
      // If we've moved to a different string
      if (previousIndex !== stringIndex) {
        touchMapRef.current.set(e.pointerId, stringIndex)
        
        // Play all strings between previous and current
        if (previousIndex !== undefined && previousIndex >= 0) {
          const direction = stringIndex > previousIndex ? 1 : -1
          
          // Play in the correct order
          if (direction === 1) {
            for (let i = previousIndex + 1; i <= stringIndex; i++) {
              playString(i)
            }
          } else {
            for (let i = previousIndex - 1; i >= stringIndex; i--) {
              playString(i)
            }
          }
        } else {
          playString(stringIndex)
        }
        
        lastPlayedStringRef.current = stringIndex
      }
    }
  }

  const handlePointerUp = (e: ReactPointerEvent) => {
    e.preventDefault()
    
    // Remove from touch map
    touchMapRef.current.delete(e.pointerId)
    
    // Release pointer capture
    if (e.currentTarget && 'releasePointerCapture' in e.currentTarget) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
    }
    
    // Clean up the state if no more touches
    if (touchMapRef.current.size === 0) {
      isPointerDownRef.current = false
      lastPlayedStringRef.current = -1
    }
  }

  return (
    <div 
      className="harp-strings-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="strings-wrapper">
        {strings.map((string, index) => (
          <div
            key={index}
            className={`harp-string ${string.color} ${activeStrings.has(index) ? 'active' : ''}`}
            onMouseEnter={hoverMode ? () => playString(index) : undefined}
          >
            <div className="string-line" />
            {(index === 0 || index === strings.length - 1 || index % 7 === 0) && (
              <div className="string-label">
                {getActualNoteName(string)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="glissando-trail" />
    </div>
  )
}

export default HarpStrings