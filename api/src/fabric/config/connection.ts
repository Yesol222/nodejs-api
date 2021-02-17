import { resolve } from 'path';
import { readFileSync } from 'fs';

class ConnectionSingleton {
    private static instance: ConnectionSingleton;
    private static ccp: any;

    get ccp() {
        return ConnectionSingleton.ccp;
    }
    private constructor() {
        const ccpPath = resolve(__dirname, '..', '..', '..', '..', 'network', 'connection.json');
        const ccpJson = readFileSync(ccpPath, 'utf8');
        ConnectionSingleton.ccp = JSON.parse(ccpJson);
    }

    static getInstance(): ConnectionSingleton {
        if (!ConnectionSingleton.instance) {
            ConnectionSingleton.instance = new ConnectionSingleton();
        }

        return ConnectionSingleton.instance;
    }

}

export const ccp = ConnectionSingleton.getInstance().ccp;