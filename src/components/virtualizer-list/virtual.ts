export interface VirtualProps<T> {
    data: T[]
    itemHeight?: number
    height: number
    onScroll?: (startIndex: number, endIndex: number) => void
    renderItem: (item: T, index: number) => JSX.Element
    onResize?: (height: number) => void
}

// TODO: implement Virtual class
class Virtual<T> {
    data: T[]
    visibleData: T[]
    itemHeight: number
    height: number
    container: HTMLDivElement
    options: VirtualProps<T>

    constructor(el: HTMLDivElement, options: VirtualProps<T>) {
        this.data = options.data
        this.itemHeight = options.itemHeight ?? 50
        this.visibleData = []
        this.height = options.height
        this.container = el
        this.options = options
        this.container.addEventListener('scroll', this.handlerScroll.bind(this))
        this.initContainerStyle()
        this.calculateVisibleData()
    }

    initContainerStyle() {
        this.container.style.overflowY = 'auto'
        this.container.style.height = `${this.height}px`
    }

    calculateVisibleIndices() {
        const startIndex = Math.floor(this.container.scrollTop / this.itemHeight)
        const endIndex = Math.ceil((this.container.scrollTop + this.height) / this.itemHeight)
        return { startIndex, endIndex }
    }

    calculateVisibleData() {
        const { startIndex, endIndex } = this.calculateVisibleIndices()
        this.visibleData = this.data.slice(startIndex, endIndex)
    }

    handlerScroll() {
        const { startIndex, endIndex } = this.calculateVisibleIndices()
        this.visibleData = this.data.slice(startIndex, endIndex)
        if (this.options.onScroll) {
            this.options.onScroll(startIndex, endIndex)
        }
        console.log('startIndex: ', startIndex, 'endIndex: ', endIndex)

        this.render()
    }

    render() {
        // remove all children
        // render visible data with renderItem
        console.log('render')
    }
}

export default Virtual
