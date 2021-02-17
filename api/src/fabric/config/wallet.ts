import { join } from 'path';
import { FileSystemWallet } from 'fabric-network';

class WalletSingleton {
    private static instance: WalletSingleton;
    private static wallet: FileSystemWallet;

    get wallet(): FileSystemWallet {
        return WalletSingleton.wallet;
    }

    private constructor() {
        const WALLET_PATH = join(process.cwd(), 'wallet');
        WalletSingleton.wallet = new FileSystemWallet(WALLET_PATH);
    }

    static getInstance(): WalletSingleton {
        if (!WalletSingleton.instance) {
            WalletSingleton.instance = new WalletSingleton();
        }

        return WalletSingleton.instance;
    }

}

export const wallet: FileSystemWallet = WalletSingleton.getInstance().wallet;