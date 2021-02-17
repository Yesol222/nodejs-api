import { User as RestUser, LoginRequest } from '../../rest/user'
import { createHmac } from 'crypto';
import { enrollUser } from '../../../fabric/ca';
import { configure } from '../../../common/config';
import { Logininvoke, query } from '../../../fabric/fabric-module';
import { decisionResult} from './common';
import { Jwt } from '../../rest/jwt';

export class User implements RestUser{
    orcid: string;
    name: string;
    email: string;
    bank_name: string;
    password: string;
    authority: boolean;
    certificate?: string;

    constructor(user: RestUser) {
        this.orcid = user.orcid;
        this.name = user.name;
        this.email = user.email;
        this.bank_name = user.bank_name;
        this.authority = user.authority;
        //this.password = createHmac('sha256', user.password).update('good').digest('hex');
        this.password = user.password
    }

    async registerUser(): Promise<Jwt> {
        // console.log('start')
        // const enrollUserResult = await enrollUser("admin", this.orcid, "Org1MSP");
        // console.log(enrollUserResult)

        // this.certificate = (<any>enrollUserResult).certificate;
        const params = JSON.stringify(this);
        console.log('start2')
        const invokeResult = await Logininvoke(configure.CHANNEL_NAME, configure.CHAINCODE_NAME, 'user/RegisterAdmin', params);

        console.log('start3')
        const result = decisionResult(invokeResult);

        return result as Jwt;
    }
}

export async function getUserJwt(loginReq: LoginRequest): Promise<Jwt> {
    //loginReq.password = createHmac('sha256', loginReq.password).update('good').digest('hex');
    const params = JSON.stringify(loginReq);
    const invokeResult = await Logininvoke(configure.CHANNEL_NAME, configure.CHAINCODE_NAME,'user/AdminSignIn', params)
    const result = decisionResult(invokeResult);

    return result as Jwt;
}

export async function checkJwt(jwtData: Jwt): Promise<Jwt> {
    const params = JSON.stringify(jwtData);
    const invokeResult = await query(configure.CHANNEL_NAME, configure.CHAINCODE_NAME , 'jwt/CheckJwt', params);
    const result = decisionResult(invokeResult);
    return result as Jwt;
}