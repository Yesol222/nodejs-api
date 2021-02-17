import { config } from 'dotenv';

export interface Configure {
    IS_DEV: boolean
    DEV_URL: string
    PORT: number

    JWT_SECRET: string

    MSP_RELATIVE_PATH: string
    ADMIN_MSP_PATH: string
    USER1_MSP_PATH: string
    USER2_MSP_PATH: string

    ADMIN_ID: string
    CHANNEL_NAME: string
    CHAINCODE_NAME: string
    MSP_ID: string

    CONNECTION_PATH: string

    OPR_GO_INVOKE_API_URL: string
    OPR_GO_ISSUE_API_URL: string
    OPR_GO_LIST_API_URL: string
    OPR_GO_TRANSFER_API_URL: string

    KERIS_PEER_NAME: string
    KERIS_ORDERER_NAME: string
    KERIS_CA_NAME: string

    ORCID_CLIENT_ID: string
    ORCID_CLIENT_SECRET: string
    ORCID_GRANT_TYPE: string
    ORCID_REDIRECT_URI: string
}

class ConstSingleton {
    private static instance: ConstSingleton;
    private static configureData: Configure;

    get configure() {
        return ConstSingleton.configureData;
    }

    private constructor() {
        config();

        ConstSingleton.configureData = {
            IS_DEV: (process.env.IS_DEV || 'false') == 'true',
            DEV_URL: process.env.DEV_URL || '',
            PORT: parseInt(process.env.PORT || '3000'),

            JWT_SECRET: process.env.JWT_SECRET || '',

            MSP_RELATIVE_PATH: process.env.MSP_RELATIVE_PATH || '',
            ADMIN_MSP_PATH: process.env.ADMIN_MSP_PATH || '',
            USER1_MSP_PATH: process.env.USER1_MSP_PATH || '',
            USER2_MSP_PATH: process.env.USER2_MSP_PATH || '',

            ADMIN_ID: process.env.ADMIN_ID || '',
            CHANNEL_NAME: process.env.CHANNEL_NAME || '',
            CHAINCODE_NAME: process.env.CHAINCODE_NAME || '',
            MSP_ID: process.env.MSP_ID || '',

            CONNECTION_PATH: process.env.CONNECTION_PATH || '',

            OPR_GO_INVOKE_API_URL: process.env.OPR_GO_INVOKE_API_URL || '',
            OPR_GO_ISSUE_API_URL: process.env.OPR_GO_ISSUE_API_URL || '',
            OPR_GO_LIST_API_URL: process.env.OPR_GO_LIST_API_URL || '',
            OPR_GO_TRANSFER_API_URL: process.env.OPR_GO_TRANSFER_API_URL || '',

            KERIS_PEER_NAME: process.env.KERIS_PEER_NAME || '',
            KERIS_ORDERER_NAME: process.env.KERIS_ORDERER_NAME || '',
            KERIS_CA_NAME: process.env.KERIS_CA_NAME || '',

            ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID || '',
            ORCID_CLIENT_SECRET: process.env.ORCID_CLIENT_SECRET || '',
            ORCID_GRANT_TYPE: process.env.ORCID_GRANT_TYPE || '',
            ORCID_REDIRECT_URI: process.env.ORCID_REDIRECT_URI || '',
        };
    }

    static getInstance(): ConstSingleton {
        if (!ConstSingleton.instance) {
            ConstSingleton.instance = new ConstSingleton();
        }
        return ConstSingleton.instance;
    }

}


export const configure = ConstSingleton.getInstance().configure;
