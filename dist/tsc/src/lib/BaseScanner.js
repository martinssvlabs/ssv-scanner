"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScanner = void 0;
const viem_1 = require("viem");
class BaseScanner {
    constructor(scannerParams) {
        if (!scannerParams.nodeUrl) {
            throw Error('ETH1 node is required');
        }
        if (!scannerParams.network) {
            throw Error('Network is required');
        }
        if (!scannerParams.ownerAddress) {
            throw Error('Cluster owner address is required');
        }
        if (scannerParams.ownerAddress.length !== 42) {
            throw Error('Invalid owner address length.');
        }
        if (!scannerParams.ownerAddress.startsWith('0x')) {
            throw Error('Invalid owner address.');
        }
        this.params = scannerParams;
        // convert to checksum addresses
        this.params.ownerAddress = (0, viem_1.getAddress)(this.params.ownerAddress);
    }
}
exports.BaseScanner = BaseScanner;
//# sourceMappingURL=BaseScanner.js.map