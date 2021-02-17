'use strict';
import request from 'request';
//const request = require('request');
const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const ccpPath = path.resolve(__dirname,'../','../','../','network','connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

//const clientKey = fs.readFileSync(ccp.client.tls.keyfile);
//const clientCert = fs.readFileSync(ccp.client.tls.certfile);

const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);


export async function Logininvoke (channelName:string, chaincodeName: string, functionName: string, params: (string | string[])){
    var result = null;
    var error = null;
    var args = [functionName, params]
    try {
        const user = 'admin';
        const gateway = new Gateway();
        const options = {
            wallet: wallet,
            identity: user,
            discovery: {enabled: false, asLocalhost: false},
        };
        await gateway.connect(ccp, options);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        result = await contract.submitTransaction(...args);
        console.log(result.toString());
        await gateway.disconnect();
        return JSON.parse(result);
    } catch (err) {
        error = err;
        console.error(`Failed to invoke transaction:`);
    }
}


export async function invoke (channelName:string, chaincodeName: string, functionName: string, params: (string | string[])){
    var result = null;
    var error = null;
    var args = [functionName, ...params]
    try {
        const user = 'admin';
        const gateway = new Gateway();
        const options = {
            wallet: wallet,
            identity: user,
            discovery: {enabled: false, asLocalhost: false},
        };
        await gateway.connect(ccp, options);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        result = await contract.submitTransaction(...args);
        console.log(result.toString());
        await gateway.disconnect();
        //return JSON.parse(result.toString()).message;
        return JSON.parse(result);
    } catch (err) {
        error = err;
        console.error(`Failed to invoke transaction:`);
    }
}

export async function query (channelName:string, chaincodeName: string, functionName: string,  params: (string | string[])){
    try {
        const user = 'admin';
        var args = [functionName, ...params]
        const gateway = new Gateway();
        const options = {
            wallet: wallet,
            identity: user,
            discovery: {enabled: false, asLocalhost: false},
        };
        await gateway.connect(ccp, options);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        let result = await contract.evaluateTransaction(...args);
        console.log(result.toString());
        await gateway.disconnect();
        // return JSON.parse(result.toString()).message;
        return JSON.parse(result);
    } catch (error) {
        console.error(`Failed to query transaction:`);
    }
}


export async function enroll (user: string, password: string, orgMspID:string, caURL: string) : Promise<any> {
    var msg,err
    try {
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[caURL].url;
        const caTLSCACerts = caInfo.tlsCACerts.path;
        const ca = new FabricCAServices(caInfo, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists(user);
        if (adminExists) {
            console.log('An identity for the admin user already exists in the wallet');
            return;
        }
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: user, enrollmentSecret: password});
        const identity = X509WalletMixin.createIdentity(orgMspID,enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(user, identity);
        msg = `Successfully enrolled admin user and imported it into the wallet`;
        console.log(msg);
        err = false;
        return err
    } catch (error) {
        err = true;
        msg = error;
        return error
    }
}
