import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { ethers } from 'ethers'
import { defineString } from 'firebase-functions/params'
import { SofiaFeeProxyAbi } from './ABI/SofiaFeeProxy'

initializeApp()

const PRIVATE_KEY = defineString('PRIVATE_KEY')
const RPC_URL = defineString('RPC_URL', { default: 'https://rpc.intuition.systems' })
const VAULT_ID = defineString('VAULT_ID')


const FEE_PROXY_ADDRESS = ethers.getAddress('0x26f81d723ad1648194faa4b7e235105fd1212c6c')

const DEPOSIT_AMOUNT = ethers.parseEther('0.1') // 0.1 TRUST per visitor

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


    const feeProxy = new ethers.Contract(FEE_PROXY_ADDRESS, SofiaFeeProxyAbi, wallet)

    try {
      // Use getTotalDepositCost to calculate exact msg.value including Sofia fees
      const totalCost: bigint = await feeProxy.getTotalDepositCost(DEPOSIT_AMOUNT)
      console.log(`Deposit amount: ${DEPOSIT_AMOUNT}, total cost: ${totalCost}`)

      const tx = await feeProxy.deposit(
        ethers.getAddress(normalizedAddress), // receiver — checksummed
        VAULT_ID.value(),                     // termId — the triple vault (bytes32)
        1,                                    // curveId — linear/voting curve
        0,                                    // minShares — no slippage protection
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
