import PixelBlast from './components/Background/PixelBlast'
import Hero from './components/Hero/Hero'
import ProjectGrid from './components/Projects/ProjectGrid'

function App() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10">
        <PixelBlast
          pixelSize={1}
          color="#ffffff"
          pixelSizeJitter={0.1}
          speed={1}
          edgeFade={0.5}
          enableRipples={false}
          patternDensity={0.85}
        />
      </div>

      <Hero />
      <ProjectGrid />
    </div>
  )
}

export default App
