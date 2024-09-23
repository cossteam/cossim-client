/**
 * virtual list core calculating center
 */
const DIRECTION_TYPE = {
    FRONT: 'FRONT', // scroll up or left
    BEHIND: 'BEHIND' // scroll down or right
} as const

const CALC_TYPE = {
    INIT: 'INIT',
    FIXED: 'FIXED',
    DYNAMIC: 'DYNAMIC'
} as const

const LEADING_BUFFER = 0

type Param = {
    keeps: number
    slotHeaderSize: number
    buffer: number
    uniqueIds: string[]
    estimateSize: number
}

type Range = {
    start: number
    end: number
    padFront: number
    padBehind: number
}

type CallUpdate = (range: Range) => void

export default class Virtual {
    param: Param | null = null
    callUpdate: CallUpdate | null = null
    sizes: Map<string, number> = new Map()
    firstRangeTotalSize: number = 0
    firstRangeAverageSize: number = 0
    fixedSizeValue: number = 0
    calcType: (typeof CALC_TYPE)[keyof typeof CALC_TYPE] = CALC_TYPE.INIT
    offset: number = 0
    direction: '' | (typeof DIRECTION_TYPE)[keyof typeof DIRECTION_TYPE] = ''
    range: Range = Object.create(null)

    constructor(param: Param, callUpdate: CallUpdate | null) {
        this.init(param, callUpdate)
    }

    init(param: Param | null, callUpdate: CallUpdate | null) {
        this.param = param
        this.callUpdate = callUpdate
        this.sizes.clear()
        this.firstRangeTotalSize = 0
        this.firstRangeAverageSize = 0
        this.fixedSizeValue = 0
        this.calcType = CALC_TYPE.INIT
        this.offset = 0
        this.direction = ''
        this.range = Object.create(null)
        if (param) {
            this.checkRange(0, param.keeps - 1)
        }
    }

    destroy() {
        this.init(null, null)
    }

    getRange() {
        const range: Range = {
            start: this.range.start,
            end: this.range.end,
            padFront: this.range.padFront,
            padBehind: this.range.padBehind
        }
        return range
    }

    isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND
    }

    isFront() {
        return this.direction === DIRECTION_TYPE.FRONT
    }

    getOffset(start: number) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + (this.param?.slotHeaderSize || 0)
    }

    updateParam<K extends keyof Param>(key: K, value: Param[K]) {
        if (this.param && key in this.param) {
            if (key === 'uniqueIds') {
                this.sizes.forEach((v, key) => {
                    if (!(value as string[]).includes(key)) {
                        this.sizes.delete(key)
                    }
                })
            }
            this.param[key] = value
        }
    }

    saveSize(id: string, size: number) {
        this.sizes.set(id, size)

        if (this.calcType === CALC_TYPE.INIT) {
            this.fixedSizeValue = size
            this.calcType = CALC_TYPE.FIXED
        } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
            this.calcType = CALC_TYPE.DYNAMIC
            this.fixedSizeValue = 0
        }

        if (this.calcType !== CALC_TYPE.FIXED && this.firstRangeTotalSize !== undefined) {
            if (this.sizes.size < Math.min(this.param!.keeps, this.param!.uniqueIds.length)) {
                this.firstRangeTotalSize = [...this.sizes.values()].reduce((acc, val) => acc + val, 0)
                this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size)
            } else {
                this.firstRangeTotalSize = 0
            }
        }
    }

    handleDataSourcesChange() {
        let start = this.range.start

        if (this.isFront()) {
            start -= LEADING_BUFFER
        } else if (this.isBehind()) {
            start += LEADING_BUFFER
        }

        start = Math.max(start, 0)

        this.updateRange(this.range.start, this.getEndByStart(start))
    }

    handleSlotSizeChange() {
        this.handleDataSourcesChange()
    }

    handleScroll(offset: number) {
        this.direction = offset < this.offset || offset === 0 ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND
        this.offset = offset

        if (!this.param) {
            return
        }

        if (this.direction === DIRECTION_TYPE.FRONT) {
            this.handleFront()
        } else if (this.direction === DIRECTION_TYPE.BEHIND) {
            this.handleBehind()
        }
    }

    handleFront() {
        const overs = this.getScrollOvers()
        if (overs > this.range.start) {
            return
        }

        const start = Math.max(overs - this.param!.buffer, 0)
        this.checkRange(start, this.getEndByStart(start))
    }

    handleBehind() {
        const overs = this.getScrollOvers()
        if (overs < this.range.start + this.param!.buffer) {
            return
        }

        this.checkRange(overs, this.getEndByStart(overs))
    }

    getScrollOvers() {
        const offset = this.offset - (this.param?.slotHeaderSize || 0)
        if (offset <= 0) {
            return 0
        }

        if (this.isFixedType()) {
            return Math.floor(offset / this.fixedSizeValue)
        }

        let low = 0
        let middle = 0
        let middleOffset = 0
        let high = this.param!.uniqueIds.length

        while (low <= high) {
            middle = low + Math.floor((high - low) / 2)
            middleOffset = this.getIndexOffset(middle)

            if (middleOffset === offset) {
                return middle
            } else if (middleOffset < offset) {
                low = middle + 1
            } else {
                high = middle - 1
            }
        }

        return low > 0 ? --low : 0
    }

    getIndexOffset(givenIndex: number) {
        if (!givenIndex) {
            return 0
        }

        let offset = 0
        let indexSize = 0
        for (let index = 0; index < givenIndex; index++) {
            indexSize = this.sizes.get(this.param!.uniqueIds[index]) || this.getEstimateSize()
            offset += indexSize
        }

        return offset
    }

    isFixedType() {
        return this.calcType === CALC_TYPE.FIXED
    }

    getLastIndex() {
        return this.param!.uniqueIds.length - 1
    }

    checkRange(start: number, end: number) {
        const keeps = this.param!.keeps
        const total = this.param!.uniqueIds.length

        if (total <= keeps) {
            start = 0
            end = this.getLastIndex()
        } else if (end - start < keeps - 1) {
            start = end - keeps + 1
        }

        if (this.range.start !== start) {
            this.updateRange(start, end)
        }
    }

    updateRange(start: number, end: number) {
        this.range.start = start
        this.range.end = end
        this.range.padFront = this.getPadFront()
        this.range.padBehind = this.getPadBehind()
        this.callUpdate?.(this.getRange())
    }

    getEndByStart(start: number) {
        const theoryEnd = start + this.param!.keeps - 1
        return Math.min(theoryEnd, this.getLastIndex())
    }

    getPadFront() {
        return this.isFixedType() ? this.fixedSizeValue * this.range.start : this.getIndexOffset(this.range.start)
    }

    getPadBehind() {
        const end = this.range.end
        const lastIndex = this.getLastIndex()

        return this.isFixedType() ? (lastIndex - end) * this.fixedSizeValue : (lastIndex - end) * this.getEstimateSize()
    }

    getEstimateSize() {
        return this.isFixedType() ? this.fixedSizeValue : this.firstRangeAverageSize || this.param!.estimateSize
    }
}
