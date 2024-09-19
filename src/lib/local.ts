export function getLocal(key: string): string {
    return localStorage.getItem(key) || ''
}

export function setLocal(key: string, value: string): void {
    localStorage.setItem(key, value)
}

export function removeLocal(key: string): void {
    localStorage.removeItem(key)
}

export function clearLocal(): void {
    localStorage.clear()
}
