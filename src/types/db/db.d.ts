import Dexie from 'dexie'

export interface serviceOptions {
	db: Dexie
	defaultKey?: string
}

export interface ServiceMixin {
	findOneById(tableName: string, key: string, value: string): Promise<any>
	findOneAllById(tableName: string, key: string, value: string): Promise<any>
	findAll(tableName: string): Promise<any[]>
	add(table: string, data: any): Promise<any>
	bulkAdd(table: string, data: any[]): Promise<any>
	update(table: string, key: string, value: string, data: any): Promise<any>
	delete(table: string, key: string, value: string): Promise<number>
	clear(table: string): Promise<void>
}
