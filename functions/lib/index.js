"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimConnection = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const database_1 = require("firebase-admin/database");
const ethers_1 = require("ethers");
const params_1 = require("firebase-functions/params");
(0, app_1.initializeApp)();
const PRIVATE_KEY = (0, params_1.defineString)('PRIVATE_KEY');
const RPC_URL = (0, params_1.defineString)('RPC_URL', { default: 'https://rpc.intuition.systems' });
const VAULT_ID = (0, params_1.defineString)('VAULT_ID');
// MultiVault ABI — deposit function (same signature for atoms and triples)
const MULTIVAULT_ABI = [
    'function deposit(address receiver, bytes32 termId, uint256 curveId, uint256 minShares) external payable returns (uint256 shares)',
];
const MULTIVAULT_ADDRESS = '0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e';
const DEPOSIT_AMOUNT = ethers_1.ethers.parseEther('0.1'); // 0.1 TRUST
exports.claimConnection = (0, https_1.onCall)({ cors: true, maxInstances: 10 }, async (request) => {
    const address = request.data?.address;
    if (!address || typeof address !== 'string' || !ethers_1.ethers.isAddress(address)) {
        throw new https_1.HttpsError('invalid-argument', 'Invalid wallet address');
    }
    const normalizedAddress = address.toLowerCase();
    const db = (0, database_1.getDatabase)();
    // Check if already claimed
    const claimRef = db.ref(`claims/${normalizedAddress}`);
    const existing = await claimRef.get();
    if (existing.exists()) {
        return { success: true, alreadyClaimed: true };
    }
    // Set up provider and wallet
    const provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL.value());
    const wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY.value(), provider);
    const multiVault = new ethers_1.ethers.Contract(MULTIVAULT_ADDRESS, MULTIVAULT_ABI, wallet);
    try {
        const tx = await multiVault.deposit(normalizedAddress, // receiver — the visitor gets the shares
        VAULT_ID.value(), // termId — the triple vault (bytes32)
        1, // curveId — linear/voting curve
        0, // minShares — no slippage protection
        { value: DEPOSIT_AMOUNT });
        const receipt = await tx.wait();
        // Record claim in DB
        await claimRef.set({
            txHash: receipt.hash,
            timestamp: Date.now(),
        });
        // Increment counter
        const countRef = db.ref('claimsCount');
        const countSnap = await countRef.get();
        await countRef.set((countSnap.val() ?? 0) + 1);
        return { success: true, alreadyClaimed: false, txHash: receipt.hash };
    }
    catch (err) {
        console.error('Deposit failed:', err);
        const message = err instanceof Error ? err.message : 'Transaction failed';
        throw new https_1.HttpsError('internal', message);
    }
});
//# sourceMappingURL=index.js.map