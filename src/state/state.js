/**
 * @description 全局状态管理
 * 管理一些全局状态
 */
import { BehaviorSubject } from 'rxjs'

// 全局预共享密钥
export const preKeyGlobal = new BehaviorSubject([])

// 全局 signal
export const signalGlobal = new BehaviorSubject(null)