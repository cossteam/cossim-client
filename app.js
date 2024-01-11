/**
 * @description libsignal 实现加密流程
 * @See https://www.cnblogs.com/over140/p/8683171.html
 */
const Signal = require('libsignal')

// crypto

// Signal {
//     crypto: {
//       deriveSecrets: [Function: deriveSecrets],
//       decrypt: [Function: decrypt],
//       encrypt: [Function: encrypt],
//       hash: [Function: hash],
//       calculateMAC: [Function: calculateMAC],
//       verifyMAC: [Function: verifyMAC]
//     },
//     curve: {
//       createKeyPair: [Function (anonymous)],
//       calculateAgreement: [Function (anonymous)],
//       calculateSignature: [Function (anonymous)],
//       verifySignature: [Function (anonymous)],
//       generateKeyPair: [Function (anonymous)]
//     },
//     keyhelper: {
//       generateIdentityKeyPair: [Function (anonymous)],
//       generateRegistrationId: [Function (anonymous)],
//       generateSignedPreKey: [Function (anonymous)],
//       generatePreKey: [Function (anonymous)]
//     },
//     ProtocolAddress: [class ProtocolAddress],
//     SessionBuilder: [class SessionBuilder],
//     SessionCipher: [class SessionCipher],
//     SessionRecord: [class SessionRecord],
//     SignalError: [class SignalError extends Error],
//     UntrustedIdentityKeyError: [class UntrustedIdentityKeyError extends SignalError],
//     SessionError: [class SessionError extends SignalError],
//     MessageCounterError: [class MessageCounterError extends SessionError],
//     PreKeyError: [class PreKeyError extends SessionError]
//}

console.log('Signal', Signal)

// 1. 生成身份密钥对 身份密钥对
const identityKeyPair = Signal.keyhelper.generateIdentityKeyPair()
// 2. 生成注册ID
const registrationId = Signal.keyhelper.generateRegistrationId()
// 3. 生成签名预密钥，提供身份密钥对  已签名的预共享密钥
const signedPreKey = Signal.keyhelper.generateSignedPreKey(identityKeyPair, registrationId)
// 4. 生成预密钥
const preKey = Signal.keyhelper.generatePreKey(registrationId)

console.log('生成密钥对', identityKeyPair)
console.log('生成注册ID', registrationId)
console.log('生成签名预密钥', signedPreKey)
console.log('生成预密钥', preKey)

// 5. 在注册时，WhatsApp 客户端将身份公钥（public Identity Key）、已签名的预共享公钥（public Signed Pre Key）
// 和一批一次性预共享公钥（One-Time Pre Keys）发送给服务器。服务器存储用户身份相关的公钥。 服务器无法访问任何客户端的私钥。

// 6. 会话
// 接受对方的公钥、已签名的预共享公钥、一次性预共享密钥（One-Time Pre Keys）来生成一个会话密钥。
// const fpublicKey = 'receiver_public_key'
// const fsignedPreKey = 'receiver_signed_pre_key'
// const fpreKey = 'receiver_pre_key'
// //
// // 6. 发送方使用接收方的身份密钥和会话密钥加密消息
// const senderSessionBuilder = new Signal.SessionBuilder(identityKeyPair, 'receiver_device_id')
// const senderCipherText = senderSessionBuilder.processPreKey(preKey)

// // 7. 接收方使用自己的身份密钥和会话密钥解密消息
// const receiverSessionBuilder = new Signal.SessionBuilder(identityKeyPair, 'sender_device_id')
// const receiverPlainText = receiverSessionBuilder.process(senderCipherText)

// // 8. 使用协商好的临时对话密钥对消息进行加密
// const senderCipher = new Signal.SessionCipher(identityKeyPair, registrationId, 'receiver_device_id')
// const message = '你好，世界！'
// const encryptedMessage = senderCipher.encrypt(message)

// // 9. 解密接收到的消息
// const receiverCipher = new Signal.SessionCipher(identityKeyPair, registrationId, 'sender_device_id')
// const decryptedMessage = receiverCipher.decrypt(encryptedMessage)

// console.log('解密后的消息:', decryptedMessage)
