export interface VirtualProps {
    dataKey: string | ((...args: any[]) => any)
    dataSources: any[] // 可以更具体地定义数组内容的类型
    dataComponent: any // 具体的组件类型可以替换

    keeps?: number
    extraProps?: Record<string, any> // 可以根据需要更具体
    estimateSize?: number

    direction?: 'vertical' | 'horizontal'
    start?: number
    offset?: number
    topThreshold?: number
    bottomThreshold?: number
    pageMode?: boolean
    rootTag?: string
    wrapTag?: string
    wrapClass?: string
    wrapStyle?: Record<string, any> // 根据需要更具体
    itemTag?: string
    itemClass?: string
    itemClassAdd?: (...args: any[]) => any // 更具体的函数类型
    itemStyle?: Record<string, any> // 根据需要更具体
    headerTag?: string
    headerClass?: string
    headerStyle?: Record<string, any> // 根据需要更具体
    footerTag?: string
    footerClass?: string
    footerStyle?: Record<string, any> // 根据需要更具体
    itemScopedSlots?: Record<string, any> // 根据需要更具体
}

export interface ItemProps {
    index?: number
    event?: string
    tag?: string
    horizontal?: boolean
    source?: any // 具体类型可以替换
    component?: any // 具体的组件类型可以替换
    slotComponent?: (...args: any[]) => any // 更具体的函数类型
    uniqueKey?: string | number
    extraProps?: Record<string, any> // 根据需要更具体
    scopedSlots?: Record<string, any> // 根据需要更具体
    className?: string
    style?: Record<string, any> // 根据需要更具体
}

export interface SlotProps {
    event?: string
    uniqueKey?: string
    tag?: string
    horizontal?: boolean
    children?: React.ReactNode
}
