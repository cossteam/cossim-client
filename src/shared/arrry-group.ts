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
