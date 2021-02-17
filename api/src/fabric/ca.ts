import FabricCAServices from 'fabric-ca-client'
import { X509WalletMixin, Gateway, Identity } from 'fabric-network'
import FabricClient, { User } from 'fabric-client'

import { ccp } from './config/connection'
import { wallet } from './config/wallet'

export async function getUser(userId: string) {
    const client = new FabricClient();
    const userIdentity = await wallet.export(userId)
    if (!userIdentity) {
        throw "not enrolled user: " + userId;
    }
    // const user = await client.createUser({
    //     username: userId,
    //     mspid: "Org1MSP",
    //     skipPersistence: true,
    //     cryptoContent: {
    //         privateKeyPEM:(<any>userIdentity).privateKey,
    //         signedCertPEM: (<any>userIdentity).certificate,
    //     }
    // });
    return {
        priv: (<any>userIdentity).privateKey,
        cert: (<any>userIdentity).certificate,
    };
}

export async function getGateway(userID: string): Promise<Gateway> {
    const gatewayUser = new Gateway()
    await gatewayUser.connect(ccp, {
        wallet: wallet,
        identity: userID,
        discovery: {
            enabled: false

    }});
    return gatewayUser;
}

export async function enrollAdmin(adminID: string, adminPassword: string, orgMspID: string, caURL: string): Promise<any> {
    var msg,err
    try {
        const cu = ccp.certificateAuthorities[caURL].url;
        const ca = new FabricCAServices(cu);
        const adminExists = await wallet.exists(adminID);
        if (adminExists) {
            throw `An identity for the ${adminID} already exists in the wallet`;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: adminID, enrollmentSecret: adminPassword });
        const identity = X509WalletMixin.createIdentity(orgMspID, enrollment.certificate, enrollment.key.toBytes());

        await wallet.import(adminID, identity);
        msg = `Successfully enrolled admin user and imported it into the wallet`;
        console.log(msg);
        err = false;
        return err

    } catch (err) {
        throw`Failed to enroll ${adminID}: ${err}`;
        err = true
        return err
    }
}

export async function enrollUser(adminID: string, userID: string, orgMspID: string): Promise<Identity> {
    try {
        const userExists = await wallet.exists(userID);
        if (userExists) {
            throw `An identity for the user ${userID} already exists in the wallet`;
        }

        //TODO: admin parameter
        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            throw 'An identity for the admin user "admin" does not exist in the wallet';
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet: wallet,
            identity: adminID,
            discovery: {
                enabled: false
            }
        });

        // Get the CA client object from the gateway for interacting with the CA.
        const adminIdentity = gateway.getCurrentIdentity();
        const ca = gateway.getClient().getCertificateAuthority();

        const secret = await ca.register({ affiliation: '', enrollmentID: userID, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(orgMspID, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(userID, userIdentity);
        // return `Successfully registered and enrolled user : ${userID} and imported it into the wallet`;
        return userIdentity;
    } catch (err) {
        throw `Failed to enroll ${userID}: ${err}`;
    }
}