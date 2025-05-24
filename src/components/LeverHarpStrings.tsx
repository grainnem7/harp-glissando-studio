import { useState, useRef, useEffect, PointerEvent as ReactPointerEvent } from 'react'
import './LeverHarpStrings.css'
import { LeverHarpString, LeverHarpPreset } from '../types'
import { generateLeverHarpStrings, calculateLeverHarpPitch, leverHarpPresets, leverHarpScales } from '../utils/musicTheory'

interface LeverHarpStringsProps {
  onStringPlay: (note: string, octave: number, frequency: number) => void
  onGlissando: (notes: Array<{note: string, octave: number, frequency: number}>) => void
  hoverMode?: boolean
  onStringsChange?: (strings: LeverHarpString[]) => void
}

function LeverHarpStrings({ onStringPlay, onGlissando, hoverMode = false, onStringsChange }: LeverHarpStringsProps) {
  const [strings, setStrings] = useState<LeverHarpString[]>(() => generateLeverHarpStrings())
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set())
  const [selectedPreset, setSelectedPreset] = useState<string>('E♭ Major')
  const containerRef = useRef<HTMLDivElement>(null)
  const isPointerDownRef = useRef(false)
  const lastPlayedStringRef = useRef<number>(-1)
  const touchMapRef = useRef<Map<number, number>>(new Map())

  // Notify parent when strings change
  useEffect(() => {
    if (onStringsChange) {
      onStringsChange(strings)
    }
  }, [strings, onStringsChange])

  // Apply preset
  const applyPreset = (preset: LeverHarpPreset) => {
    const newStrings = [...strings]
    preset.leverPattern.forEach((engaged, index) => {
      if (index < newStrings.length) {
        newStrings[index].leverEngaged = engaged
      }
    })
    setStrings(newStrings)
    setSelectedPreset(preset.name)
  }

  // Toggle individual lever
  const toggleLever = (stringIndex: number) => {
    const newStrings = [...strings]
    newStrings[stringIndex].leverEngaged = !newStrings[stringIndex].leverEngaged
    setStrings(newStrings)
    setSelectedPreset('Custom')
  }

  // Reset all levers
  const resetAllLevers = () => {
    const newStrings = strings.map(s => ({ ...s, leverEngaged: false }))
    setStrings(newStrings)
    setSelectedPreset('E♭ Major')
  }

  const getActualNoteName = (string: LeverHarpString): string => {
    const { note } = calculateLeverHarpPitch(string)
    return `${note}${string.octave}`
  }

  const getStringIndexFromElement = (element: Element | null): number => {
    if (!element) return -1
    
    const stringElement = element.closest('.lever-harp-string')
    if (!stringElement) return -1
    
    const allStrings = containerRef.current?.querySelectorAll('.lever-harp-string')
    if (!allStrings) return -1
    
    return Array.from(allStrings).indexOf(stringElement)
  }

  const playString = (stringIndex: number) => {
    if (stringIndex < 0 || stringIndex >= strings.length) return
    
    const string = strings[stringIndex]
    const { note, frequency } = calculateLeverHarpPitch(string)
    
    setActiveStrings(prev => new Set(prev).add(stringIndex))
    onStringPlay(note, string.octave, frequency)
    
    setTimeout(() => {
      setActiveStrings(prev => {
        const newSet = new Set(prev)
        newSet.delete(stringIndex)
        return newSet
      })
    }, 100)
  }

  const handlePointerDown = (e: ReactPointerEvent) => {
    e.preventDefault()
    
    if (hoverMode && e.pointerType === 'mouse') {
      return
    }
    
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const stringIndex = getStringIndexFromElement(element)
    
    if (stringIndex >= 0) {
      isPointerDownRef.current = true
      touchMapRef.current.set(e.pointerId, stringIndex)
      lastPlayedStringRef.current = stringIndex
      playString(stringIndex)
      
      if (e.currentTarget && 'setPointerCapture' in e.currentTarget) {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
      }
    }
  }

  const handlePointerMove = (e: ReactPointerEvent) => {
    e.preventDefault()
    
    if (!isPointerDownRef.current) return
    
    const element = document.elementFromPoint(e.clientX, e.clientY)
    const stringIndex = getStringIndexFromElement(element)
    
    if (stringIndex >= 0) {
      const previousIndex = touchMapRef.current.get(e.pointerId)
      
      if (previousIndex !== stringIndex) {
        touchMapRef.current.set(e.pointerId, stringIndex)
        
        if (previousIndex !== undefined && previousIndex >= 0) {
          const direction = stringIndex > previousIndex ? 1 : -1
          
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
    
    touchMapRef.current.delete(e.pointerId)
    
    if (e.currentTarget && 'releasePointerCapture' in e.currentTarget) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
    }
    
    if (touchMapRef.current.size === 0) {
      isPointerDownRef.current = false
      lastPlayedStringRef.current = -1
    }
  }

  return (
    <div className="lever-harp-container">
      <div className="lever-harp-controls">
        <div className="lever-preset-selector">
          <label>Quick Setup:</label>
          <select 
            value={selectedPreset} 
            onChange={(e) => {
              const preset = leverHarpPresets.find(p => p.name === e.target.value)
              if (preset) applyPreset(preset)
            }}
          >
            <option value="Custom">Custom</option>
            {leverHarpPresets.map(preset => (
              <option key={preset.name} value={preset.name}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
        </div>
        <button 
          className="reset-levers-btn"
          onClick={resetAllLevers}
        >
          Reset All Levers
        </button>
      </div>
      
      {/* Scale Selection Buttons */}
      <div className="scale-selection">
        <div className="scale-section">
          <h4>Major Scales</h4>
          <div className="scale-buttons">
            {leverHarpScales
              .filter(scale => scale.type === 'major')
              .map(scale => (
                <button
                  key={scale.name}
                  className={`scale-btn ${selectedPreset === scale.name ? 'active' : ''}`}
                  onClick={() => applyPreset(scale)}
                  title={scale.description}
                >
                  {scale.name}
                </button>
              ))}
          </div>
        </div>
        
        <div className="scale-section">
          <h4>Minor Scales</h4>
          <div className="scale-buttons">
            {leverHarpScales
              .filter(scale => scale.type === 'minor')
              .map(scale => (
                <button
                  key={scale.name}
                  className={`scale-btn ${selectedPreset === scale.name ? 'active' : ''}`}
                  onClick={() => applyPreset(scale)}
                  title={scale.description}
                >
                  {scale.name}
                </button>
              ))}
          </div>
        </div>
      </div>
      
      <div 
        className="lever-harp-strings-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="lever-strings-wrapper">
          {strings.map((string, index) => (
            <div
              key={index}
              className={`lever-harp-string ${string.color} ${activeStrings.has(index) ? 'active' : ''}`}
              onMouseEnter={hoverMode ? () => playString(index) : undefined}
            >
              <div className="lever-container">
                <div className="lever-note-label">
                  {(() => {
                    const { note } = calculateLeverHarpPitch(string)
                    // Format the note with proper symbols
                    return note.replace('b', '♭').replace('#', '♯')
                  })()}
                </div>
                <button
                  className={`lever-toggle ${string.leverEngaged ? 'engaged' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleLever(index)
                  }}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  aria-label={`Lever for ${getActualNoteName(string)}`}
                >
                  <div className="lever-indicator" />
                </button>
              </div>
              
              <div className="string-line" />
              
              <div className="string-label">
                {getActualNoteName(string)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeverHarpStrings