import React, { useEffect, useRef, useState } from 'react'
import { PedalPositions, PedalNote, PedalPosition } from '../types'
import './ScaleDisplay.css'

interface ScaleDisplayProps {
  pedalPositions: PedalPositions
  onPedalChange?: (pedal: PedalNote, position: PedalPosition) => void
  presetName?: string
}

const ScaleDisplay: React.FC<ScaleDisplayProps> = ({ pedalPositions, onPedalChange, presetName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNote, setHoveredNote] = useState<string | null>(null)
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null)
  const previousPedalsRef = useRef<PedalPositions>(pedalPositions)
  
  // Store click regions for each note
  const noteRegions = useRef<{ note: string; x: number; y: number; width: number; height: number }[]>([])

  // Detect pedal changes and highlight the changed note
  useEffect(() => {
    const changedPedal = Object.keys(pedalPositions).find(
      key => pedalPositions[key as PedalNote] !== previousPedalsRef.current[key as PedalNote]
    ) as PedalNote | undefined
    
    if (changedPedal) {
      setHighlightedNote(changedPedal)
      previousPedalsRef.current = { ...pedalPositions }
      
      // Clear highlight after 1 second
      const timer = setTimeout(() => {
        setHighlightedNote(null)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [pedalPositions])

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
    const staffTop = isMobile ? 45 : 50
    const staffLineSpacing = isMobile ? 14 : 14
    const noteSpacing = isMobile ? (rect.width - 80) / 7 : 70
    const leftMargin = isMobile ? 50 : 60

    // Draw staff lines
    for (let i = 0; i < 5; i++) {
      const y = staffTop + (i * staffLineSpacing)
      ctx.beginPath()
      ctx.moveTo(leftMargin - 10, y)
      ctx.lineTo(rect.width - 20, y)
      ctx.stroke()
    }

    // Draw treble clef (simplified)
    ctx.font = isMobile ? '50px serif' : '55px serif'
    ctx.fillText('𝄞', leftMargin - 45, staffTop + (isMobile ? 35 : 35))

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
      const regionSize = isMobile ? 30 : 35
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

      // Highlight if this note was changed
      if (highlightedNote === note) {
        // Draw soft glow effect
        ctx.save()
        ctx.shadowColor = '#9c6ade'
        ctx.shadowBlur = 20
        ctx.fillStyle = 'rgba(156, 106, 222, 0.2)'
        ctx.beginPath()
        ctx.arc(x, y, 18, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw accidental first if needed (with more space)
      if (position !== 'natural') {
        ctx.save()
        if (highlightedNote === note) {
          ctx.fillStyle = '#9c6ade'
          ctx.font = isMobile ? 'bold 22px sans-serif' : 'bold 24px sans-serif'
        } else {
          ctx.fillStyle = '#e0e0e0'
          ctx.font = isMobile ? '22px sans-serif' : '24px sans-serif'
        }
        const accidental = position === 'sharp' ? '♯' : '♭'
        const accidentalX = x - (isMobile ? 25 : 30)
        ctx.fillText(accidental, accidentalX, y + 5)
        ctx.restore()
      }

      // Draw note head
      const noteSize = isMobile ? 8 : 9
      ctx.save()
      ctx.fillStyle = '#e0e0e0'
      ctx.beginPath()
      ctx.ellipse(x, y, noteSize, noteSize * 0.7, -20 * Math.PI / 180, 0, 2 * Math.PI)
      ctx.fill()
      ctx.restore()

      // Draw stem
      ctx.beginPath()
      ctx.moveTo(x + noteSize, y)
      ctx.lineTo(x + noteSize, y - (isMobile ? 40 : 45))
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

  }, [pedalPositions, hoveredNote, highlightedNote])

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
        width={600} 
        height={180}
        className="scale-canvas"
        style={{ width: '100%', height: 'auto' }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredNote(null)}
      />
      {presetName && <div className="preset-name-display">{presetName}</div>}
    </div>
  )
}

export default ScaleDisplay