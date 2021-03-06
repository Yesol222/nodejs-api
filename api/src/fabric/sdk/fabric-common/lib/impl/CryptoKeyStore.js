/*
 Copyright 2016, 2018 IBM All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/

'use strict';
const {Utils: utils} = require('../../');
const jsrsasign = require('jsrsasign');
const KEYUTIL = jsrsasign.KEYUTIL;

const ECDSAKey = require('./ecdsa/key.js');

/*
 * The mixin enforces the special indexing mechanism with private and public
 * keys on top of a standard implementation of the KeyValueStore interface
 * with the getKey() and putKey() methods
 */
const CryptoKeyStoreMixin = (KeyValueStore) => class extends KeyValueStore {
	getKey(ski) {
		const self = this;

		// first try the private key entry, since it encapsulates both
		// the private key and public key
		return this.getValue(_getKeyIndex(ski, true))
			.then((raw) => {
				if (raw !== null) {
					const privKey = KEYUTIL.getKeyFromPlainPrivatePKCS8PEM(raw);
					// TODO: for now assuming ECDSA keys only, need to add support for RSA keys
					return new ECDSAKey(privKey);
				}

				// didn't find the private key entry matching the SKI
				// next try the public key entry
				return self.getValue(_getKeyIndex(ski, false));
			}).then((key) => {
				if (key instanceof ECDSAKey) {
					return key;
				}

				if (key !== null) {
					const pubKey = KEYUTIL.getKey(key);
					return new ECDSAKey(pubKey);
				}
			});
	}

	putKey(key) {
		const idx = _getKeyIndex(key.getSKI(), key.isPrivate());
		const pem = key.toBytes();
		return this.setValue(idx, pem)
			.then(() => {
				return key;
			});
	}
};

/**
 * A CryptoKeyStore uses an underlying instance of {@link module:api.KeyValueStore} implementation
 * to persist crypto keys.
 *
 * @param {function} KVSImplClass Optional. The built-in key store saves private keys.
 *    The key store may be backed by different {@link KeyValueStore} implementations.
 *    If specified, the value of the argument must point to a module implementing the
 *    KeyValueStore interface.
 * @param {Object} opts Implementation-specific option object used in the constructor
 *
 * @class
 */
const CryptoKeyStore = function (KVSImplClass, opts) {
	let superClass;

	if (typeof KVSImplClass !== 'function') {
		let impl_class = utils.getConfigSetting('crypto-value-store');
		if (!impl_class) {
			impl_class = utils.getConfigSetting('key-value-store');
		}
		superClass = require(impl_class);
	} else {
		superClass = KVSImplClass;
	}

	if (KVSImplClass !== null && typeof opts === 'undefined') {
		// the function is called with only one argument for the 'opts'
		opts = KVSImplClass;
	}

	const MyClass = class extends CryptoKeyStoreMixin(superClass) {
	};
	return new MyClass(opts);
};

function _getKeyIndex(ski, isPrivateKey) {
	if (isPrivateKey) {
		return ski + '-priv';
	} else {
		return ski + '-pub';
	}
}

module.exports = CryptoKeyStore;
