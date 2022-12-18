const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { extractPublicKey } = require('../services')


let privateKey = secp.utils.randomPrivateKey();
let pubKey = secp.getPublicKey(privateKey)

pubKey = extractPublicKey(pubKey)

console.log("Private key:", toHex(privateKey))
console.log("Public key:", pubKey)
