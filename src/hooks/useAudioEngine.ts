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
    // Create reverb with more realistic harp-like characteristics
    reverbRef.current = new Tone.Reverb({
      decay: 3.5,      // Longer decay for concert hall sound
      wet: 0.4,        // More wet signal for realistic ambience
      preDelay: 0.02   // Small pre-delay for space
    }).toDestination()

    // Create polyphonic synth with more realistic harp characteristics
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle',
        partialCount: 8  // More harmonics for richer sound
      },
      envelope: {
        attack: 0.003,   // Very fast attack like plucked string
        decay: 1.2,      // Longer decay for sustain
        sustain: 0.08,   // Lower sustain for more natural decay
        release: 2.5     // Longer release for natural fade
      },
      volume: -2
    }).connect(reverbRef.current)

    // Set minimal latency
    Tone.context.lookAhead = 0.01 // Reduce lookahead to 10ms

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
      
      // Play with realistic harp note duration and dynamics
      const velocity = 0.6 + Math.random() * 0.25
      const duration = '4n'  // Longer duration for more realistic harp sustain
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
        const velocity = 0.5 + Math.random() * 0.2
        
        synthRef.current!.triggerAttackRelease(frequency, '4n', time, velocity)
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