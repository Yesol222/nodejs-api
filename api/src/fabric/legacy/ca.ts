import FabricClient, { Channel, User } from 'fabric-client';
import path from 'path'
import fs from 'fs-extra'
import { resolve } from 'path';

function readAllFiles(dir: string) {
	const files = fs.readdirSync(dir);
	const certs: string[] = [];
	files.forEach((file_name) => {
		const file_path = path.join(dir, file_name);
		const data = fs.readFileSync(file_path);
		certs.push((<any>data));
	});
	return certs;
}

export async function getUser(userName: string) {
    const {admin, user1, user2} = await createUsers();

    let user: User = admin;
    switch(userName) {
        case 'admin': 
        break;
        case 'user1': 
        user = user1;
        break;
        case 'user2': 
        user = user2;
        break;
        default: throw "invalid user name: " + userName
    }
    return user;
}

export function getUserMSP(userName: string) {
	let msp = resolve(__dirname, '..', '..', '..', '..', 'network', 'crypto-config');
    switch(userName) {
		case 'admin': 
		msp = msp + '/peerOrganizations/org1.kisti.re.kr/users/Admin@org1.kisti.re.kr/msp'
        break;
		case 'user1': 
		msp = msp + '/peerOrganizations/org1.kisti.re.kr/users/User1@org1.kisti.re.kr/msp'
        break;
        case 'user2': 
		msp = msp + '/peerOrganizations/org1.kisti.re.kr/users/User2@org1.kisti.re.kr/msp'
        break;
        default: throw "invalid user name: " + userName
	}
	return msp;
}

export async function createUsers() {
    const client = new FabricClient();

    let keyPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/Admin@org1.kisti.re.kr/msp/keystore');
	let keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
	let certPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/Admin@org1.kisti.re.kr/msp/signcerts');
	let certPEM = readAllFiles(certPath)[0];

	let user_opts = {
		username: 'admin',
		mspid: 'Org1MSP',
		skipPersistence: true,
		cryptoContent: {
			privateKeyPEM: keyPEM,
			signedCertPEM: certPEM
		}
	};
	const admin = await client.createUser(user_opts);

	// load user1
	keyPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/User1@org1.kisti.re.kr/msp/keystore');
	keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
	certPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/User1@org1.kisti.re.kr/msp/signcerts');
	certPEM = readAllFiles(certPath)[0];

	user_opts = {
		username: 'user1',
		mspid: 'Org1MSP',
		skipPersistence: true,
		cryptoContent: {
			privateKeyPEM: keyPEM,
			signedCertPEM: certPEM
		}
	};
	const user1 = await client.createUser(user_opts);

	// load user2
	keyPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/User2@org1.kisti.re.kr/msp/keystore');
	keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
	certPath = path.join(__dirname, '../../../../network/crypto-config/peerOrganizations/org1.kisti.re.kr/users/User2@org1.kisti.re.kr/msp/signcerts');
	certPEM = readAllFiles(certPath)[0];

	user_opts = {
		username: 'user2',
		mspid: 'Org1MSP',
		skipPersistence: true,
		cryptoContent: {
			privateKeyPEM: keyPEM,
			signedCertPEM: certPEM
		}
	};
	const user2 = await client.createUser(user_opts);

	return {admin: admin, user1: user1, user2: user2}; 
}

export async function createFabricClient() {
    const fabric_client = new FabricClient();

	const channel = fabric_client.newChannel('mychannel');

	const peer = fabric_client.newPeer('grpc://localhost:7051');

	const orderer = fabric_client.newOrderer('grpc://localhost:7050');

	(<any>channel).addPeer(peer);
	channel.addOrderer(orderer);

	return {fabricClient: fabric_client, channel: channel};
}