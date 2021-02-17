import request from 'request';
import { ccp } from './config/connection'
import { setHistory } from '../server/fabric';

const OPR_GO_INVOKE_API_URL = "http://localhost:8910/api/chaincode/invoke";
const OPR_GO_QUERY_API_URL = "http://localhost:8910/api/chaincode/query";
const OPR_GO_ISSUE_API_URL = "http://localhost:8910/api/token/issue";
const OPR_GO_LIST_API_URL = "http://localhost:8910/api/token/list";
const OPR_GO_TRANSFER_API_URL = "http://localhost:8910/api/token/transfer";
const OPR_GO_REDEEM_API_URL = "http://localhost:8910/api/token/redeem";
const KERIS_PEER = "peer0.org1.kisti.re.kr";
const KERIS_ORDERER = "orderer.kisti.re.kr";

export async function invoke(channelId: string, chaincodeName: string, functionName: string, args: object[]): Promise<any> {
    const body = {
        peer_endpoint: ccp["peers"][KERIS_PEER].url.replace('grpc://', ''),
        orderer_endpoint: ccp["orderers"][KERIS_ORDERER].url.replace('grpc://', ''),
        channel_id: channelId,
        chaincode_name: chaincodeName,
        function_name: functionName,
        args: args,
    };
    const callResult = await call(OPR_GO_INVOKE_API_URL, body);
    console.log('invoke result: ', callResult);
    return callResult
}

export async function query(channelId: string, chaincodeName: string, functionName: string, args: object[]): Promise<any> {
    const body = {
        peer_endpoint: ccp["peers"][KERIS_PEER].url.replace('grpc://', ''),
        orderer_endpoint: ccp["orderers"][KERIS_ORDERER].url.replace('grpc://', ''),
        channel_id: channelId,
        chaincode_name: chaincodeName,
        function_name: functionName,
        args: args,
    };
    const callResult = await call(OPR_GO_QUERY_API_URL, body);
    console.log('query result: ', callResult);
    return callResult;
}

export async function issue(mspId: string, cert: string, priv: string, tokenType: string, tokenQuantity: number): Promise<any> {
    const body = {
        type: tokenType,
        cert: cert,
        priv: priv,
        quantity: '' + tokenQuantity
    };

    console.log(body)//
    return call(OPR_GO_ISSUE_API_URL, body);
}

export async function list(cert: string, priv: string): Promise<any> {
    const body = {
        cert: cert,
        priv: priv,
    };

    return call(OPR_GO_LIST_API_URL, body);
}

export async function transfer(userConfig: string, cert: string, priv: string, cert2: string, priv2: string, token_ids: string, quantity: number): Promise<any> {
    const body = {
        cert: cert,
        priv: priv,
        cert2: cert2,
        priv2: priv2,
        user_config: userConfig,
        token_ids: token_ids,
        quantity: '' + quantity
    };

    return call(OPR_GO_TRANSFER_API_URL, body);

}

export async function redeem(cert: string, priv: string, tokenId: string, quantity: number) {
    const body = {
        cert: cert,
        priv: priv,
        token_ids: tokenId,
        quantity: '' + quantity,
    };

    return call(OPR_GO_REDEEM_API_URL, body);
}

async function call(url: string, body: any): Promise<any> {
    return new Promise((res, rej) => {
        request
            .post(url, {
                json: true,
                body: body
            }, (err, httpResponse, body) => {
                if (err) {
                    rej(err);
                } else {
                    res(body);
                }
            });
    });
}
