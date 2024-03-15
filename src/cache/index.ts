import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
// import IonicSecureStorageDriver from '@ionic-native/secure-storage'
import { Drivers, Storage } from '@ionic/storage'

const cacheStore = new Storage({
	name: 'COSS',
	storeName: 'CacheCoss',
	driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
})

await cacheStore.defineDriver(CordovaSQLiteDriver)
await cacheStore.create()

export default cacheStore
