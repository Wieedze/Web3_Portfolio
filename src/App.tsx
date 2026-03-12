import { useState, useEffect, lazy, Suspense } from 'react'
import PixelBlast from './components/Background/PixelBlast'
import Hero from './components/Hero/Hero'
import ProjectGrid from './components/Projects/ProjectGrid'
import Footer from './components/Footer/Footer'

const LocateAdmin = lazy(() => import('./pages/LocateAdmin'))
const ConnectPage = lazy(() => import('./pages/ConnectPage'))
const QRPage = lazy(() => import('./pages/QRPage'))

function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

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

      {hash === '#locate' ? (
        <Suspense fallback={null}>
          <LocateAdmin />
        </Suspense>
      ) : hash === '#connect' ? (
        <Suspense fallback={null}>
          <ConnectPage />
        </Suspense>
      ) : hash === '#qr' ? (
        <Suspense fallback={null}>
          <QRPage />
        </Suspense>
      ) : (
        <div className="flex flex-col items-center">
          <nav className="w-full max-w-3xl mx-auto flex justify-end gap-3 px-6 pt-6">
            <a
              href="#connect"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              Connect
            </a>
            <a
              href="#locate"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              Locate
            </a>
            <a
              href="#qr"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
            >
              QR
            </a>
          </nav>
          <Hero />
          <ProjectGrid />
          <Footer />
        </div>
      )}
    </div>
  )
}

export default App
