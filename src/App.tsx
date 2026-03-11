import PixelBlast from './components/Background/PixelBlast'

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

      <h1 className="text-4xl text-white text-center pt-20">Portfolio</h1>
    </div>
  )
}

export default App
