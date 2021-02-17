import { invoke, query } from '../../../fabric/go-api';
import { configure } from '../../../common/config';
import { decisionResult } from './common';

export type TxType = 'transfer' | 'reward' | 'inflation' | 'exchange';

export class Transaction {
    bank_name: string;
    tx_type: TxType;
    token_name: string;
    from: string | null;
    to: string | null;
    inflation_value: number | null;
    amount: number;
    time: number | null;
    before_amount: number;
    after_amount: number;

    constructor(
        bankName: string,
        txType: TxType,
        tokenName: string,
        amount: number,
        time: number | null,
        beforeAmount: number,
        afterAmount: number,
        from: string | null,
        to: string | null,
        inflationValue: number | null
    ) {
        this.bank_name = bankName;
        this.tx_type = txType;
        this.token_name = tokenName;
        this.from = from;
        this.to = to;
        this.time = time;
        this.before_amount = beforeAmount;
        this.after_amount = afterAmount;
        this.amount = amount
        this.inflation_value = inflationValue;
    }

    save() {
        this.time = new Date().getTime();
        const historyParams = [this]; //synchronous
        const historyResult = invoke(configure.CHANNEL_NAME, "token", "transaction/AddTransactionHistory", historyParams);
        historyResult.then(result => console.log('succes save history', result), err => console.log('fail save hisotry', err))
    }
}

export interface Transactions {
    transactions: Transaction[];
}


export async function getTransactions(bankName: string): Promise<Transactions>{
    const params = [{
        bank_name: bankName,
    }];
    const resultQuery = await query(configure.CHANNEL_NAME, "token", "transaction/GetTransactions", params);
    const result = decisionResult(resultQuery);

    return result as Transactions;
}