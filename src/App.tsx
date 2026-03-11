import { useState, useEffect, lazy, Suspense } from 'react'
import PixelBlast from './components/Background/PixelBlast'
import Hero from './components/Hero/Hero'
import ProjectGrid from './components/Projects/ProjectGrid'
import Footer from './components/Footer/Footer'

const LocateAdmin = lazy(() => import('./pages/LocateAdmin'))

function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (hash === '#locate') {
    return (
      <Suspense fallback={null}>
        <LocateAdmin />
      </Suspense>
    )
  }

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

      <div className="flex flex-col items-center">
        <Hero />
        <ProjectGrid />
        <Footer />
      </div>
    </div>
  )
}

export default App
