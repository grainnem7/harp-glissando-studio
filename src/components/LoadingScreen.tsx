import './LoadingScreen.css'

interface LoadingScreenProps {
  isLoading: boolean
  message?: string
}

function LoadingScreen({ isLoading, message = "Initializing Audio..." }: LoadingScreenProps) {
  if (!isLoading) return null

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="harp-icon">
          <div className="harp-strings">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className="loading-string"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        <h2>Harp Glissando Studio</h2>
        <p>{message}</p>
        <div className="loading-spinner">
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
        <p className="loading-hint">Tap anywhere to begin</p>
      </div>
    </div>
  )
}

export default LoadingScreen