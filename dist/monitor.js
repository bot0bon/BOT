"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchForBuy = watchForBuy;
const wallet_1 = require("./wallet");
const web3_js_1 = require("@solana/web3.js");
async function watchForBuy(mintAddress, myAddress, onBuy) {
    const connection = (0, wallet_1.getConnection)();
    const pumpFunProgramId = new web3_js_1.PublicKey("6EF8r6z5RM3KeobAPovhZ5zdtcKnGbZxTQ4gxQTXbqiu");
    console.log(`🔍 Monitoring for buys on ${mintAddress}...`);
    let resolved = false;
    const listenerId = connection.onLogs(pumpFunProgramId, async (logInfo) => {
        if (resolved)
            return;
        const logs = logInfo.logs.join('\n');
        // فلترة أدق: تحقق من وجود mintAddress ووجود كلمة buy
        if (logs.includes(mintAddress) && /buy|purchase|swap/i.test(logs)) {
            // محاولة استخراج عنوان المشتري من اللوج (قد تحتاج تخصيص حسب تنسيق اللوج)
            let buyerAddress = '';
            const match = logs.match(/buyer: ([A-Za-z0-9]+)/i);
            if (match)
                buyerAddress = match[1];
            resolved = true;
            console.log('🎯 Buy detected!');
            try {
                await onBuy(buyerAddress);
            }
            finally {
                // إيقاف الاستماع بعد أول عملية شراء
                connection.removeOnLogsListener(listenerId);
            }
        }
    }, 'confirmed');
}
