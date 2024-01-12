import {
    KeyHelper,
    SignedPublicPreKeyType,
    SignalProtocolAddress,
    SessionBuilder,
    PreKeyType,
    SessionCipher,
    MessageType,
  } from "@privacyresearch/libsignal-protocol-typescript";

class Protocol {

    /**
     * @param {*} storage 
     */
    constructor(storage) {
        this.storage = storage

        this.adiStore = new SignalProtocolStore()
        this.brunhildeStore = new SignalProtocolStore()
    }
}