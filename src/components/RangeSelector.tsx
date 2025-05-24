import './RangeSelector.css'
import { HarpRange, getRangeDescription } from '../utils/musicTheory'

interface RangeSelectorProps {
  currentRange: HarpRange
  onRangeChange: (range: HarpRange) => void
}

const ranges: HarpRange[] = ['full', 'upper', 'middle', 'lower', 'compact']

function RangeSelector({ currentRange, onRangeChange }: RangeSelectorProps) {
  const currentIndex = ranges.indexOf(currentRange)
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onRangeChange(ranges[currentIndex - 1])
    }
  }
  
  const handleNext = () => {
    if (currentIndex < ranges.length - 1) {
      onRangeChange(ranges[currentIndex + 1])
    }
  }
  
  return (
    <div className="range-selector">
      <label>String Range:</label>
      <div className="range-controls">
        <button 
          className="range-nav-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Previous range"
        >
          ←
        </button>
        <select 
          value={currentRange} 
          onChange={(e) => onRangeChange(e.target.value as HarpRange)}
          className="range-dropdown"
        >
          {ranges.map(range => (
            <option key={range} value={range}>
              {getRangeDescription(range)}
            </option>
          ))}
        </select>
        <button 
          className="range-nav-btn"
          onClick={handleNext}
          disabled={currentIndex === ranges.length - 1}
          aria-label="Next range"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default RangeSelector