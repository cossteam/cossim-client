/**
 * @description 小驼峰转换为横线连接
 * @param str
 */
export const transformNameToLine = (str: string): string => {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 根据每个对象的“group”属性将对象数组转换为组。
 *
 * @param {any[]} array -对象的输入数组
 * @return {Object} 一个对象，其中键是组名称，值是属于每个组的对象数组
 */
export const arrayToGroups = (array: any[]) => {
    array = !Array.isArray(array) ? [] : array
    array = array.filter((v) => v.group)
    return array.reduce((result, user) => {
        const group = user.group
        if (!group) return result
        if (!result[group]) result[group] = []

        result[group].push(user)
        return result
    }, {})
}

/**
 * 将组对象转换为对象数组。
 *
 * @param {Object} groups -对象的输入数组
 * @return {any[]} 一个对象数组
 */
export const groupsToArray = (groups: any): any[] => {
    return Object.entries(groups).reduce((result, [key, value]) => {
        // @ts-ignore
        const list = value.map((v) => ({ ...v, group: key }))
        // @ts-ignore
        return result.concat(list)
    }, [])
}
