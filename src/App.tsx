import { useState, useEffect } from 'react'
import './App.css'
import HarpStrings from './components/HarpStrings'
import LeverHarpStrings from './components/LeverHarpStrings'
import HarpPedalDiagram from './components/HarpPedalDiagram'
import LeverHarpDiagram from './components/LeverHarpDiagram'
import RangeSelector from './components/RangeSelector'
import LoadingScreen from './components/LoadingScreen'
import ScaleDisplay from './components/ScaleDisplay'
import { PedalPositions, PedalNote, PedalPosition, HarpMode, LeverHarpString } from './types'
import { useAudioEngine } from './hooks/useAudioEngine'
import { HarpRange, generateLeverHarpStrings } from './utils/musicTheory'

const initialPedals: PedalPositions = {
  D: 'natural',
  C: 'natural',
  B: 'natural',
  E: 'natural',
  F: 'natural',
  G: 'natural',
  A: 'natural'
}

function App() {
  const [pedalPositions, setPedalPositions] = useState<PedalPositions>(initialPedals)
  const [currentRange, setCurrentRange] = useState<HarpRange>('middle') // Start with middle range for better mobile experience
  const [isHoverMode, setIsHoverMode] = useState(false)
  const [currentPresetName, setCurrentPresetName] = useState<string>('C Major')
  const [highlightedPedal, setHighlightedPedal] = useState<PedalNote | null>(null)
  const [harpMode, setHarpMode] = useState<HarpMode>('pedal')
  const [leverHarpStrings, setLeverHarpStrings] = useState<LeverHarpString[]>(() => generateLeverHarpStrings())
  const audioEngine = useAudioEngine()

  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }
    
    document.addEventListener('touchstart', preventZoom, { passive: false })
    document.addEventListener('touchmove', preventZoom, { passive: false })
    
    return () => {
      document.removeEventListener('touchstart', preventZoom)
      document.removeEventListener('touchmove', preventZoom)
    }
  }, [])

  const handlePedalChange = (pedal: PedalNote, position: PedalPosition) => {
    setPedalPositions(prev => ({
      ...prev,
      [pedal]: position
    }))
    setCurrentPresetName('Custom')
    
    // Highlight the pedal when it's changed from the scale display
    setHighlightedPedal(pedal)
    setTimeout(() => setHighlightedPedal(null), 1000)
  }

  const handleStringPlay = (note: string, octave: number, frequency?: number) => {
    if (frequency !== undefined) {
      // Lever harp mode - use direct frequency
      audioEngine.playNote(note, octave, frequency)
    } else {
      // Pedal harp mode - use pedal positions
      audioEngine.playNote(note, octave, pedalPositions)
    }
  }

  const handleGlissando = (notes: Array<{note: string, octave: number, frequency?: number}>) => {
    if (harpMode === 'lever') {
      // Lever harp mode - frequencies are included in notes
      audioEngine.playGlissando(notes)
    } else {
      // Pedal harp mode - use pedal positions
      audioEngine.playGlissando(notes, pedalPositions)
    }
  }

  return (
    <div className="app">
      <LoadingScreen 
        isLoading={!audioEngine.isLoaded}
        // message={audioEngine.isAudioStarted ? "Loading..." : "Tap to start audio"}
      />
      
      <div className="app-header">
        <h1 className="app-title">Harp Glissando Studio</h1>
        
        <div className="header-controls">
          {/* Harp Mode Toggle */}
          <div className="harp-mode-toggle">
            <button
              className={`mode-btn ${harpMode === 'pedal' ? 'active' : ''}`}
              onClick={() => setHarpMode('pedal')}
            >
              Pedal Harp
            </button>
            <button
              className={`mode-btn ${harpMode === 'lever' ? 'active' : ''}`}
              onClick={() => setHarpMode('lever')}
            >
              Lever Harp
            </button>
          </div>
          
          {/* Only show range selector for pedal harp */}
          {harpMode === 'pedal' && (
            <RangeSelector 
              currentRange={currentRange}
              onRangeChange={setCurrentRange}
            />
          )}
          
          {/* Show hover toggle only on desktop */}
          {window.innerWidth >= 768 && (
            <label className="hover-toggle-container">
              <input 
                type="checkbox" 
                checked={isHoverMode}
                onChange={(e) => setIsHoverMode(e.target.checked)}
                className="hover-checkbox"
              />
              <span className="hover-slider"></span>
              <span className="hover-label">{isHoverMode ? 'Hover' : 'Click'}</span>
            </label>
          )}
        </div>
      </div>
      
      <div className="main-content">
        {harpMode === 'pedal' ? (
          <HarpStrings 
            range={currentRange}
            pedalPositions={pedalPositions}
            onStringPlay={handleStringPlay}
            onGlissando={handleGlissando}
            hoverMode={isHoverMode}
          />
        ) : (
          <LeverHarpStrings
            onStringPlay={handleStringPlay}
            onGlissando={handleGlissando}
            hoverMode={isHoverMode}
            onStringsChange={setLeverHarpStrings}
          />
        )}
      </div>
      
      {harpMode === 'pedal' ? (
        <div className="controls">
          <HarpPedalDiagram 
            pedalPositions={pedalPositions}
            onPedalChange={handlePedalChange}
            onPresetSelect={(pedals, name) => {
              setPedalPositions(pedals)
              if (name) setCurrentPresetName(name)
            }}
            highlightedPedal={highlightedPedal}
          />
          <ScaleDisplay 
            pedalPositions={pedalPositions}
            onPedalChange={handlePedalChange}
            presetName={currentPresetName}
          />
        </div>
      ) : (
        <div className="controls">
          <LeverHarpDiagram 
            strings={leverHarpStrings}
          />
        </div>
      )}
    </div>
  )
}

export default App