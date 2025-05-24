import { useEffect, useRef, useState, useCallback } from 'react'
import * as Tone from 'tone'
import { PedalPositions } from '../types'
import { applyPedalToNote } from '../utils/musicTheory'

export function useAudioEngine() {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAudioStarted, setIsAudioStarted] = useState(false)

  const initializeAudio = useCallback(async () => {
    if (isAudioStarted) return
    
    try {
      // Start Tone.js context
      await Tone.start()
      setIsAudioStarted(true)
      
      // Preload with a silent note to initialize everything
      if (synthRef.current) {
        synthRef.current.triggerAttackRelease(440, '32n', Tone.now(), 0.001)
      }
      
      setIsLoaded(true)
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }, [isAudioStarted])

  useEffect(() => {
    // Create reverb with faster generation
    reverbRef.current = new Tone.Reverb({
      decay: 1.5,
      wet: 0.2
    }).toDestination()

    // Create polyphonic synth optimized for glissando
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 12, // Allow more simultaneous notes for overlapping glissando
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.001,  // Very fast attack for responsive glissando
        decay: 0.4,
        sustain: 0.15,
        release: 0.8 // Shorter release to prevent note overlap
      },
      volume: -4
    }).connect(reverbRef.current)

    // Set minimal latency
    Tone.context.lookAhead = 0.01 // Reduce lookahead to 10ms
    Tone.context.updateInterval = 0.01 // Update every 10ms

    // Start audio on any user interaction
    const startAudio = () => {
      if (!isAudioStarted) {
        initializeAudio()
      }
    }

    document.addEventListener('touchstart', startAudio, { once: true })
    document.addEventListener('mousedown', startAudio, { once: true })
    document.addEventListener('click', startAudio, { once: true })

    return () => {
      document.removeEventListener('touchstart', startAudio)
      document.removeEventListener('mousedown', startAudio)
      document.removeEventListener('click', startAudio)
      
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
      }
    }
  }, [initializeAudio, isAudioStarted])

  const playNote = (note: string, octave: number, pedalPositions: PedalPositions) => {
    if (!synthRef.current || !isLoaded) return

    try {
      const { frequency } = applyPedalToNote(note, octave, pedalPositions)
      
      // Ensure audio context is running
      if (Tone.context.state !== 'running') {
        Tone.start()
      }
      
      // Play with shorter duration for cleaner glissando
      const velocity = 0.75 + Math.random() * 0.15
      const duration = '16n' // Shorter notes for better glissando separation
      synthRef.current.triggerAttackRelease(frequency, duration, '+0', velocity)
    } catch (error) {
      console.warn('Audio playback error:', error)
      // Try to restart audio if there's an error
      if (!isAudioStarted) {
        initializeAudio()
      }
    }
  }

  const playGlissando = (notes: Array<{note: string, octave: number}>, pedalPositions: PedalPositions) => {
    if (!synthRef.current || !isLoaded || notes.length === 0) return

    try {
      // Ensure audio context is running
      if (Tone.context.state !== 'running') {
        Tone.start()
      }

      const now = Tone.now()
      const timePerNote = 0.03 // Faster glissando - 30ms between notes

      notes.forEach((note, index) => {
        const { frequency } = applyPedalToNote(note.note, note.octave, pedalPositions)
        const time = now + (index * timePerNote)
        const velocity = 0.6 + Math.random() * 0.2
        
        synthRef.current!.triggerAttackRelease(frequency, '8n', time, velocity)
      })
    } catch (error) {
      console.warn('Glissando playback error:', error)
    }
  }

  return {
    playNote,
    playGlissando,
    isLoaded,
    isAudioStarted,
    initializeAudio
  }
}