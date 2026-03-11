export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <span>Built for EthCC[9] — Cannes 2026</span>

        <div className="flex items-center gap-6">
          <a
            href="https://app.ens.domains/wieedze.eth"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            wieedze.eth
          </a>
          <a
            href="https://github.com/Wieedze"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/0xSofia3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            𝕏
          </a>
        </div>
      </div>
    </footer>
  )
}
