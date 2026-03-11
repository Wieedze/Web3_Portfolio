import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import useENS from '../../hooks/useENS'
import { onLocationChange } from '../../lib/firebase'

const LiveLocationModal = lazy(() => import('../LiveLocation/LiveLocationModal'))

export default function Hero() {
  const ens = useENS('wieedze.eth')
  const [showMap, setShowMap] = useState(false)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const unsubscribe = onLocationChange((data) => {
      setIsLive(data !== null && Date.now() - data.timestamp < 30 * 60 * 1000)
    })
    return () => unsubscribe()
  }, [])

  return (
    <section className="w-full max-w-6xl flex flex-col items-center justify-center pt-24 pb-12 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col items-center gap-6"
      >
        <button
          onClick={() => setShowMap(true)}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-[#111111]/90 text-sm text-white/70 hover:bg-[#161616]/90 hover:border-white/20 transition-all cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          {isLive ? 'Meet me at EthCC — Cannes' : 'Currently offline — EthCC Cannes'}
        </button>

        <a
          href="https://app.ens.domains/wieedze.eth"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-[#111111]/90 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
          >
            {ens.loading ? (
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-white/5 animate-pulse shrink-0" />
            ) : ens.avatar ? (
              <img
                src={ens.avatar}
                alt={ens.name}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-white/5 shrink-0 flex items-center justify-center text-4xl text-white/20">
                ?
              </div>
            )}

            <div className="flex flex-col gap-3 text-center sm:text-left">
              {ens.loading ? (
                <>
                  <div className="h-12 w-48 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-6 w-64 bg-white/5 rounded-lg animate-pulse" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white break-all">
                    {ens.name}
                  </h1>
                  <p className="text-lg text-white/40">
                    Every action leaves a record.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </a>
      </motion.div>

      {showMap && (
        <Suspense fallback={null}>
          <LiveLocationModal onClose={() => setShowMap(false)} />
        </Suspense>
      )}
    </section>
  )
}
