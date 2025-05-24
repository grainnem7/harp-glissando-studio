import './PedalControls.css'
import { PedalPositions, PedalNote, PedalPosition } from '../types'

interface PedalControlsProps {
  pedalPositions: PedalPositions
  onPedalChange: (pedal: PedalNote, position: PedalPosition) => void
}

const pedalOrder: PedalNote[] = ['D', 'C', 'B', 'E', 'F', 'G', 'A']

const positionSymbols = {
  flat: '♭',
  natural: '♮',
  sharp: '♯'
}

const nextPosition = (current: PedalPosition): PedalPosition => {
  switch (current) {
    case 'flat': return 'natural'
    case 'natural': return 'sharp'
    case 'sharp': return 'flat'
  }
}

function PedalControls({ pedalPositions, onPedalChange }: PedalControlsProps) {
  const handlePedalClick = (pedal: PedalNote) => {
    const currentPosition = pedalPositions[pedal]
    const newPosition = nextPosition(currentPosition)
    onPedalChange(pedal, newPosition)
  }

  return (
    <div className="pedal-controls">
      <div className="pedals-container">
        {pedalOrder.map(pedal => (
          <div 
            key={pedal}
            className={`pedal ${pedalPositions[pedal]}`}
            onClick={() => handlePedalClick(pedal)}
          >
            <div className="pedal-letter">{pedal}</div>
            <div className="pedal-positions">
              <div className={`position flat ${pedalPositions[pedal] === 'flat' ? 'active' : ''}`}>
                {positionSymbols.flat}
              </div>
              <div className={`position natural ${pedalPositions[pedal] === 'natural' ? 'active' : ''}`}>
                {positionSymbols.natural}
              </div>
              <div className={`position sharp ${pedalPositions[pedal] === 'sharp' ? 'active' : ''}`}>
                {positionSymbols.sharp}
              </div>
            </div>
            <div className="pedal-indicator">
              <div className={`indicator-dot ${pedalPositions[pedal]}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="pedal-info">
        <span>Tap pedals to change position</span>
      </div>
    </div>
  )
}

export default PedalControls