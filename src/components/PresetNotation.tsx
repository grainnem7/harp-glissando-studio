import React, { useEffect, useRef } from 'react'
import { PedalPositions } from '../types'
import './PresetNotation.css'

interface PresetNotationProps {
  pedals: PedalPositions
  compact?: boolean
}

const PresetNotation: React.FC<PresetNotationProps> = ({ pedals, compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    // Set actual size in memory
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    // Scale context to match device pixel ratio
    ctx.scale(dpr, dpr)
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Set up drawing properties
    ctx.strokeStyle = compact ? '#999' : '#e0e0e0'
    ctx.fillStyle = compact ? '#999' : '#e0e0e0'
    ctx.lineWidth = compact ? 1 : 1.5

    const staffTop = compact ? 15 : 25
    const staffLineSpacing = compact ? 6 : 10
    const noteSpacing = compact ? 30 : (rect.width - 80) / 7
    const leftMargin = compact ? 25 : 40

    // Draw staff lines
    for (let i = 0; i < 5; i++) {
      const y = staffTop + (i * staffLineSpacing)
      ctx.beginPath()
      ctx.moveTo(leftMargin - 10, y)
      ctx.lineTo(rect.width - 10, y)
      ctx.stroke()
    }

    // Draw treble clef
    ctx.font = compact ? '28px serif' : '40px serif'
    ctx.fillText('𝄞', leftMargin - 20, staffTop + (compact ? 20 : 25))

    // Get scale notes
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    const notePositions: { [key: string]: number } = {
      'C': 5, 'D': 4.5, 'E': 4, 'F': 3.5, 'G': 3, 'A': 2.5, 'B': 2
    }

    // Store note positions for letter alignment
    const noteXPositions: number[] = []

    // Draw notes
    notes.forEach((note, index) => {
      const x = leftMargin + 15 + (index * noteSpacing)
      noteXPositions.push(x)
      const position = pedals[note as keyof PedalPositions]
      
      // Calculate y position
      let yPos = notePositions[note] || 3
      const y = staffTop + (yPos * staffLineSpacing)

      // Draw accidental if needed
      if (position !== 'natural') {
        ctx.font = compact ? '16px sans-serif' : '20px sans-serif'
        const accidental = position === 'sharp' ? '♯' : '♭'
        ctx.fillText(accidental, x - (compact ? 15 : 20), y + 5)
      }

      // Draw note head
      const noteSize = compact ? 5 : 7
      ctx.beginPath()
      ctx.ellipse(x, y, noteSize, noteSize * 0.7, -20 * Math.PI / 180, 0, 2 * Math.PI)
      ctx.fill()

      // Draw ledger lines if needed
      if (yPos >= 5) {
        for (let i = 5; i <= Math.floor(yPos); i++) {
          const ledgerY = staffTop + (i * staffLineSpacing)
          ctx.beginPath()
          ctx.moveTo(x - 10, ledgerY)
          ctx.lineTo(x + 10, ledgerY)
          ctx.stroke()
        }
      }
    })

    // Draw note letters aligned below
    ctx.font = compact ? '11px sans-serif' : '14px sans-serif'
    ctx.textAlign = 'center'
    const letterY = staffTop + (6 * staffLineSpacing) + (compact ? 10 : 15)
    
    notes.forEach((note, index) => {
      const position = pedals[note as keyof PedalPositions]
      let displayNote = note
      if (position === 'sharp') displayNote += '♯'
      else if (position === 'flat') displayNote += '♭'
      
      ctx.fillText(displayNote, noteXPositions[index], letterY)
    })

  }, [pedals, compact])

  return (
    <canvas 
      ref={canvasRef} 
      width={compact ? 250 : 450} 
      height={compact ? 70 : 100}
      className={`preset-notation-canvas ${compact ? 'compact' : ''}`}
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

export default PresetNotation