import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { Drivers, Storage } from '@ionic/storage'
import useUserStore from '@/stores/user'

const { userId } = useUserStore.getState()
const tableName = `CacheCoss-${userId}`

const cacheStore = new Storage({
	name: tableName,
	storeName: 'CacheCoss',
	driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
})

await cacheStore.defineDriver(CordovaSQLiteDriver)
await cacheStore.create()

export default cacheStore
