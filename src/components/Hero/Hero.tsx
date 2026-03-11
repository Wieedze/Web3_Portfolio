import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-white/70 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Meet me at EthCC[9] — Cannes
        </span>

        <a
          href="https://app.ens.domains/wieedze.eth"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white">
            wieedze<span className="text-white/40">.eth</span>
          </h1>
        </a>

        <p className="max-w-lg text-lg text-white/50">
          Building verifiable identity & Web3 tooling on Intuition
        </p>

        <div className="flex gap-4 mt-4">
          <a
            href="https://github.com/Wieedze"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            GitHub
          </a>
          <a
            href="https://x.com/0xSofia3"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            𝕏
          </a>
        </div>
      </motion.div>
    </section>
  )
}
