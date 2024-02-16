/**
 * 验证邮箱格式是否有效
 * @param email 邮箱地址
 * @returns 如果邮箱格式有效则返回true，否则返回false
 */
export function validEmail(email: string) {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证手机号码格式是否有效
 * @param phone 手机号码
 * @returns 如果手机号码格式有效则返回true，否则返回false
 */
export function validPhone(phone: string) {
	return /^1[3|4|5|7|8][0-9]{9}$/.test(phone)
}

/**
 * 验证密码
 * @param password 密码
 * @returns 如果密码格式有效则返回true，否则返回false
 */
export function validPassword(password: string) {
	return /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,50}$/.test(password)
}
