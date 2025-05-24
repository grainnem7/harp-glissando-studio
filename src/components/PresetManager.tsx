import React, { useState, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './PresetManager.css'
import { PedalPositions } from '../types'
import { getAllCategories, getPresetsByCategory, PresetCategory, CategorizedPreset } from '../services/presetLibrary'
import PresetNotation from './PresetNotation'

interface PresetManagerProps {
  onPresetSelect: (preset: PedalPositions) => void
  currentPedals: PedalPositions
}

function PresetManager({ onPresetSelect, currentPedals }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory>('Major Scales')
  const [searchTerm, setSearchTerm] = useState('')
  const [customPresets, setCustomPresets] = useState<CategorizedPreset[]>([])

  const categories = getAllCategories()

  const filteredPresets = useMemo(() => {
    let presets = selectedCategory === 'Custom' ? customPresets : getPresetsByCategory(selectedCategory)
    
    if (searchTerm) {
      presets = presets.filter(preset => 
        preset.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return presets
  }, [selectedCategory, searchTerm, customPresets])

  const handlePresetClick = useCallback((preset: CategorizedPreset) => {
    onPresetSelect(preset.pedals)
    setIsOpen(false) // Close menu after selection
  }, [onPresetSelect])

  const saveCurrentAsPreset = useCallback(() => {
    const name = prompt('Enter preset name:')
    if (name) {
      const newPreset: CategorizedPreset = {
        name,
        category: 'Custom',
        pedals: { ...currentPedals },
        description: 'Custom preset'
      }
      setCustomPresets(prev => [...prev, newPreset])
      setSelectedCategory('Custom')
    }
  }, [currentPedals])

  const PresetItem = ({ preset, onClick }: { preset: CategorizedPreset, onClick: () => void }) => {
    return (
      <div className="preset-item" onClick={onClick}>
        <div className="preset-name">{preset.name}</div>
        <PresetNotation pedals={preset.pedals} compact={true} />
      </div>
    )
  }

  return (
    <div className="preset-manager">
      <button 
        className="preset-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ♪ Presets
      </button>
      
      {isOpen && createPortal(
        <div className="preset-panel">
          <div className="preset-header">
            <h3>Presets</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="search-section">
            <input
              type="text"
              placeholder="Search presets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-section">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value as PresetCategory)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Custom">Custom ({customPresets.length})</option>
            </select>
          </div>
          
          <div className="preset-list">
            {filteredPresets.length === 0 ? (
              <div className="no-presets">
                {searchTerm ? 'No matching presets' : 'No presets in this category'}
              </div>
            ) : (
              filteredPresets.map((preset, index) => (
                <PresetItem
                  key={`${preset.category}-${index}`}
                  preset={preset}
                  onClick={() => handlePresetClick(preset)}
                />
              ))
            )}
          </div>
          
          <div className="preset-actions">
            <button onClick={saveCurrentAsPreset} className="save-preset-btn">
              Save Current
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default PresetManager