import { GlissandoPreset } from '../types'

export type PresetCategory = 
  | 'Major Scales' 
  | 'Minor Scales' 
  | 'Dominant 7th/9th' 
  | 'Diminished 7th' 
  | 'Augmented' 
  | '6th Chords' 
  | 'Sus4 Chords' 
  | 'Whole Tone' 
  | 'Custom'

export interface CategorizedPreset extends GlissandoPreset {
  category: PresetCategory
  produces?: string
  usage?: string
}

export const presetLibrary: CategorizedPreset[] = [
  // MAJOR SCALES
  {
    name: 'C Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    description: 'All natural notes'
  },
  {
    name: 'G Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    description: 'One sharp: F♯'
  },
  {
    name: 'D Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    description: 'Two sharps: F♯, C♯'
  },
  {
    name: 'A Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    description: 'Three sharps: F♯, C♯, G♯'
  },
  {
    name: 'E Major',
    category: 'Major Scales',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    description: 'Four sharps: F♯, C♯, G♯, D♯'
  },
  {
    name: 'B Major',
    category: 'Major Scales',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'sharp' },
    description: 'Five sharps: F♯, C♯, G♯, D♯, A♯'
  },
  {
    name: 'F♯ Major',
    category: 'Major Scales',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp' },
    description: 'Six sharps: F♯, C♯, G♯, D♯, A♯, E♯'
  },
  {
    name: 'F Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    description: 'One flat: B♭'
  },
  {
    name: 'B♭ Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'natural' },
    description: 'Two flats: B♭, E♭'
  },
  {
    name: 'E♭ Major',
    category: 'Major Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    description: 'Three flats: B♭, E♭, A♭'
  },
  {
    name: 'A♭ Major',
    category: 'Major Scales',
    pedals: { D: 'flat', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    description: 'Four flats: B♭, E♭, A♭, D♭'
  },
  {
    name: 'D♭ Major',
    category: 'Major Scales',
    pedals: { D: 'flat', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'flat', A: 'flat' },
    description: 'Five flats: B♭, E♭, A♭, D♭, G♭'
  },
  {
    name: 'G♭ Major',
    category: 'Major Scales',
    pedals: { D: 'flat', C: 'flat', B: 'flat', E: 'flat', F: 'natural', G: 'flat', A: 'flat' },
    description: 'Six flats: B♭, E♭, A♭, D♭, G♭, C♭'
  },

  // MINOR SCALES
  {
    name: 'A Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    description: 'Natural minor (relative to C major)'
  },
  {
    name: 'E Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    description: 'One sharp: F♯'
  },
  {
    name: 'B Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    description: 'Two sharps: F♯, C♯'
  },
  {
    name: 'F♯ Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    description: 'Three sharps: F♯, C♯, G♯'
  },
  {
    name: 'D Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    description: 'One flat: B♭'
  },
  {
    name: 'G Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'natural' },
    description: 'Two flats: B♭, E♭'
  },
  {
    name: 'C Minor',
    category: 'Minor Scales',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    description: 'Three flats: B♭, E♭, A♭'
  },

  // DOMINANT 7TH AND 9TH CHORDS
  {
    name: 'C7/C9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'C dominant 7th chord',
    usage: 'Jazz, blues progressions'
  },
  {
    name: 'C♯7',
    category: 'Dominant 7th/9th',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'C♯ dominant 7th chord'
  },
  {
    name: 'D♭7/D♭9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'flat', C: 'natural', B: 'natural', E: 'flat', F: 'natural', G: 'flat', A: 'flat' },
    produces: 'D♭ dominant 7th chord'
  },
  {
    name: 'D7/D9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'D dominant 7th chord'
  },
  {
    name: 'E♭7/E♭9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'E♭ dominant 7th chord'
  },
  {
    name: 'E7',
    category: 'Dominant 7th/9th',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    produces: 'E dominant 7th chord'
  },
  {
    name: 'F7/F9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'F dominant 7th chord'
  },
  {
    name: 'F♯7/F♯9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'F♯ dominant 7th chord'
  },
  {
    name: 'G♭7/G♭9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'flat', C: 'natural', B: 'natural', E: 'flat', F: 'flat', G: 'flat', A: 'flat' },
    produces: 'G♭ dominant 7th chord'
  },
  {
    name: 'G7/G9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'G dominant 7th chord'
  },
  {
    name: 'G♯7/G♯9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'G♯ dominant 7th chord'
  },
  {
    name: 'A♭7/A♭9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'flat', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'flat', A: 'flat' },
    produces: 'A♭ dominant 7th chord'
  },
  {
    name: 'A7/A9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    produces: 'A dominant 7th chord'
  },
  {
    name: 'B♭7/B♭9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'B♭ dominant 7th chord'
  },
  {
    name: 'B7/B9',
    category: 'Dominant 7th/9th',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'B dominant 7th chord'
  },

  // DIMINISHED 7TH CHORDS
  {
    name: 'C°7, E♭°7, F♯°7, A°7',
    category: 'Diminished 7th',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'flat', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'Four enharmonic diminished 7th chords',
    usage: 'Classical transitions, jazz passing chords'
  },
  {
    name: 'C♯°7, E°7, G°7, B♭°7',
    category: 'Diminished 7th',
    pedals: { D: 'natural', C: 'sharp', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'sharp' },
    produces: 'Four enharmonic diminished 7th chords'
  },
  {
    name: 'D°7, F°7, A♭°7, B°7',
    category: 'Diminished 7th',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'sharp', A: 'flat' },
    produces: 'Four enharmonic diminished 7th chords'
  },

  // WHOLE TONE SCALES
  {
    name: 'Whole Tone 1',
    category: 'Whole Tone',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'C-D-E-F♯-G♯-A♯ whole tone scale',
    usage: 'Impressionist music, dreamy effects'
  },
  {
    name: 'Whole Tone 2',
    category: 'Whole Tone',
    pedals: { D: 'flat', C: 'sharp', B: 'natural', E: 'flat', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'C♯-D♯-F-G-A-B whole tone scale',
    usage: 'Impressionist music, dreamy effects'
  },

  // AUGMENTED CHORDS
  {
    name: 'C aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'sharp', A: 'natural' },
    produces: 'C augmented triad'
  },
  {
    name: 'D♭ aug',
    category: 'Augmented',
    pedals: { D: 'flat', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'D♭ augmented triad'
  },
  {
    name: 'D aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'D augmented triad'
  },
  {
    name: 'E♭ aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'flat', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'E♭ augmented triad'
  },
  {
    name: 'E aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'sharp', E: 'natural', F: 'natural', G: 'sharp', A: 'natural' },
    produces: 'E augmented triad'
  },
  {
    name: 'F aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'F augmented triad'
  },
  {
    name: 'G♭ aug',
    category: 'Augmented',
    pedals: { D: 'flat', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'flat', A: 'natural' },
    produces: 'G♭ augmented triad'
  },
  {
    name: 'G aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'G augmented triad'
  },
  {
    name: 'A♭ aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'A♭ augmented triad'
  },
  {
    name: 'A aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'sharp', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'A augmented triad'
  },
  {
    name: 'B♭ aug',
    category: 'Augmented',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'B♭ augmented triad'
  },
  {
    name: 'B aug',
    category: 'Augmented',
    pedals: { D: 'sharp', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'B augmented triad'
  },

  // 6TH CHORDS (QUICK REFERENCE GLISSANDI)
  {
    name: 'C6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'A minor 7',
    usage: 'Creates flowing glissando effect'
  },
  {
    name: 'C♯6/D♭6 (Option 1)',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'A♯ minor 7 / B♭ minor 7'
  },
  {
    name: 'C♯6/D♭6 (Option 2)',
    category: '6th Chords',
    pedals: { D: 'flat', C: 'natural', B: 'flat', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'G♯ sus4 / A♭ sus4'
  },
  {
    name: 'D6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'B minor 7'
  },
  {
    name: 'D♯6/E♭6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'flat', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'C minor 7'
  },
  {
    name: 'E6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    produces: 'C♯ minor 7 / D♭ minor 7'
  },
  {
    name: 'F6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'D minor 7'
  },
  {
    name: 'F♯6/G♭6 (Option 1)',
    category: '6th Chords',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'sharp', F: 'sharp', G: 'sharp', A: 'sharp' },
    produces: 'D♯ minor 7 / E♭ minor 7'
  },
  {
    name: 'G6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'sharp', G: 'natural', A: 'natural' },
    produces: 'E minor 7'
  },
  {
    name: 'G♯6/A♭6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'natural', E: 'natural', F: 'natural', G: 'natural', A: 'flat' },
    produces: 'F minor 7'
  },
  {
    name: 'A6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    produces: 'F♯ minor 7 / G♭ minor 7'
  },
  {
    name: 'A♯6/B♭6',
    category: '6th Chords',
    pedals: { D: 'natural', C: 'natural', B: 'flat', E: 'natural', F: 'natural', G: 'natural', A: 'natural' },
    produces: 'G minor 7'
  },
  {
    name: 'B6',
    category: '6th Chords',
    pedals: { D: 'sharp', C: 'sharp', B: 'natural', E: 'natural', F: 'sharp', G: 'sharp', A: 'natural' },
    produces: 'G♯ minor 7 / A♭ minor 7'
  }
]

export const getPresetsByCategory = (category: PresetCategory): CategorizedPreset[] => {
  return presetLibrary.filter(preset => preset.category === category)
}

export const getAllCategories = (): PresetCategory[] => {
  const categories = Array.from(new Set(presetLibrary.map(preset => preset.category)))
  return categories.sort()
}