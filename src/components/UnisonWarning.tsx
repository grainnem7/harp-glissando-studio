import React, { useMemo } from 'react'
import { PedalPositions } from '../types'
import { applyPedalToNote } from '../utils/musicTheory'
import './UnisonWarning.css'

interface UnisonWarningProps {
  pedalPositions: PedalPositions
}

const UnisonWarning: React.FC<UnisonWarningProps> = ({ pedalPositions }) => {
  const unisons = useMemo(() => {
    const noteMap = new Map<string, string[]>()
    const strings = [
      { note: 'C', octave: 4 }, { note: 'D', octave: 4 }, { note: 'E', octave: 4 },
      { note: 'F', octave: 4 }, { note: 'G', octave: 4 }, { note: 'A', octave: 4 },
      { note: 'B', octave: 4 }
    ]
    
    // Check each string to see what note it produces
    strings.forEach(string => {
      const { note, octave } = applyPedalToNote(string.note, string.octave, pedalPositions)
      const fullNote = `${note}${octave}`
      
      if (!noteMap.has(fullNote)) {
        noteMap.set(fullNote, [])
      }
      noteMap.get(fullNote)!.push(string.note)
    })
    
    // Find notes that appear more than once
    const unisonPairs: Array<{ note: string, strings: string[] }> = []
    noteMap.forEach((strings, note) => {
      if (strings.length > 1) {
        unisonPairs.push({ note, strings })
      }
    })
    
    return unisonPairs
  }, [pedalPositions])
  
  if (unisons.length === 0) return null
  
  return (
    <div className="unison-warning">
      <div className="warning-header">
        <span className="warning-icon">ℹ️</span>
        <span className="warning-title">Unison Strings Detected</span>
      </div>
      <div className="warning-content">
        {unisons.map((unison, index) => (
          <div key={index} className="unison-item">
            <strong>{unison.strings.join(' & ')}</strong> both sound as <strong>{unison.note}</strong>
          </div>
        ))}
        <div className="warning-tip">
          Harpists sometimes use unisons for special effects or to create pentatonic scales, 
          but one string becomes redundant in the glissando.
        </div>
      </div>
    </div>
  )
}

export default UnisonWarning