import { useState, useEffect } from 'react'
import './App.css'
import HarpStrings from './components/HarpStrings'
import HarpPedalDiagram from './components/HarpPedalDiagram'
import RangeSelector from './components/RangeSelector'
import LoadingScreen from './components/LoadingScreen'
import ScaleDisplay from './components/ScaleDisplay'
import { PedalPositions, PedalNote, PedalPosition } from './types'
import { useAudioEngine } from './hooks/useAudioEngine'
import { HarpRange } from './utils/musicTheory'

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
  }

  const handleStringPlay = (note: string, octave: number) => {
    audioEngine.playNote(note, octave, pedalPositions)
  }

  const handleGlissando = (notes: Array<{note: string, octave: number}>) => {
    audioEngine.playGlissando(notes, pedalPositions)
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
          <RangeSelector 
            currentRange={currentRange}
            onRangeChange={setCurrentRange}
          />
          
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
        <HarpStrings 
          range={currentRange}
          pedalPositions={pedalPositions}
          onStringPlay={handleStringPlay}
          onGlissando={handleGlissando}
          hoverMode={isHoverMode}
        />
      </div>
      
      <div className="controls">
        <HarpPedalDiagram 
          pedalPositions={pedalPositions}
          onPedalChange={handlePedalChange}
          onPresetSelect={setPedalPositions}
        />
        <ScaleDisplay 
          pedalPositions={pedalPositions}
          onPedalChange={handlePedalChange}
        />
      </div>
    </div>
  )
}

export default App