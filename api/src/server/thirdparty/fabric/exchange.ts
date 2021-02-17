import { invoke, query, redeem, list, issue, transfer } from "../../../fabric/go-api";
import { configure } from "../../../common/config";
import { decisionResult } from "./common";
import { ExchangePolicy, ExchangeRequest } from "../../rest/exchange";
import { getUser } from "../../../fabric/ca";
import { Transaction } from "./transaction";
import { copySync } from "fs-extra";

export class Exchange {
    bank_name: string;
    token1_name: string;
    token2_name: string;
    rate: number;

    constructor(exhcnagePolicy: ExchangePolicy) {
        this.bank_name = exhcnagePolicy.bank_name;
        this.token1_name = exhcnagePolicy.token1_name;
        this.token2_name = exhcnagePolicy.token2_name;
        this.rate = exhcnagePolicy.rate;
    }

    async create() {
        const actionParams = [this];
        const actionResult = await invoke(configure.CHANNEL_NAME, "token", "exchange/GenerateExchange", actionParams);

        const result = decisionResult(actionResult);
        return result;
    }

    async update() {
        const actionParams = [this];
        const actionResult = await invoke(configure.CHANNEL_NAME, "token", "exchange/PutExchange", actionParams);

        const result = decisionResult(actionResult);
        return result;
    }
}

export async function exchange(exchangeRequest: ExchangeRequest) {
    try{
    const userInfo = await getUser(exchangeRequest.orcid);
    //리스트 불러온 다음에
    const tokens = (<any[]>await list(userInfo.cert, userInfo.priv));
    if (!tokens) {
        throw "can't read token"
    }
    const bankName = exchangeRequest.bank_name;

    let token1Amount = 0;
    let token2Amount = 0;
    const typeList:any[]= [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === bankName + '_' + exchangeRequest.from) {
            token1Amount += +tokens[i].quantity
            typeList.push(tokens[i]);
        }
        if (tokens[i].type === bankName + '_' + exchangeRequest.to) {
            token2Amount += +tokens[i].quantity
        }
    }

    // const typeList =

    let amount = exchangeRequest.value

    if (token1Amount >= amount) {
        //비율을 블록체인에서 받아서
        const params = [
            {
                bank_name: exchangeRequest.bank_name,
                token1_name: exchangeRequest.from,
                token2_name: exchangeRequest.to,
            },
        ];
        const queryResult = await query(configure.CHANNEL_NAME, "token", "exchange/GetExchange", params)
        const exchangeValueResult = decisionResult(queryResult);
        const rate = +exchangeValueResult.rate;

        const nextTokenValue = exchangeRequest.value * rate / 100;
        //삭다 리딤하고
        const admin = await getUser('admin')
        for (let i = 0; i < typeList.length && amount > 0; i++) {
            const v = typeList[i];
            const value = v.quantity;
            let send = 0;
            if (amount < value) {
                send = amount;
                amount = 0;
            } else {
                amount = amount - value;
                send = value;
            }
            const tokenId = `[{"tx_id":"${v.id.tx_id}"` + ((v.id.index) ? `,"index":` + v.id.index : '') + `}]`
            const p = await transfer(configure.ADMIN_ID,userInfo.cert, userInfo.priv, admin.cert, admin.priv, tokenId, send);


            console.log("re:", p)
        }
        console.log('exr', exchangeRequest);
        const i = await issue(configure.ADMIN_ID, userInfo.cert, userInfo.priv, bankName + '_' + exchangeRequest.to, nextTokenValue);
        console.log(configure.ADMIN_ID, userInfo.cert, userInfo.priv, exchangeRequest.to, nextTokenValue)
        console.log('issue', i);

        const tx1 = new Transaction(
            exchangeRequest.bank_name, 'exchange', exchangeRequest.from, amount, null,
            token1Amount, token1Amount - amount,
            exchangeRequest.orcid, exchangeRequest.orcid, null
        )
        tx1.save();
        const args1:object[] = [
            {
                name:exchangeRequest.from,
                bank_name: bankName ,
                global_amount:token1Amount - exchangeRequest.value,
            }
        ];
        const t1up = await invoke(configure.CHANNEL_NAME, "token", "token/UpdateGlobalAmount", args1);

        decisionResult(t1up)
        const tx2 = new Transaction(
            exchangeRequest.bank_name, 'exchange', exchangeRequest.to, nextTokenValue, null,
            token2Amount, token2Amount + nextTokenValue,
            exchangeRequest.orcid, exchangeRequest.orcid, null
        )
        tx2.save();
        const args2:object[] = [
            {
                name:exchangeRequest.to,
                bank_name: bankName,
                global_amount:token2Amount + nextTokenValue
            }
        ];
        const t2up = await invoke(configure.CHANNEL_NAME, "token", "token/UpdateGlobalAmount", args2);
        decisionResult(t2up)
        return i
    } else {
        throw "not enough tokens"
    }
    } catch(err) {
        return "";
    }
}

export async function getExchanges(bankName: string) {
    const params = [{
        bank_name: bankName,
    }];

    const resultQuery = await query(configure.CHANNEL_NAME, "token", "exchange/GetExchanges", params);
    const result = decisionResult(resultQuery);

    return {
        exchange_policies: result,
    };
}

export async function deleteExchange(bankName: string, token1: string, token2: string) {
    const params = [{
        bank_name: bankName,
        token1_name: token1,
        token2_name: token2,
    }];

    const resultQuery = await invoke(configure.CHANNEL_NAME, "token", "exchange/DeleteExchange", params);
    const result = decisionResult(resultQuery);

    return result;
}