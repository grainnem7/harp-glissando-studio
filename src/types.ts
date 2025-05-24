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

// Lever Harp Types
export type HarpMode = 'pedal' | 'lever'

export interface LeverHarpString extends HarpString {
  baseNote: string
  leverEngaged: boolean
  stringIndex: number
}

export interface LeverHarpState {
  // Map of string index to lever state (true = engaged/raised)
  levers: boolean[]
}

export interface LeverHarpPreset {
  name: string
  description?: string
  // Array of lever states for each string
  leverPattern: boolean[]
}