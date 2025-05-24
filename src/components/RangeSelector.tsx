import './RangeSelector.css'
import { HarpRange, getRangeDescription } from '../utils/musicTheory'

interface RangeSelectorProps {
  currentRange: HarpRange
  onRangeChange: (range: HarpRange) => void
}

const ranges: HarpRange[] = ['full', 'upper', 'middle', 'lower', 'compact']

function RangeSelector({ currentRange, onRangeChange }: RangeSelectorProps) {
  return (
    <div className="range-selector">
      <label>String Range:</label>
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
    </div>
  )
}

export default RangeSelector