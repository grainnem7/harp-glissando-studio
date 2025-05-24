import { useState, useEffect } from 'react'
import './App.css'
import HarpStrings from './components/HarpStrings'
import PedalControls from './components/PedalControls'
import PresetManager from './components/PresetManager'
import { PedalPositions, PedalNote } from './types'
import { useAudioEngine } from './hooks/useAudioEngine'

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

  const handlePedalChange = (pedal: PedalNote, position: 'flat' | 'natural' | 'sharp') => {
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
      <PresetManager 
        onPresetSelect={setPedalPositions}
        currentPedals={pedalPositions}
      />
      <div className="main-content">
        <HarpStrings 
          onStringPlay={handleStringPlay}
          onGlissando={handleGlissando}
        />
      </div>
      <div className="controls">
        <PedalControls 
          pedalPositions={pedalPositions}
          onPedalChange={handlePedalChange}
        />
      </div>
    </div>
  )
}

export default App