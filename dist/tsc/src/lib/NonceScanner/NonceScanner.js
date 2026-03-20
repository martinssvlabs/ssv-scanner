"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonceScanner = void 0;
const BaseScanner_1 = require("../BaseScanner");
class NonceScanner extends BaseScanner_1.BaseScanner {
    async run(isCli) {
        if (isCli) {
            console.log('\nScanning blockchain...');
        }
        const sdk = this.createSdkForCommand('nonce');
        if (isCli) {
            this.logScanContext(sdk);
        }
        // TODO: If nonce resolves to "0", consider an optional on-chain fallback check to disambiguate
        // between a truly new owner and temporary subgraph unavailability/staleness.
        // Resolve owner nonce from SDK subgraph API.
        const ownerNonce = await sdk.api.getOwnerNonce({ owner: this.params.ownerAddress });
        const parsedNonce = BigInt(ownerNonce);
        return this.toSafeNumber(parsedNonce, 'Owner nonce');
    }
}
exports.NonceScanner = NonceScanner;
//# sourceMappingURL=NonceScanner.js.map