import { Token as RestToken, Tokens as RestTokens, InflationPolicy as RestInflationPolicy, Transfer } from '../../rest/token';
import { configure } from '../../../common/config';
import { invoke , query } from '../../../fabric/fabric-module';
import { issue, list, transfer } from '../../../fabric/go-api';
import { decisionResult } from './common';
import { getUser } from '../../../fabric/ca';
import { setPeriod } from '../period';
import { tokenTransfer } from '../../fabric';
import { Fabtoken } from './fabtoken';
import { Transaction, TxType } from './transaction';

export class Token {
    bank_name: string;
    token_name: string;
    admin: string;
    initialization_balance: number;
    global_amount?: number;
    inflation_policy: RestInflationPolicy;

    constructor(token: RestToken) {
        this.bank_name = token.bank_name;
        this.token_name = token.token_name;
        this.admin = token.admin;
        this.initialization_balance = token.initialization_balance;
        this.global_amount = token.global_amount;
        this.inflation_policy = token.inflation_policy
    }

    async generate(jwt: string): Promise<RestToken> {
        //const userInfo = await getUser(this.admin);
        //TODO: check success
        //const tokenValue = await issue(configure.MSP_ID, userInfo.cert, userInfo.priv, this.getTokenType(), this.initialization_balance);
        var args = []
        args[0] = JSON.stringify(jwt);
        args[1] = JSON.stringify(this);
        const invokeResult = await invoke(configure.CHANNEL_NAME, configure.CHAINCODE_NAME, "bank/GenerateToken", args);

        //TODO: run inflation
        const result = decisionResult(invokeResult);

        // const tx = new Transaction(
        //     this.bank_name,   'inflation', this.token_name, this.initialization_balance, null, 0, this.initialization_balance, null, null, this.initialization_balance
        // )
        // tx.save();

        // setPeriod(this.admin, this.bank_name, this.name, this.inflation_policy.period, (orcid, bankName, tokenName) => {
        //     inflate(orcid, bankName, tokenName);
        // });
        // setPeriod(this.bank_name, this.name, this.inflation_policy.period, )
        return result;
    }

    getTokenType() {
        return `${this.bank_name}_${this.token_name}`;
    }
}

export async function transferToken(transferRequest: Transfer, txType: TxType = 'transfer') {
    const tokenType = `${transferRequest.bank_name}_${transferRequest.token_name}`;
    const user1Info = await getUser(transferRequest.from);
    const user2Info = await getUser(transferRequest.to);
    const tokens = (<any[]>await list(user1Info.cert, user1Info.priv));
    if (!tokens) {
        throw "can't read token"
    }
    // const typeList = tokens.filter(f => f.type === transferRequest.bank_name + '_' + tokenType, 0);
    let user1Amount = 0;
    const typeList:any[]= [];
    console.log(tokens)
    console.log(tokenType)
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === tokenType) {
            user1Amount += +tokens[i].quantity
            typeList.push(tokens[i]);
        }
    }

    let amount = transferRequest.value
    console.log("====================")
    console.log(user1Amount)
    console.log(amount)
    console.log("====================")
    if (user1Amount >= amount) {
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
            const p = await transfer(configure.ADMIN_ID,
                user1Info.cert, user1Info.priv, user2Info.cert, user2Info.priv,
                tokenId, send);

            console.log("re:", p)
        }

        const tx = new Transaction(
            transferRequest.bank_name, txType, transferRequest.token_name, transferRequest.value, null, user1Amount, user1Amount - transferRequest.value, transferRequest.from, transferRequest.to, null
        )
        tx.save();

        return list(user1Info.cert, user1Info.priv);
    } else {
        throw "not enough tokens"
    }
}

export async function inflate(orcid: string, bankName: string, tokenName: string) {
    console.log(`call inflate!! ${orcid} ${bankName} ${tokenName}`)

    const tokenType = `${bankName}_${tokenName}`;
    const userInfo = await getUser(orcid);
    const tokens = (<any[]>await list(userInfo.cert, userInfo.priv));

    if (!tokens) {
        throw "can't read token"
    }
    const typeList = tokens.filter(f => f.type === tokenType);

    let balance = 0;
    for (let i = 0; i < typeList.length; i++) {
        const v = typeList[i];
        balance += parseInt(v.quantity);
    }

    const param = {
        bank_name: bankName,
        token_name: tokenName,
        bank_balance: balance
    };

    const params = [param];
    const invokeResult = await invoke(configure.CHANNEL_NAME, "token", "token/InflateToken", JSON.stringify(params));
    const result = decisionResult(invokeResult);
    console.log("res", result);

    const amount = result.inflated_token_value;
    const issueResult = await issue(configure.ADMIN_ID, userInfo.cert, userInfo.priv, tokenType, amount);

    console.log("=================")
    console.log(balance, amount)
    console.log("=================")
    const inflateValue = amount / balance;
    const tx = new Transaction(
        bankName, 'inflation', tokenName, amount, null, balance, balance + amount, null, null, inflateValue
    )
    tx.save();

    return issueResult;
}


export async function getTokens(jwt: string, bankName: string): Promise<any> {
    const params = {
        bank_name: bankName
    };
    const args = []
    args[0] = jwt;
    args[1] = JSON.stringify(params)

    const queryResult = await query(configure.CHANNEL_NAME, configure.CHAINCODE_NAME, "token/GetTokens", args)
    const queryTokenResult = decisionResult(queryResult) as Map<String, RestToken>;
    console.log(queryTokenResult)
    return queryTokenResult
    // // oricd를 이용해 은행 토큰 리스트 다 불러온다
    // const userInfo = await getUser(orcid);
    // const listResult = await list(userInfo.cert, userInfo.priv);

    //const tokenMap = new Map<string, RestToken>();

    // (queryTokenResult as RestToken[])
    //     // .map(tk => new Token(tk))
    //     .forEach(tk => {
    //         tk.balance = 0;
    //         return tokenMap.set(`${tk.bank_name}_${tk.token_name}`, tk)
    //     });

    // return {
    //     tokens: Array.from(tokenMap.values()),
    // }
}