export const getAuth = (name: string): string | undefined => localStorage.getItem(name) ?? undefined
export const setAuth = (name: string, value: string) => localStorage.setItem(name, value)
export const removeAuth = (name: string) => localStorage.removeItem(name)
export const hasAuth = (name: string) => !!localStorage.getItem(name)
export const removeAllAuth = () => localStorage.clear()
