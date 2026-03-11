export interface Project {
  name: string
  description: string
  tags: string[]
  url?: string
  github?: string
  twitter?: string
  icon?: string
}

export function getProjectIcon(project: Project): string {
  if (project.icon) return project.icon
  if (project.url) {
    const domain = new URL(project.url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  }
  if (project.github) {
    return 'https://www.google.com/s2/favicons?domain=github.com&sz=32'
  }
  return ''
}

export const projects: Project[] = [
  {
    name: 'Sofia',
    description:
      'Chromium extension that transforms your web activity into verifiable, blockchain-based digital identity.',
    tags: ['Extension', 'AI', 'Identity'],
    url: 'https://sofia.intuition.box/',
    github: 'https://github.com/intuition-box/Sofia',
    twitter: 'https://x.com/0xSofia3',
  },
  {
    name: 'Sofia Board',
    description:
      'Dashboard to visualize and manage Sofia attestations and identity data.',
    tags: ['Frontend', 'Dashboard'],
    url: 'https://board-sofia.intuition.box/',
  },
  {
    name: 'Sofia OG',
    description:
      'OG image generator for Sofia — dynamic social previews for sharing on X.',
    tags: ['Tool', 'OG Images'],
    github: 'https://github.com/Wieedze/sofia-og',
  },
  {
    name: 'Sofia API',
    description:
      'Secure OAuth token exchange API for the Sofia Chrome extension.',
    tags: ['Backend', 'OAuth', 'API'],
    github: 'https://github.com/Wieedze/Sofia-api',
  },
  {
    name: 'Sofia Verifier Template',
    description:
      'SDK to verify off-chain data (OAuth tokens, API credentials) and create on-chain attestations when verification passes.',
    tags: ['SDK', 'Verifier', 'Smart Contract'],
    github: 'https://github.com/Wieedze/Sofia-Verifier-Template',
  },
  {
    name: 'Intuition Fee Proxy',
    description:
      'Customizable proxy contract for Intuition MultiVault — collect fees on atom/triple creation and deposits.',
    tags: ['Smart Contract', 'Solidity', 'Proxy'],
    github: 'https://github.com/Wieedze/Intuition-Fee-Proxy-Template',
  },
  {
    name: 'Mastra GaiaNet Provider',
    description:
      'GaiaNet provider for the Mastra AI framework — plug decentralized AI inference into your agents.',
    tags: ['AI', 'Provider', 'Mastra'],
    github: 'https://github.com/Wieedze/mastra-gaianet-provider',
  },
]
