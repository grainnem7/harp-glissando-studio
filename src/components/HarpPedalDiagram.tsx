import './HarpPedalDiagram.css'
import { PedalPositions, PedalNote, PedalPosition } from '../types'
import PresetManager from './PresetManager'

interface HarpPedalDiagramProps {
  pedalPositions: PedalPositions
  onPedalChange: (pedal: PedalNote, position: PedalPosition) => void
  onPresetSelect?: (preset: PedalPositions) => void
  readOnly?: boolean
}

const leftFootPedals: PedalNote[] = ['D', 'C', 'B']
const rightFootPedals: PedalNote[] = ['E', 'F', 'G', 'A']

function HarpPedalDiagram({ pedalPositions, onPedalChange, onPresetSelect, readOnly = false }: HarpPedalDiagramProps) {

  const handlePedalClick = (pedal: PedalNote, position: PedalPosition) => {
    if (readOnly) return
    onPedalChange(pedal, position)
  }

  const renderPedalGroup = (pedals: PedalNote[], groupName: string, showIndicators: boolean = false) => (
    <div className="pedal-group">
      <div className="pedal-group-label">{groupName}</div>
      <div className="pedal-row">
        {showIndicators && (
          <div className="position-indicators">
            <div className="indicator-item sharp">
              <span className="indicator-symbol">♯</span>
            </div>
            <div className="indicator-item natural">
              <span className="indicator-symbol">♮</span>
            </div>
            <div className="indicator-item flat">
              <span className="indicator-symbol">♭</span>
            </div>
          </div>
        )}
        <div className="pedal-columns">
          {pedals.map(pedal => (
            <div 
              key={pedal} 
              className="pedal-column"
            >
              {/* Flat position (top) */}
              <div 
                className={`pedal-position flat ${pedalPositions[pedal] === 'flat' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
                onClick={() => handlePedalClick(pedal, 'flat')}
              >
                <div className="position-marker" />
              </div>
              
              {/* Natural position (middle with line) */}
              <div 
                className={`pedal-position natural ${pedalPositions[pedal] === 'natural' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
                onClick={() => handlePedalClick(pedal, 'natural')}
              >
                <div className="horizontal-line" />
                <div className="position-marker" />
              </div>
              
              {/* Sharp position (bottom) */}
              <div 
                className={`pedal-position sharp ${pedalPositions[pedal] === 'sharp' ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
                onClick={() => handlePedalClick(pedal, 'sharp')}
              >
                <div className="position-marker" />
              </div>
              
              {/* Pedal letter */}
              <div className="pedal-letter">{pedal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="harp-pedal-diagram">
      <div className="diagram-container">
        {renderPedalGroup(leftFootPedals, 'Left Foot', true)}
        
        <div className="foot-separator">
          <div className="separator-line" />
        </div>
        
        {renderPedalGroup(rightFootPedals, 'Right Foot', false)}
      </div>
      
      {!readOnly && (
        <div className="diagram-instructions">
          Click positions to change pedal settings
        </div>
      )}
      
      {onPresetSelect && (
        <div className="diagram-presets">
          <PresetManager 
            onPresetSelect={onPresetSelect}
            currentPedals={pedalPositions}
          />
        </div>
      )}
    </div>
  )
}

export default HarpPedalDiagram