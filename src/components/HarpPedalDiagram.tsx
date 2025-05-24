import { useState } from 'react'
import './HarpPedalDiagram.css'
import { PedalPositions, PedalNote, PedalPosition } from '../types'

interface HarpPedalDiagramProps {
  pedalPositions: PedalPositions
  onPedalChange: (pedal: PedalNote, position: PedalPosition) => void
  readOnly?: boolean
}

const leftFootPedals: PedalNote[] = ['D', 'C', 'B']
const rightFootPedals: PedalNote[] = ['E', 'F', 'G', 'A']

function HarpPedalDiagram({ pedalPositions, onPedalChange, readOnly = false }: HarpPedalDiagramProps) {
  const [hoveredPedal, setHoveredPedal] = useState<PedalNote | null>(null)

  const getPedalNote = (pedal: PedalNote): string => {
    const position = pedalPositions[pedal]
    switch (position) {
      case 'flat': return `${pedal}♭`
      case 'sharp': return `${pedal}♯`
      default: return pedal
    }
  }

  const handlePedalClick = (pedal: PedalNote, position: PedalPosition) => {
    if (readOnly) return
    onPedalChange(pedal, position)
  }

  const renderPedalGroup = (pedals: PedalNote[], groupName: string) => (
    <div className="pedal-group">
      <div className="pedal-group-label">{groupName}</div>
      <div className="pedal-columns">
        {pedals.map(pedal => (
          <div 
            key={pedal} 
            className="pedal-column"
            onMouseEnter={() => setHoveredPedal(pedal)}
            onMouseLeave={() => setHoveredPedal(null)}
          >
            {/* Flat position (above line) */}
            <div 
              className={`pedal-position flat ${pedalPositions[pedal] === 'flat' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
              onClick={() => handlePedalClick(pedal, 'flat')}
            >
              <div className="position-line" />
              <div className="position-symbol">♭</div>
            </div>
            
            {/* Natural position (through line) */}
            <div 
              className={`pedal-position natural ${pedalPositions[pedal] === 'natural' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
              onClick={() => handlePedalClick(pedal, 'natural')}
            >
              <div className="horizontal-line" />
              <div className="position-line through" />
              <div className="position-symbol">♮</div>
            </div>
            
            {/* Sharp position (below line) */}
            <div 
              className={`pedal-position sharp ${pedalPositions[pedal] === 'sharp' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
              onClick={() => handlePedalClick(pedal, 'sharp')}
            >
              <div className="position-line" />
              <div className="position-symbol">♯</div>
            </div>
            
            {/* Pedal letter */}
            <div className="pedal-letter">{pedal}</div>
            
            {/* Current note display */}
            {hoveredPedal === pedal && (
              <div className="current-note">{getPedalNote(pedal)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="harp-pedal-diagram">
      <div className="diagram-container">
        {renderPedalGroup(leftFootPedals, 'Left Foot')}
        
        <div className="foot-separator">
          <div className="separator-line" />
          <div className="separator-label">|</div>
        </div>
        
        {renderPedalGroup(rightFootPedals, 'Right Foot')}
      </div>
      
      {!readOnly && (
        <div className="diagram-instructions">
          Click above/on/below the line to set pedal positions
        </div>
      )}
    </div>
  )
}

export default HarpPedalDiagram