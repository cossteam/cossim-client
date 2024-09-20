// import VirtualList from './virtual-list'
import { useCallback } from 'react'
import VirtualizedList from './virtual-list'

const defaultDataSource = Array.from({ length: 100 }).map((_, index) => index)
const Example = () => {
    const renderItem = useCallback((item: any, index: number) => {
        return <div className="p-5 border h-[80px]">{item}</div>
    }, [])
    return (
        <div className="h-[300px] p-6">
            <VirtualizedList
                data={defaultDataSource}
                height="100%"
                // inverse={true}
                renderItem={renderItem}
            />
        </div>
    )
}
export default Example
