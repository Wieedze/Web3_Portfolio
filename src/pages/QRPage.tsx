import { QRCodeSVG } from 'qrcode.react'
import useENS from '../hooks/useENS'

const CONNECT_URL = 'https://wieedze.github.io/Web3_Portfolio/#connect'

export default function QRPage() {
  const ens = useENS('wieedze.eth')

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <a
        href="#"
        className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
      >
        &larr; Back
      </a>
      <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center rounded-2xl bg-black/60 backdrop-blur-md p-8 border border-white/5">
        {ens.avatar ? (
          <img
            src={ens.avatar}
            alt={ens.name}
            className="w-16 h-16 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white/40">
            W
          </div>
        )}
        <h1 className="text-2xl font-bold text-white">Connect with me</h1>
        <p className="text-white/40 text-sm leading-relaxed">
          Scan to get on-chain proof that you met wieedze.eth at EthCC
        </p>
        <div className="rounded-2xl bg-white p-4">
          <QRCodeSVG
            value={CONNECT_URL}
            size={220}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <p className="text-white/20 text-xs font-mono break-all">{CONNECT_URL}</p>
      </div>
    </div>
  )
}
