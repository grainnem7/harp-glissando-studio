import { GlissandoPreset } from '../types'

export const presetLibrary: GlissandoPreset[] = [
  {
    name: 'C Major',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'natural',
      E: 'natural',
      F: 'natural',
      G: 'natural',
      A: 'natural'
    },
    description: 'All white keys'
  },
  {
    name: 'G Major',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'D Major',
    pedals: {
      D: 'natural',
      C: 'sharp',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'A Major',
    pedals: {
      D: 'natural',
      C: 'sharp',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'sharp',
      A: 'natural'
    }
  },
  {
    name: 'E Major',
    pedals: {
      D: 'sharp',
      C: 'sharp',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'sharp',
      A: 'natural'
    }
  },
  {
    name: 'B Major',
    pedals: {
      D: 'sharp',
      C: 'sharp',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'sharp',
      A: 'sharp'
    }
  },
  {
    name: 'F Major',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'flat',
      E: 'natural',
      F: 'natural',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'B♭ Major',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'flat',
      E: 'flat',
      F: 'natural',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'E♭ Major',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'flat',
      E: 'flat',
      F: 'natural',
      G: 'natural',
      A: 'flat'
    }
  },
  {
    name: 'A♭ Major',
    pedals: {
      D: 'flat',
      C: 'natural',
      B: 'flat',
      E: 'flat',
      F: 'natural',
      G: 'natural',
      A: 'flat'
    }
  },
  {
    name: 'D♭ Major',
    pedals: {
      D: 'flat',
      C: 'natural',
      B: 'flat',
      E: 'flat',
      F: 'natural',
      G: 'flat',
      A: 'flat'
    }
  },
  {
    name: 'G♭ Major',
    pedals: {
      D: 'flat',
      C: 'flat',
      B: 'flat',
      E: 'flat',
      F: 'natural',
      G: 'flat',
      A: 'flat'
    }
  },
  {
    name: 'C♭ Major',
    pedals: {
      D: 'flat',
      C: 'flat',
      B: 'flat',
      E: 'flat',
      F: 'flat',
      G: 'flat',
      A: 'flat'
    }
  },
  {
    name: 'A Minor',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'natural',
      E: 'natural',
      F: 'natural',
      G: 'natural',
      A: 'natural'
    },
    description: 'Natural minor'
  },
  {
    name: 'E Minor',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'natural',
      E: 'natural',
      F: 'sharp',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'D Minor',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'flat',
      E: 'natural',
      F: 'natural',
      G: 'natural',
      A: 'natural'
    }
  },
  {
    name: 'Whole Tone (C)',
    pedals: {
      D: 'natural',
      C: 'natural',
      B: 'flat',
      E: 'natural',
      F: 'sharp',
      G: 'sharp',
      A: 'flat'
    },
    description: 'Whole tone scale starting on C'
  },
  {
    name: 'Diminished (C)',
    pedals: {
      D: 'flat',
      C: 'natural',
      B: 'natural',
      E: 'flat',
      F: 'sharp',
      G: 'flat',
      A: 'natural'
    },
    description: 'Octatonic scale'
  },
  {
    name: 'Chromatic Cluster',
    pedals: {
      D: 'sharp',
      C: 'sharp',
      B: 'natural',
      E: 'flat',
      F: 'sharp',
      G: 'flat',
      A: 'flat'
    },
    description: 'Creates chromatic clusters'
  }
]