/**
 * 将类实例转换为字符串表示形式。
 *
 * @param {any} instance -要转换的类的实例。
 * @return {Object} 类实例的字符串表示形式，包括构造函数和属性。
 */
export function classToString(instance) {
	// 把函数转换成字符串
	const constructor = instance.constructor.toString()
	// 把对象转换成字符串
	const properties = JSON.stringify({ name: instance.name })

	return { constructor, properties }
}

/**
 * 将类实例的字符串表示形式转换为实际的类实例。
 *
 * @param {object} instance -类实例的字符串表示形式。
 * @return {object|null} 转换后的类实例，如果转换失败则返回 null。
 */
export function stringToClass(instance) {
	const { constructor, properties } = instance
	if (constructor && properties) {
		const constructorFunc = new Function(`return ${constructor}`)()
		const properties = JSON.parse(properties)
		const newClass = new constructorFunc(properties.name)
		return newClass
	}
	return null
}
