import { HarpString, PedalPositions, LeverHarpString } from '../types'

const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const frequencies: { [key: string]: number } = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83,
  'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65,
  'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91,
  'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83,
  'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
  'C8': 4186.01
}

export type HarpRange = 'full' | 'upper' | 'middle' | 'lower' | 'compact'

export function generateHarpStrings(range: HarpRange = 'full'): HarpString[] {
  const strings: HarpString[] = []
  
  let startOctave: number
  let endOctave: number
  let endNotes: string[]
  
  switch (range) {
    case 'upper':
      startOctave = 4
      endOctave = 7
      endNotes = ['C', 'D', 'E', 'F', 'G']
      break
    case 'middle':
      startOctave = 2
      endOctave = 5
      endNotes = noteOrder
      break
    case 'lower':
      startOctave = 1
      endOctave = 4
      endNotes = noteOrder
      break
    case 'compact':
      startOctave = 3
      endOctave = 4
      endNotes = noteOrder
      break
    case 'full':
    default:
      startOctave = 1
      endOctave = 7
      endNotes = ['C', 'D', 'E', 'F', 'G']
  }
  
  let position = 0
  
  for (let octave = startOctave; octave <= endOctave; octave++) {
    const notes = octave === endOctave ? endNotes : noteOrder
    
    for (const note of notes) {
      const color = note === 'C' ? 'red' : note === 'F' ? 'navy' : 'neutral'
      const frequency = frequencies[`${note}${octave}`] || 440
      
      strings.push({
        note,
        octave,
        frequency,
        color,
        position
      })
      
      position++
    }
  }
  
  return strings
}

export function getRangeDescription(range: HarpRange): string {
  switch (range) {
    case 'full': return 'Full Harp (47 strings)'
    case 'upper': return 'Upper Range (C4-G7)'
    case 'middle': return 'Middle Range (C2-B5)'
    case 'lower': return 'Lower Range (C1-B4)'
    case 'compact': return 'Compact (C3-B4)'
    default: return 'Full Harp'
  }
}

export function applyPedalToNote(note: string, octave: number, pedalPositions: PedalPositions): { note: string, frequency: number } {
  const pedalPosition = pedalPositions[note as keyof PedalPositions]
  if (!pedalPosition) return { note, frequency: frequencies[`${note}${octave}`] || 440 }
  
  let modifiedNote = note
  let frequencyKey = `${note}${octave}`
  
  switch (pedalPosition) {
    case 'flat':
      modifiedNote = note + '♭'
      // Handle special cases and convert to frequency lookup
      if (note === 'C') {
        // C♭ = B
        frequencyKey = `B${octave - 1}`
      } else if (note === 'F') {
        // F♭ = E
        frequencyKey = `E${octave}`
      } else {
        // Convert to sharp equivalent for frequency lookup
        const flatToSharp: { [key: string]: string } = {
          'D': 'C#', 'E': 'D#', 'G': 'F#', 'A': 'G#', 'B': 'A#'
        }
        const sharpNote = flatToSharp[note]
        if (sharpNote) {
          frequencyKey = `${sharpNote}${octave}`
        }
      }
      break
    case 'sharp':
      modifiedNote = note + '♯'
      // Handle special cases
      if (note === 'B') {
        // B♯ = C
        frequencyKey = `C${octave + 1}`
      } else if (note === 'E') {
        // E♯ = F
        frequencyKey = `F${octave}`
      } else {
        frequencyKey = `${note}#${octave}`
      }
      break
    case 'natural':
    default:
      modifiedNote = note
      frequencyKey = `${note}${octave}`
  }
  
  const frequency = frequencies[frequencyKey] || frequencies[`${note}${octave}`] || 440
  
  return { note: modifiedNote, frequency }
}

export function getScaleFromPedals(pedalPositions: PedalPositions): string[] {
  const scale: string[] = []
  
  for (const note of noteOrder) {
    const position = pedalPositions[note as keyof PedalPositions]
    switch (position) {
      case 'flat':
        scale.push(`${note}♭`)
        break
      case 'sharp':
        scale.push(`${note}♯`)
        break
      default:
        scale.push(note)
    }
  }
  
  return scale
}

// Lever Harp Functions
export function generateLeverHarpStrings(): LeverHarpString[] {
  const strings: LeverHarpString[] = []
  
  // Standard 34-string lever harp tuning in E♭ major
  // Starting from C2 to A6
  const leverHarpTuning = [
    { note: 'C', octave: 2 },
    { note: 'D', octave: 2 },
    { note: 'E', octave: 2, flat: true }, // E♭
    { note: 'F', octave: 2 },
    { note: 'G', octave: 2 },
    { note: 'A', octave: 2, flat: true }, // A♭
    { note: 'B', octave: 2, flat: true }, // B♭
    // Continue pattern for all octaves
  ]
  
  // Generate all 34 strings from C2 to A6
  let stringIndex = 0
  for (let octave = 2; octave <= 6; octave++) {
    const notes = octave === 6 ? ['C', 'D', 'E', 'F', 'G', 'A'] : noteOrder
    
    for (const note of notes) {
      // In E♭ major tuning, E, A, and B are flat
      const isFlat = ['E', 'A', 'B'].includes(note)
      const baseNote = isFlat ? `${note}b` : note
      const color = note === 'C' ? 'red' : note === 'F' ? 'navy' : 'neutral'
      
      // Calculate base frequency (with flat if needed)
      let frequencyKey = `${note}${octave}`
      if (isFlat) {
        if (note === 'E') {
          frequencyKey = `D#${octave}`
        } else if (note === 'A') {
          frequencyKey = `G#${octave}`
        } else if (note === 'B') {
          frequencyKey = `A#${octave}`
        }
      }
      
      const baseFrequency = frequencies[frequencyKey] || 440
      
      strings.push({
        note: baseNote,
        baseNote: baseNote,
        octave,
        frequency: baseFrequency,
        color,
        position: stringIndex,
        leverEngaged: false,
        stringIndex
      })
      
      stringIndex++
      
      // Stop at A6 (34 strings total)
      if (octave === 6 && note === 'A') break
    }
  }
  
  return strings
}

export function calculateLeverHarpPitch(string: LeverHarpString): { note: string, frequency: number } {
  if (string.leverEngaged) {
    // Raise by one semitone
    const baseKey = string.baseNote.includes('b') 
      ? string.baseNote.replace('b', '') 
      : string.baseNote
    
    let raisedNote = string.baseNote
    let frequencyKey = ''
    
    // Handle special cases when raising flats
    if (string.baseNote.includes('b')) {
      // E♭ -> E♮, A♭ -> A♮, B♭ -> B♮
      raisedNote = baseKey
      frequencyKey = `${baseKey}${string.octave}`
    } else {
      // Natural notes get raised to sharps
      if (baseKey === 'B') {
        raisedNote = 'C'
        frequencyKey = `C${string.octave + 1}`
      } else if (baseKey === 'E') {
        raisedNote = 'F'
        frequencyKey = `F${string.octave}`
      } else {
        raisedNote = `${baseKey}#`
        frequencyKey = `${baseKey}#${string.octave}`
      }
    }
    
    const frequency = frequencies[frequencyKey] || string.frequency * Math.pow(2, 1/12)
    return { note: raisedNote, frequency }
  }
  
  return { note: string.baseNote, frequency: string.frequency }
}

// All possible major and minor scales for lever harp
export const leverHarpScales = [
  // Major scales (possible with lever harp)
  {
    name: 'E♭ Major',
    description: 'Standard tuning (no levers)',
    leverPattern: new Array(34).fill(false),
    type: 'major'
  },
  {
    name: 'B♭ Major',
    description: 'Raise A levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A strings (A♭ to A♮)
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (note === 'A') pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'F Major',
    description: 'Raise A and E levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A and E strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'E'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'C Major',
    description: 'Raise A, B, and E levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, and E strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'E'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'G Major',
    description: 'Raise A, B, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'D Major',
    description: 'Raise A, B, C, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, C, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'C', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'A Major',
    description: 'Raise A, B, C, D, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, C, D, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'C', 'D', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  {
    name: 'E Major',
    description: 'Raise all levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise all strings
      for (let i = 0; i < 34; i++) {
        pattern[i] = true
      }
      return pattern
    })(),
    type: 'major'
  },
  
  // Minor scales (possible with lever harp)
  {
    name: 'C Minor',
    description: 'No levers needed',
    leverPattern: new Array(34).fill(false),
    type: 'minor'
  },
  {
    name: 'G Minor',
    description: 'Raise A lever',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (note === 'A') pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  },
  {
    name: 'D Minor',
    description: 'Raise A and E levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A and E strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'E'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  },
  {
    name: 'A Minor',
    description: 'Raise A, B, and E levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, and E strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'E'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  },
  {
    name: 'E Minor',
    description: 'Raise A, B, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  },
  {
    name: 'B Minor',
    description: 'Raise A, B, C, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, C, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'C', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  },
  {
    name: 'F♯ Minor',
    description: 'Raise A, B, C, D, E, and F levers',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Raise A, B, C, D, E, and F strings
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['A', 'B', 'C', 'D', 'E', 'F'].includes(note)) pattern[i] = true
      }
      return pattern
    })(),
    type: 'minor'
  }
]

// Original presets for backward compatibility
export const leverHarpPresets = [
  {
    name: 'E♭ Major',
    description: 'Standard lever harp tuning',
    leverPattern: new Array(34).fill(false) // All levers down
  },
  {
    name: 'C Major',
    description: 'All naturals',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Engage levers for E, A, and B strings to make them natural
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['E', 'A', 'B'].includes(note)) {
          pattern[i] = true
        }
      }
      return pattern
    })()
  },
  {
    name: 'G Major',
    description: 'One sharp (F#)',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Engage levers for E, A, B (to natural) and F (to sharp)
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['E', 'A', 'B', 'F'].includes(note)) {
          pattern[i] = true
        }
      }
      return pattern
    })()
  },
  {
    name: 'D Major',
    description: 'Two sharps (F#, C#)',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Engage levers for E, A, B (to natural) and F, C (to sharp)
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['E', 'A', 'B', 'F', 'C'].includes(note)) {
          pattern[i] = true
        }
      }
      return pattern
    })()
  },
  {
    name: 'A♭ Major',
    description: 'Four flats',
    leverPattern: new Array(34).fill(false) // E♭, A♭, B♭ already flat, D♭ not possible
  },
  {
    name: 'C Pentatonic',
    description: 'C D E G A',
    leverPattern: (() => {
      const pattern = new Array(34).fill(false)
      // Engage E, A, B to natural
      for (let i = 0; i < 34; i++) {
        const noteIndex = i % 7
        const note = noteOrder[noteIndex]
        if (['E', 'A', 'B'].includes(note)) {
          pattern[i] = true
        }
      }
      return pattern
    })()
  }
]