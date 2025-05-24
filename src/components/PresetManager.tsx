import { useState } from 'react'
import './PresetManager.css'
import { PedalPositions, GlissandoPreset } from '../types'
import { presetLibrary } from '../services/presetLibrary'

interface PresetManagerProps {
  onPresetSelect: (preset: PedalPositions) => void
  currentPedals: PedalPositions
}

function PresetManager({ onPresetSelect, currentPedals }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customPresets, setCustomPresets] = useState<GlissandoPreset[]>([])

  const handlePresetClick = (preset: GlissandoPreset) => {
    onPresetSelect(preset.pedals)
    setIsOpen(false)
  }

  const saveCurrentAsPreset = () => {
    const name = prompt('Enter preset name:')
    if (name) {
      const newPreset: GlissandoPreset = {
        name,
        pedals: { ...currentPedals }
      }
      setCustomPresets([...customPresets, newPreset])
    }
  }

  return (
    <div className="preset-manager">
      <button 
        className="preset-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Presets
      </button>
      
      {isOpen && (
        <div className="preset-panel">
          <div className="preset-header">
            <h3>Presets</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="preset-list">
            <h4>Common Scales</h4>
            {presetLibrary.map((preset, index) => (
              <button
                key={index}
                className="preset-item"
                onClick={() => handlePresetClick(preset)}
              >
                <span className="preset-name">{preset.name}</span>
                {preset.description && (
                  <span className="preset-description">{preset.description}</span>
                )}
              </button>
            ))}
            
            {customPresets.length > 0 && (
              <>
                <h4>Custom Presets</h4>
                {customPresets.map((preset, index) => (
                  <button
                    key={`custom-${index}`}
                    className="preset-item"
                    onClick={() => handlePresetClick(preset)}
                  >
                    <span className="preset-name">{preset.name}</span>
                  </button>
                ))}
              </>
            )}
          </div>
          
          <div className="preset-actions">
            <button onClick={saveCurrentAsPreset}>
              Save Current Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresetManager