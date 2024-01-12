import {
    KeyHelper,
    SignedPublicPreKeyType,
    SignalProtocolAddress,
    SessionBuilder,
    PreKeyType,
    SessionCipher,
    MessageType,
} from "@privacyresearch/libsignal-protocol-typescript"
import { SignalProtocolStore } from "./storage-type"
// import { SignalDirectory } from "@/utils/signal-directory"


export async function createIdentity(name, identifier, deviceId, directory) {
    const address = new SignalProtocolAddress(identifier, deviceId)
    const store = new SignalProtocolStore()

    // 生成一个注册id
    const registrationId = KeyHelper.generateRegistrationId()

    // 存储注册id
    store.put(`registrationID`, registrationId)

    // 生成身份密钥对
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair()

    // 存储身份密钥
    store.put(`identityKey`, identityKeyPair)

    // 生成一个预共享密钥
    const baseKeyId = Math.floor(10000 * Math.random())

    // 存储预密钥
    const preKey = await KeyHelper.generatePreKey(baseKeyId)

    // 存储预密钥
    store.storePreKey(`${baseKeyId}`, preKey.keyPair);

    // 随机生成一个签名密钥 id
    const signedPreKeyId = Math.floor(10000 * Math.random())

    // 生成签名密钥
    const signedPreKey = await KeyHelper.generateSignedPreKey(
        identityKeyPair,
        signedPreKeyId
    )

    store.storeSignedPreKey(`${signedPreKeyId}`, signedPreKey.keyPair);

    const publicSignedPreKey = {
        keyId: signedPreKeyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
    }

    // 现在我们将其注册到服务器，以便所有用户都可以看到它们
    const publicPreKey = {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
    }

    directory.storeKeyBundle(name, {
        registrationId,
        identityPubKey: identityKeyPair.pubKey,
        signedPreKey: publicSignedPreKey,
        oneTimePreKeys: [publicPreKey],
    })

    return {
        publicPreKey,
        directory,
        store,
        address
    }
}