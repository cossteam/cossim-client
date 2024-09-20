export interface VirtualListOptions<T = any> {
    viewportHeight?: number
    itemHeight?: number
    dataSource: T[]
}

export class VirtualList<T> {
    /** 源数据 */
    private dataSource!: T[]

    private el!: HTMLDivElement
    private options!: VirtualListOptions<T>

    private viewportHeight!: number
    private itemCount!: number
    private currentIndex!: number

    private currentSource!: T[]

    constructor(el: HTMLDivElement, options: VirtualListOptions) {
        this.el = el
        this.options = options

        this.el.addEventListener('scroll', this.onScroll.bind(this))
    }

    init() {
        // 获取容器的高度
        this.viewportHeight = this.options?.viewportHeight || this.el.clientHeight
        this.dataSource = this.options?.dataSource || []
        this.itemCount = this.dataSource.length
    }

    onScroll(e: Event) {}
}
