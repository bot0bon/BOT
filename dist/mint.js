"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintToken = mintToken;
const wallet_1 = require("./wallet");
const spl_token_1 = require("@solana/spl-token");
async function mintToken() {
    const connection = (0, wallet_1.getConnection)();
    if (!process.env.PRIVATE_KEY)
        throw new Error('PRIVATE_KEY غير معرف في ملف البيئة');
    const payer = (0, wallet_1.loadKeypair)(JSON.parse(process.env.PRIVATE_KEY));
    const decimals = parseInt(process.env.DECIMALS || '6');
    const mintAmount = parseInt(process.env.MINT_AMOUNT || '1000000000000');
    // 1. إنشاء Mint جديد باستخدام Token.createMint
    const mintAccount = await spl_token_1.Token.createMint(connection, payer, payer.publicKey, null, decimals, spl_token_1.TOKEN_PROGRAM_ID);
    // 2. إنشاء أو جلب حساب التوكن المرتبط (ATA) باستخدام SPL-Token الرسمي
    const tokenAccountInfo = await mintAccount.getOrCreateAssociatedAccountInfo(payer.publicKey);
    // 3. سك التوكنات لمحفظتك
    await mintAccount.mintTo(tokenAccountInfo.address, payer, [], mintAmount);
    console.log(`✅ Mint created: ${mintAccount.publicKey.toBase58()}`);
    console.log(`📦 Token Account: ${tokenAccountInfo.address.toBase58()}`);
    return {
        mint: mintAccount.publicKey.toBase58(),
        tokenAccount: tokenAccountInfo.address.toBase58(),
        mintedAmount: mintAmount
    };
}
