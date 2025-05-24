import React, { useEffect, useRef, useState } from 'react'
import { PedalPositions, PedalNote, PedalPosition } from '../types'
import './ScaleDisplay.css'

interface ScaleDisplayProps {
  pedalPositions: PedalPositions
  onPedalChange?: (pedal: PedalNote, position: PedalPosition) => void
}

const ScaleDisplay: React.FC<ScaleDisplayProps> = ({ pedalPositions, onPedalChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)
  
  // Store click regions for each note
  const noteRegions = useRef<{ note: string; x: number; y: number; width: number; height: number }[]>([])

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
    ctx.lineWidth = 1.5

    const isMobile = window.innerWidth < 768
    const staffTop = isMobile ? 45 : 30
    const staffLineSpacing = isMobile ? 14 : 10
    const noteSpacing = isMobile ? (rect.width - 80) / 7 : 50
    const leftMargin = isMobile ? 50 : 40

    // Draw staff lines
    for (let i = 0; i < 5; i++) {
      const y = staffTop + (i * staffLineSpacing)
      ctx.beginPath()
      ctx.moveTo(leftMargin - 10, y)
      ctx.lineTo(rect.width - 20, y)
      ctx.stroke()
    }

    // Draw treble clef (simplified)
    ctx.font = isMobile ? '50px serif' : '40px serif'
    ctx.fillText('𝄞', leftMargin - 35, staffTop + (isMobile ? 35 : 25))

    // Get scale notes
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as PedalNote[]
    const notePositions: { [key: string]: number } = {
      'C': 5, 'D': 4.5, 'E': 4, 'F': 3.5, 'G': 3, 'A': 2.5, 'B': 2,
      'C5': 1.5, 'D5': 1, 'E5': 0.5, 'F5': 0, 'G5': -0.5, 'A5': -1, 'B5': -1.5
    }

    // Clear note regions
    noteRegions.current = []

    // Draw notes
    notes.forEach((note, index) => {
      const x = leftMargin + 25 + (index * noteSpacing)
      const position = pedalPositions[note as keyof PedalPositions]
      
      // Calculate y position
      let yPos = notePositions[note] || 3
      const y = staffTop + (yPos * staffLineSpacing)

      // Store click region
      const regionSize = isMobile ? 30 : 25
      noteRegions.current.push({
        note,
        x: x - regionSize/2,
        y: y - regionSize/2,
        width: regionSize,
        height: regionSize
      })

      // Highlight if hovered
      if (hoveredNote === note && onPedalChange) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.fillRect(x - regionSize/2, y - regionSize/2, regionSize, regionSize)
        ctx.fillStyle = '#e0e0e0'
      }

      // Draw accidental first if needed (with more space)
      if (position !== 'natural') {
        ctx.font = isMobile ? '22px sans-serif' : '18px sans-serif'
        const accidental = position === 'sharp' ? '♯' : '♭'
        const accidentalX = x - (isMobile ? 25 : 20)
        ctx.fillText(accidental, accidentalX, y + 5)
      }

      // Draw note head
      const noteSize = isMobile ? 8 : 6
      ctx.beginPath()
      ctx.ellipse(x, y, noteSize, noteSize * 0.7, -20 * Math.PI / 180, 0, 2 * Math.PI)
      ctx.fill()

      // Draw stem
      ctx.beginPath()
      ctx.moveTo(x + noteSize, y)
      ctx.lineTo(x + noteSize, y - (isMobile ? 40 : 30))
      ctx.stroke()

      // Draw ledger lines if needed
      if (yPos >= 5) {
        for (let i = 5; i <= Math.floor(yPos); i++) {
          const ledgerY = staffTop + (i * staffLineSpacing)
          ctx.beginPath()
          ctx.moveTo(x - 12, ledgerY)
          ctx.lineTo(x + 12, ledgerY)
          ctx.stroke()
        }
      }
    })

  }, [pedalPositions, hoveredNote])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPedalChange) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check which note was clicked
    for (const region of noteRegions.current) {
      if (x >= region.x && x <= region.x + region.width &&
          y >= region.y && y <= region.y + region.height) {
        const currentPosition = pedalPositions[region.note as PedalNote]
        // Cycle through positions: natural -> sharp -> flat -> natural
        let newPosition: PedalPosition = 'natural'
        if (currentPosition === 'natural') newPosition = 'sharp'
        else if (currentPosition === 'sharp') newPosition = 'flat'
        else newPosition = 'natural'
        
        onPedalChange(region.note as PedalNote, newPosition)
        break
      }
    }
  }

  const handleCanvasMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onPedalChange) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check which note is hovered
    let foundNote = false
    for (const region of noteRegions.current) {
      if (x >= region.x && x <= region.x + region.width &&
          y >= region.y && y <= region.y + region.height) {
        setHoveredNote(region.note)
        canvas.style.cursor = 'pointer'
        foundNote = true
        break
      }
    }
    
    if (!foundNote) {
      setHoveredNote(null)
      canvas.style.cursor = 'default'
    }
  }

  return (
    <div className="scale-display">
      <h3>Current Scale {onPedalChange && <span className="interactive-hint">(click notes to change)</span>}</h3>
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={140}
        className="scale-canvas"
        style={{ width: '100%', height: 'auto' }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredNote(null)}
      />
    </div>
  )
}

export default ScaleDisplay