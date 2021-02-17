import { ActionPolicy } from "../../rest/action";
import { invoke, query, transfer, list } from "../../../fabric/go-api";
import { configure } from "../../../common/config";
import { decisionResult } from "./common";
import { RSA_NO_PADDING } from "constants";
import { getUser } from "../../../fabric/ca";
import { transferToken } from "./token";
import { Transaction } from "./transaction";

export class Action {
    type: string;
    reward: number;
    token_name: string;
    bank_name: string;

    constructor(action: ActionPolicy) {
        this.type = action.type;
        this.reward = action.reward;
        this.token_name = action.token_name;
        this.bank_name = action.bank_name;
    }

    async create() {
        const actionParams = [this];
        const actionResult = await invoke(configure.CHANNEL_NAME, "token", "action/CreateActionPolicy", actionParams);

        const result = decisionResult(actionResult);
        return result;
    }

    async update() {
        const actionParams = [this];
        const actionResult = await invoke(configure.CHANNEL_NAME, "token", "action/PutActionPolicy", actionParams);

        const result = decisionResult(actionResult);
        return result;

    }
}

let count = 0;

const dummy = [
    {
        token_type: "main",
        reward: 100,
    }, {
        token_type: "sub",
        reward: 300,
    }, {
        token_type: "sub",
        reward: 300,
    }, {
        token_type: "main",
        reward: 150,
    }
]

export async function action(bankName: string, actionType: string, admin: string, user: string) {
    const acionCheck = [{
        action_type: actionType,
        bank_name: bankName,
    }];
    const actionResult = await invoke(configure.CHANNEL_NAME, "token", "action/ActionCheck", acionCheck);

    const result = decisionResult(actionResult);
    console.log(result)
    const re = await transferToken({
        bank_name: bankName,
        token_name: dummy[count].token_type,
        from: admin,
        to: user,
        value: dummy[count++].reward,
    }, 'reward');

    return re;
    // if (result.valid_action) {
    //     const re = await transferToken({
    //         bank_name: bankName,
    //         token_name: result.token_type,
    //         from: admin,
    //         to: user,
    //         value: result.reward,
    //     }, 'reward');

    //     return re;
    // } else {
    //     throw "invalid action: " + result.result;
    // }

}

export async function getActions(bankName: string) {
    const params = [{
        bank_name: bankName,
    }];

    const resultQuery = await query(configure.CHANNEL_NAME, "token", "action/GetActionList", params);
    const result = decisionResult(resultQuery);

    return {
        action_policies: result,
    };
}

export async function deleteActions(bankName: string, tokenName: string) {
    const params = [{
        bank_name: bankName,
        type: tokenName,
    }];

    const resultQuery = await invoke(configure.CHANNEL_NAME, "token", "action/DeleteActionPolicy", params);
    const result = decisionResult(resultQuery);

    return result;
}