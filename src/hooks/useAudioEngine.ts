import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { PedalPositions } from '../types'
import { applyPedalToNote } from '../utils/musicTheory'

export function useAudioEngine() {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)

  useEffect(() => {
    // Create reverb
    reverbRef.current = new Tone.Reverb({
      decay: 2.5,
      wet: 0.3
    }).toDestination()

    // Create polyphonic synth with harp-like properties
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.005,
        decay: 1.0,
        sustain: 0.1,
        release: 2.0
      },
      volume: -12
    }).connect(reverbRef.current)

    // Start audio context on user interaction
    const startAudio = async () => {
      if (Tone.context.state !== 'running') {
        await Tone.start()
      }
    }

    document.addEventListener('touchstart', startAudio)
    document.addEventListener('mousedown', startAudio)

    return () => {
      document.removeEventListener('touchstart', startAudio)
      document.removeEventListener('mousedown', startAudio)
      
      if (synthRef.current) {
        synthRef.current.dispose()
      }
      if (reverbRef.current) {
        reverbRef.current.dispose()
      }
    }
  }, [])

  const playNote = (note: string, octave: number, pedalPositions: PedalPositions) => {
    if (!synthRef.current) return

    const { frequency } = applyPedalToNote(note, octave, pedalPositions)
    
    // Play the note with slight randomization for more natural sound
    const velocity = 0.7 + Math.random() * 0.3
    synthRef.current.triggerAttackRelease(frequency, '8n', undefined, velocity)
  }

  const playGlissando = (notes: Array<{note: string, octave: number}>, pedalPositions: PedalPositions) => {
    if (!synthRef.current || notes.length === 0) return

    const now = Tone.now()
    const timePerNote = 0.05 // 50ms between notes

    notes.forEach((note, index) => {
      const { frequency } = applyPedalToNote(note.note, note.octave, pedalPositions)
      const time = now + (index * timePerNote)
      const velocity = 0.6 + Math.random() * 0.2
      
      synthRef.current!.triggerAttackRelease(frequency, '4n', time, velocity)
    })
  }

  return {
    playNote,
    playGlissando
  }
}