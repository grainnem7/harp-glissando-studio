import React, { useEffect, useRef } from 'react'
import './LeverHarpDiagram.css'
import { LeverHarpString } from '../types'
import { calculateLeverHarpPitch } from '../utils/musicTheory'

interface LeverHarpDiagramProps {
  strings: LeverHarpString[]
  highlightedString?: number | null
}

const LeverHarpDiagram: React.FC<LeverHarpDiagramProps> = ({ strings, highlightedString }) => {
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
    ctx.strokeStyle = '#e0e0e0'
    ctx.fillStyle = '#e0e0e0'
    ctx.lineWidth = 1

    const leftMargin = 80
    const rightMargin = 20
    const availableWidth = rect.width - leftMargin - rightMargin
    const noteSpacing = availableWidth / strings.length
    
    // Single continuous staff
    const staffTop = 80
    const staffLineSpacing = 10
    
    // Draw continuous staff lines
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = staffTop + (i * staffLineSpacing)
      ctx.beginPath()
      ctx.moveTo(leftMargin - 10, y)
      ctx.lineTo(rect.width - rightMargin, y)
      ctx.stroke()
    }
    
    // Find middle C position to determine clef changes
    let currentClef = 'bass' // Start with bass clef
    let lastClefX = 0
    
    // Draw notes for all strings
    strings.forEach((string, stringIndex) => {
      const x = leftMargin + (stringIndex * noteSpacing) + (noteSpacing / 2)
      
      // Display chromatic sequence C2 to A6 (34 strings total)
      // This represents the chromatic progression regardless of actual tuning
      const chromaticNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
      const startOctave = 2
      const totalStrings = 34
      
      // Calculate which note and octave this string represents in chromatic sequence
      const chromaticIndex = stringIndex % 7
      const octaveOffset = Math.floor(stringIndex / 7)
      const note = chromaticNotes[chromaticIndex]
      const octave = startOctave + octaveOffset
      
      // Determine if we need a clef change at middle C (C4)
      const isMiddleC = note === 'C' && octave === 4
      if (isMiddleC && currentClef === 'bass' && x > lastClefX + 60) {
        // Switch to treble clef
        currentClef = 'treble'
        ctx.font = '30px serif'
        ctx.fillStyle = '#e0e0e0'
        ctx.fillText('𝄞', x - 30, staffTop + 25)
        lastClefX = x
      }
      
      // Draw initial bass clef if we haven't drawn any clef yet
      if (stringIndex === 0) {
        ctx.font = '30px serif'
        ctx.fillStyle = '#e0e0e0'
        ctx.fillText('𝄢', leftMargin - 60, staffTop + 25)
      }
      
      // Calculate note position on staff
      // Bass clef: G2 = top line (0), A2 = space above (0.5), B2 = ledger above (-0.5), C3 = middle line (2), etc.
      // Treble clef: E4 = bottom line (4), F4 = space above (3.5), G4 = second line (3), etc.
      
      let yPos: number
      
      if (currentClef === 'bass') {
        // Bass clef positions - F3 = middle line (position 2)
        const bassPositions: {[key: string]: number} = {
          'C': 5,    // C is two ledger lines below
          'D': 4.5,  // D is space below bottom line
          'E': 4,    // E is bottom line
          'F': 3.5,  // F is space above bottom line
          'G': 3,    // G is second line
          'A': 2.5,  // A is space above second line
          'B': 2,    // B is middle line
        }
        yPos = bassPositions[note]
        
        // Adjust for octave (going down = higher position numbers)
        const octaveDiff = 3 - octave  // Bass clef reference is octave 3
        yPos += octaveDiff * 3.5
      } else {
        // Treble clef positions - G4 = second line from bottom
        const treblePositions: {[key: string]: number} = {
          'C': 5,    // C is ledger line below staff
          'D': 4.5,  // D is space below E
          'E': 4,    // E is bottom line
          'F': 3.5,  // F is space above E
          'G': 3,    // G is second line
          'A': 2.5,  // A is space above G
          'B': 2,    // B is middle line
        }
        yPos = treblePositions[note]
        
        // Adjust for octave
        const octaveDiff = octave - 4  // Treble clef reference is octave 4
        yPos -= octaveDiff * 3.5
      }
      
      const y = staffTop + (yPos * staffLineSpacing)
      
      // Highlight if needed
      if (highlightedString === stringIndex) {
        ctx.save()
        ctx.fillStyle = 'rgba(156, 106, 222, 0.3)'
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      
      // No accidentals needed for chromatic natural note display
      
      // Draw note head
      ctx.save()
      ctx.fillStyle = highlightedString === stringIndex ? '#9c6ade' : '#e0e0e0'
      ctx.beginPath()
      ctx.ellipse(x, y, 5, 3.5, -20 * Math.PI / 180, 0, 2 * Math.PI)
      ctx.fill()
      ctx.restore()
      
      // Draw stem
      ctx.strokeStyle = highlightedString === stringIndex ? '#9c6ade' : '#e0e0e0'
      ctx.beginPath()
      if (yPos <= 2.5) {
        // Stem down for high notes
        ctx.moveTo(x - 5, y)
        ctx.lineTo(x - 5, y + 25)
      } else {
        // Stem up for low notes
        ctx.moveTo(x + 5, y)
        ctx.lineTo(x + 5, y - 25)
      }
      ctx.stroke()
      
      // Draw ledger lines if needed
      ctx.strokeStyle = '#e0e0e0'
      if (yPos >= 5) {
        // Ledger lines below staff
        for (let i = 5; i <= Math.floor(yPos); i++) {
          if (i % 1 === 0) { // Only draw on whole line positions
            const ledgerY = staffTop + (i * staffLineSpacing)
            ctx.beginPath()
            ctx.moveTo(x - 8, ledgerY)
            ctx.lineTo(x + 8, ledgerY)
            ctx.stroke()
          }
        }
      } else if (yPos <= 0) {
        // Ledger lines above staff
        for (let i = 0; i >= Math.ceil(yPos); i--) {
          if (i % 1 === 0) { // Only draw on whole line positions
            const ledgerY = staffTop + (i * staffLineSpacing)
            ctx.beginPath()
            ctx.moveTo(x - 8, ledgerY)
            ctx.lineTo(x + 8, ledgerY)
            ctx.stroke()
          }
        }
      }
      
      // Draw string number below staff
      ctx.save()
      ctx.font = '8px sans-serif'
      ctx.fillStyle = '#666'
      ctx.textAlign = 'center'
      ctx.fillText(`${stringIndex + 1}`, x, staffTop + 70)
      ctx.restore()
    })
    
    // Draw title
    ctx.save()
    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.textAlign = 'center'
    ctx.fillText('Lever Harp Range (34 strings)', rect.width / 2, 20)
    ctx.restore()
    
  }, [strings, highlightedString])

  return (
    <div className="lever-harp-diagram">
      <canvas 
        ref={canvasRef}
        className="lever-diagram-canvas"
        style={{ width: '100%', height: window.innerWidth >= 769 ? '250px' : '400px' }}
      />
    </div>
  )
}

export default LeverHarpDiagram