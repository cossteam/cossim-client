import { useEffect, useRef } from 'react'
import { VList, VListHandle } from 'virtua'

interface VirtuaProps {
    height: number
    children: React.ReactNode
    reverse?: boolean
    count?: number
}

/**
 *
 * @deprecated 可能需要修改，先暂时不使用
 */
const Virtua: React.FC<VirtuaProps> = ({ height, children, reverse = false, count }) => {
    const ref = useRef<VListHandle>(null)

    useEffect(() => {
        ref.current?.scrollToIndex(999)
    }, [])

    // const createRows = useCallback((num: number) => {
    //     return Array.from({ length: num }, (_, i) => <div key={i}>{i}</div>)
    // }, [])

    return (
        <VList
            ref={ref}
            style={{
                height
            }}
            count={count}
            reverse={reverse}
        >
            {/* {createRows(10)} */}
            {children}
        </VList>
    )
}

export default Virtua
