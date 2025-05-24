export type PedalPosition = 'flat' | 'natural' | 'sharp'
export type PedalNote = 'D' | 'C' | 'B' | 'E' | 'F' | 'G' | 'A'

export interface PedalPositions {
  D: PedalPosition
  C: PedalPosition
  B: PedalPosition
  E: PedalPosition
  F: PedalPosition
  G: PedalPosition
  A: PedalPosition
}

export interface HarpString {
  note: string
  octave: number
  frequency: number
  color: 'red' | 'navy' | 'neutral'
  position: number
}

export interface GlissandoPreset {
  name: string
  pedals: PedalPositions
  description?: string
}