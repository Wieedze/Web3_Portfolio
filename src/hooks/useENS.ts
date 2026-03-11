import { useState, useEffect, useRef } from 'react'

interface ENSProfile {
  avatar: string | null
  name: string
  description: string | null
  github: string | null
  twitter: string | null
  url: string | null
  loading: boolean
  error: string | null
}

const FALLBACKS = {
  name: 'wieedze.eth',
  description: 'Building verifiable identity & Web3 tooling on Intuition',
  avatar: null,
  github: 'https://github.com/Wieedze',
  twitter: 'https://x.com/0xSofia3',
  url: null,
}

export default function useENS(ensName: string): ENSProfile {
  const [profile, setProfile] = useState<ENSProfile>({
    ...FALLBACKS,
    loading: true,
    error: null,
  })
  const cache = useRef<ENSProfile | null>(null)

  useEffect(() => {
    if (cache.current) {
      setProfile(cache.current)
      return
    }

    let cancelled = false

    async function fetchENS() {
      try {
        const res = await fetch(`https://ensdata.net/${ensName}`)
        if (!res.ok) throw new Error(`ENS API returned ${res.status}`)
        const data = await res.json()

        if (cancelled) return

        const result: ENSProfile = {
          avatar: `https://ensdata.net/media/avatar/${ensName}`,
          name: data.ens_primary || data.address?.slice(0, 8) || FALLBACKS.name,
          description: data.records?.description || FALLBACKS.description,
          github: data.records?.['com.github']
            ? `https://github.com/${data.records['com.github']}`
            : FALLBACKS.github,
          twitter: data.records?.['com.twitter']
            ? `https://x.com/${data.records['com.twitter']}`
            : FALLBACKS.twitter,
          url: data.records?.url || FALLBACKS.url,
          loading: false,
          error: null,
        }

        cache.current = result
        setProfile(result)
      } catch (err) {
        if (cancelled) return
        setProfile({
          ...FALLBACKS,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch ENS',
        })
      }
    }

    fetchENS()
    return () => { cancelled = true }
  }, [ensName])

  return profile
}
