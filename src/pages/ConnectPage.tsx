import { useState, useCallback } from 'react'
import { BrowserProvider } from 'ethers'
import { claimConnection } from '../lib/firebase'

type Status = 'idle' | 'connecting' | 'claiming' | 'success' | 'already_claimed' | 'error'

export default function ConnectPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [address, setAddress] = useState('')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('No wallet found. Please open in MetaMask browser.')
      setStatus('error')
      return
    }

    try {
      setStatus('connecting')
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const addr = await signer.getAddress()
      setAddress(addr)

      setStatus('claiming')
      const result = await claimConnection(addr)

      if (result.alreadyClaimed) {
        setStatus('already_claimed')
      } else {
        setTxHash(result.txHash ?? '')
        setStatus('success')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      setStatus('error')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">

        {/* Idle — connect button */}
        {status === 'idle' && (
          <>
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.928-1.153a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Connect with Wieedze</h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Tap below to connect your wallet and receive on-chain proof that you met wieedze.eth at EthCC.
            </p>
            <button
              onClick={connect}
              className="w-full py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold text-lg hover:bg-white/15 transition-all"
            >
              Connect Wallet
            </button>
          </>
        )}

        {/* Connecting */}
        {status === 'connecting' && (
          <>
            <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-white/60">Connecting wallet...</p>
          </>
        )}

        {/* Claiming */}
        {status === 'claiming' && (
          <>
            <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-green-400 animate-spin" />
            <p className="text-white/60 text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
            <p className="text-white/40 text-sm">Recording on-chain connection...</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Connected on-chain!</h1>
            <p className="text-white/40 text-sm leading-relaxed">
              You received shares about your meeting with Wieedze
            </p>
            {txHash && (
              <a
                href={`https://explorer.intuition.systems/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/60 transition-colors font-mono underline"
              >
                View transaction
              </a>
            )}
          </>
        )}

        {/* Already claimed */}
        {status === 'already_claimed' && (
          <>
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Already connected</h1>
            <p className="text-white/40 text-sm leading-relaxed">
              This wallet has already been connected with wieedze.eth at EthCC.
            </p>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-400">Error</h1>
            <p className="text-white/40 text-sm leading-relaxed">{error}</p>
            <button
              onClick={() => { setStatus('idle'); setError('') }}
              className="px-6 py-3 rounded-xl bg-white/10 text-white text-sm hover:bg-white/15 transition-colors"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
