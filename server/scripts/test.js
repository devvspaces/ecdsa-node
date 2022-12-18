const secp = require("ethereum-cryptography/secp256k1")
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { extractPublicKey } = require('../services')


let privateKey = secp.utils.randomPrivateKey();
let pubKey = secp.getPublicKey(privateKey)

console.log("Full public key:", toHex(pubKey))

pubKey = extractPublicKey(pubKey)
let privKey = toHex(privateKey)

console.log("Private key:", privKey)
console.log("Public key:", pubKey)

let data = {
    test: "test message"
}
let dataStr = JSON.stringify(data)

let dataHash = toHex(keccak256(utf8ToBytes(dataStr)))

secp.sign(secp.utils.hexToBytes(dataHash), privKey, { recovered: true }).then(data => {
    const [signature, recovery_bit] = data

    const fullSignature =  toHex(signature)
    console.log("Your Signature:", fullSignature)
    console.log("Your Recovery Bit:", recovery_bit)

    console.log("\n\n")

    const msgHash = keccak256(utf8ToBytes(dataStr));
    const sigPubKey = secp.recoverPublicKey(msgHash, fullSignature, recovery_bit);
    const mainKey = extractPublicKey(sigPubKey);
    console.log("Full public key:", toHex(sigPubKey))
    console.log("Public key:", mainKey)
})
