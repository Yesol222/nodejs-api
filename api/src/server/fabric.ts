import { createHmac } from "crypto";
import { enrollAdmin as ea, enrollUser as eu, getGateway } from "../fabric/ca"
import { query, invoke, issue, list, transfer } from "../fabric/go-api"
import { getUser, getUserMSP } from "../fabric/legacy/ca"
import { setPeriod } from "./thirdparty/period";
import { configure } from "../common/config";
import { User } from './rest/user';

const ADMIN_ID = "admin"
const KERIS_CA_URL = "ca.kisti.re.kr";
const ORG1_MSP_ID = "Org1MSP";
const CHANNEL_NAME = "mychannel"

type Result = string | object;

export async function version() {
    const ccResult = await invoke(CHANNEL_NAME, "token", "Version", []);

    return ccResult.message
}

export async function enrollAdmin(adminId: string, adminPassword: string): Promise<Result> {
    return await ea(adminId, adminPassword, ORG1_MSP_ID, KERIS_CA_URL);

}

//TODO: unregist user
export async function enrollUser(userId: string): Promise<Result> {
    return await eu(ADMIN_ID, userId, ORG1_MSP_ID);
}

export async function generateToken(adminOrcid: string, bankName: string, tokenType: string, tokenQuantity: number, inflationType: string, baseLineType: string, period: string, inflationValue: number): Promise<Result> {
    // const userMsp = getUserMSP(userID);
    const adminMsp = getUserMSP(configure.ADMIN_ID);
    // const tokenValue = await issue(ORG1_MSP_ID, adminMsp, makeTokenType(bankName, tokenType, adminOrcid), tokenQuantity);

    // const admin = await getUser(configure.ADMIN_ID);
    // const pubkey = (<any>admin.getSigningIdentity())._publicKey._key.pubKeyHex;
    const param = {
        admin_orcid: adminOrcid,
        bank_name: bankName,
        token_type: tokenType,
        initialization_balance: tokenQuantity,
        inflation_policy: {
            inflation_type: inflationType,
            base_line_type: baseLineType,
            period: period,
            inflation_value: inflationValue
        }
    };
    const params = [param]
    console.log(params);
    const result = await invoke(CHANNEL_NAME, "token", "bank/GenerateToken", params);

    if (result.code == 0) {
        // setPeriod(bankName, tokenType, period, inflate)
        setHistory(
            bankName,tokenType, adminOrcid, tokenQuantity, 'issue'
        )
        return result.message;
    } else {
        // TODO: make redeem
        // await redeem(userID, tokenQuantity, tokenType);
        throw result.message;
    }
}

export async function getUserInfo(userName: string) {
    // return await list(getUserMSP(userName));
}

export async function getToken(bankname: string, tokenType: string) {
    const admin = await getUser(ADMIN_ID);
    const pubkey = (<any>admin.getSigningIdentity())._publicKey._key.pubKeyHex;
    const param = {
        admin_key: pubkey,
        bank_name: bankname,
        token_type: tokenType
    }
    const params = [param]
    const result= await query(CHANNEL_NAME, "token", "bank/GetToken", params);
    if (result.code == 0) {
        return result.message;
    } else {
        throw result.message;
    }
}

export async function tokenTransfer(userName: string, recipientName: string, quantity: number, tokenType: string) {
    // const user1 = userName
    // const user1Msp = getUserMSP(user1);
	// const user2 = recipientName;
    // const user2Msp = getUserMSP(user2);
	// let amount = quantity;

    // const tokens = (<any[]>await list(getUserMSP(user1)))

    // if (!tokens) {
    //     throw list(userName);
    // }
	// const typeList = tokens.filter(f => f.type === tokenType);
	// for(let i = 0; i < typeList.length && amount > 0; i++) {
	// 	const v = typeList[i];
	// 	const value = v.quantity;
	// 	let send = 0;
	// 	if(amount < value) {
	// 		send = amount;
	// 		amount = 0;
	// 	} else {
	// 		amount = amount - value;
	// 		send = value;
    //     }
        
    //     const tokenId = `[{"tx_id":"${v.id.tx_id}"` + ((v.id.index)? `,"index":` + v.id.index : '') + `}]`

    //     await transfer(user1Msp, tokenId, ORG1_MSP_ID, user2Msp, send);
    // }

    // return list(userName);
}

export async function inflate(bankName: string, tokenType: string) {
    // const tokens = (<any[]>await list(getUserMSP(ADMIN_ID)));
    console.log("call inflate!!")
    // if (!tokens) {
    //     throw "can't read token"
    // }
    // const typeList = tokens.filter(f => f.type === tokenType);

    let balance = 0;   
	// for(let i = 0; i < typeList.length; i++) {
	// 	const v = typeList[i];
    //     balance += parseInt(v.quantity);
    // }

    // const param = {
    //     bank_name: bankName,
    //     token_type: tokenType,
    //     bank_balance: balance
    // }
    // const params = [param]
    // const result= await invoke(CHANNEL_NAME, "token", "bank/InflateToken", params);
    // if (result.code == 0) {
        // const issuedResult = await issue(ORG1_MSP_ID, getUserMSP(ADMIN_ID), tokenType, result.message.inflated_token_value);
        //TODO:!!!!!!!!
        // setHistory(
        //     bankName,tokenType, adminOrcid, result.message.inflated_token_value, 'inflation'
        // ) 
        // return issuedResult; //TODO: fix format
    //     return null;
    // } else {
    //     throw result.message;
    // }
}

export async function inflationPolicy(bankName: string, tokenType: string, inflationType: string, baseLineType: string, period: string, inflationValue: number) {
    const admin = await getUser(ADMIN_ID);
    const pubkey = (<any>admin.getSigningIdentity())._publicKey._key.pubKeyHex;
    const param = {
        bank_name: bankName,
        token_type: tokenType,
        admin_key: pubkey,
        inflation_policy: {
            inflation_type: inflationType,
            base_line_type: baseLineType,
            period: period,
            inflation_value: inflationValue
        }
    };
    console.log("==========================================")
    console.log(param)
    const params = [param]
    const result= await invoke(CHANNEL_NAME, "token", "bank/PutInflationPolicy", params);
    if (result.code == 0) {
        // setPeriod(bankName, tokenType, period, inflate)
        return result.message;
    } else {
        throw result.message;
    }
}

export async function action(userId: string, bankName: string, action: string) {
    const param = {
        bank_name: bankName,
        action_type: action
    };
    const params = [param]
    const result= await invoke(CHANNEL_NAME, "token", "bank/ActionCheck", params);
    if (result.code == 0 && result.message.valid_action) {
        const tokenType = result.message.token_type;
        const reward = result.message.reward;
        const res = tokenTransfer(ADMIN_ID, userId, reward, tokenType);
            //TODO:!!
    setHistory(
        bankName,tokenType, userId, reward, 'activity',
    ) 
    return res;

    } else {
        throw result.message;
    }
}

export async function actionPolicy(policyType: string, policyReward: number, policyTokenType: string, bankName: string) {
    const param = {
        type: policyType,
        token_type: policyTokenType,
        reward: policyReward,
        bank_name: bankName
    }
    const params = [param]
    const result= await invoke(CHANNEL_NAME, "token", "bank/PutActionPolicy", params);
    if (result.code == 0) {
        return result.message;
    } else {
        throw result.message;
    }
}

export async function registerUser(user: User): Promise<string> {
    const enrollUserResult = await eu(configure.ADMIN_ID, user.orcid, configure.MSP_ID);
    const hash = createHmac('sha256', user.password).update('good').digest('hex');

    const param = {
        orcid: user.orcid,
        name: name,
        bank_name: user.password,
        password: hash,
        certificate: (<any>enrollUserResult).certificate,
    };

    const params = [param];
    const result = await invoke(configure.CHANNEL_NAME, "token", "auth/RegisterAdmin", params);

return decisionResult(result);
}

export async function signinUser(orcid: string, password: string): Promise<string> {
    const hash = createHmac('sha256', password).update('good').digest('hex');
    const param = {
        orcid: orcid,
        password: hash,
    };
    const params = [param];

    const result = await invoke(configure.CHANNEL_NAME, "token", "auth/SignIn", params);

    return decisionResult(result);
}

export async function setHistory(bankName: string, tokenType: string,  to: string, value: number, historyType: string, from?: string, activityType?: string): Promise<any> {
    const param = {
        bank_name: bankName,
        token_type: tokenType,
        from: from,
        to: to,
        value: value,
        history_type: historyType,
        activity_type: activityType,
    };

    if (!from) {
        delete param['from']
    }
    if (activityType) {
        delete param['activity_type']
    }
    const params = [param];

    const result = await invoke(configure.CHANNEL_NAME, "token", "bank/PutHistory", params);

    return decisionResult(result);
}

function makeTokenType(bankName: string, tokenType: string, userOrcid: string) {
    return `${bankName}_${tokenType}_${userOrcid}`
}

function decisionResult(result: any, decision: boolean = result.code == 0): any {
    if (decision) {
        return result.message;
    } else {
        throw result.message || result;
    }
}