import EthereumProvider from '@walletconnect/ethereum-provider'

export async function getWalletConnectProvider() {
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID
  if (!projectId) throw new Error('Missing VITE_WALLETCONNECT_PROJECT_ID')

  const provider = await EthereumProvider.init({
    projectId,
    chains: [1, 8453],
    optionalChains: [1, 8453],
    showQrModal: true,
    metadata: {
      name: 'Wieedze Portfolio',
      description: 'Connect with wieedze.eth at EthCC',
      url: 'https://wieedze.github.io/Web3_Portfolio/',
      icons: ['https://wieedze.github.io/Web3_Portfolio/favicon.ico'],
    },
  })

  await provider.connect()
  return provider
}
