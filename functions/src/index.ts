import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { ethers } from 'ethers'
import { defineString } from 'firebase-functions/params'

initializeApp()

const PRIVATE_KEY = defineString('PRIVATE_KEY')
const RPC_URL = defineString('RPC_URL', { default: 'https://rpc.intuition.systems' })
const VAULT_ID = defineString('VAULT_ID')

// SofiaFeeProxy ABI — only the deposit function we need
const FEE_PROXY_ABI = [
  'function deposit(address receiver, bytes32 termId, uint256 curveId, uint256 minShares) external payable returns (uint256 shares)',
]

const FEE_PROXY_ADDRESS = '0x26F81d723Ad1648194FAA4b7e235105Fd1212c6c'
const DEPOSIT_AMOUNT = ethers.parseEther('0.01') // 0.01 TRUST min deposit

export const claimConnection = onCall(
  { cors: true, maxInstances: 10 },
  async (request) => {
    const address = request.data?.address
    if (!address || typeof address !== 'string' || !ethers.isAddress(address)) {
      throw new HttpsError('invalid-argument', 'Invalid wallet address')
    }

    const normalizedAddress = address.toLowerCase()
    const db = getDatabase()

    // Check if already claimed
    const claimRef = db.ref(`claims/${normalizedAddress}`)
    const existing = await claimRef.get()
    if (existing.exists()) {
      return { success: true, alreadyClaimed: true }
    }

    // Set up provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL.value())
    const wallet = new ethers.Wallet(PRIVATE_KEY.value(), provider)

    // Calculate total cost: deposit + fees
    // FeeProxy takes fees from msg.value, so we send more than the deposit amount
    // Fixed fee (0.1 TRUST) + percentage fee (5%) on top of deposit
    const fixedFee = ethers.parseEther('0.1')
    const percentageFee = DEPOSIT_AMOUNT * BigInt(5) / BigInt(100) // 5%
    const totalCost = DEPOSIT_AMOUNT + fixedFee + percentageFee

    const feeProxy = new ethers.Contract(FEE_PROXY_ADDRESS, FEE_PROXY_ABI, wallet)

    try {
      const tx = await feeProxy.deposit(
        normalizedAddress, // receiver — the visitor gets the shares
        VAULT_ID.value(),  // termId — the triple vault
        1,                 // curveId — linear bonding curve
        0,                 // minShares — no slippage protection needed for small amounts
        { value: totalCost }
      )

      const receipt = await tx.wait()

      // Record claim in DB
      await claimRef.set({
        txHash: receipt.hash,
        timestamp: Date.now(),
      })

      // Increment counter
      const countRef = db.ref('claimsCount')
      const countSnap = await countRef.get()
      await countRef.set((countSnap.val() ?? 0) + 1)

      return { success: true, alreadyClaimed: false, txHash: receipt.hash }
    } catch (err: unknown) {
      console.error('Deposit failed:', err)
      const message = err instanceof Error ? err.message : 'Transaction failed'
      throw new HttpsError('internal', message)
    }
  }
)
