import { RefObject, useEffect, useState } from 'react'

const useElementRendered = (element: RefObject<Element>) => {
    const [rendered, setRendered] = useState<boolean>(false)

    useEffect(() => {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (element.current) {
                        setRendered(true)
                        observer.disconnect()
                    }
                }
            }
        })

        const config = { childList: true, subtree: true }
        const targetNode = document.documentElement
        observer.observe(targetNode, config)

        if (element.current) {
            setRendered(true)
            observer.disconnect()
        }

        return () => observer.disconnect()
    }, [element])

    return { rendered }
}

export default useElementRendered
