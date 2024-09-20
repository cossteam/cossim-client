enum DIRECTION {
    UP = 'UP',
    DOWN = 'DOWN'
}

export type Range = {
    start: number
    end: number
    padFront: number
    padBehind: number
}

export type Config = {
    keeps: number
    estimatedSize: number
    buffer: number
    uniqueIds: string[]
}

type ObjectWithId = { id: string }

export default class Virtual {
    private readonly config: Config
    private readonly emitOnRangeHandler: (v: Range) => void
    private offset: number
    private direction: DIRECTION

    range: Range
    heights: Map<string, number>
    offsets: Map<string, number>

    constructor(config: Config, onUpdateRange: (v: Range) => void) {
        this.config = config
        this.emitOnRangeHandler = onUpdateRange

        this.heights = new Map()
        this.offsets = new Map()

        this.offset = 0
        this.direction = DIRECTION.UP

        this.range = {} as Range
        this.syncRange(0, config.keeps - 1)
    }

    getRange(): Range {
        const { start, end, padFront, padBehind } = this.range

        return {
            start,
            end,
            padFront,
            padBehind
        }
    }

    getOffset(start: number) {
        return start < 1 ? 0 : this.getOffsetByIndex(start)
    }

    onUpdateIds(newIds: string[]) {
        this.config.uniqueIds = newIds
    }

    onSaveHeight(id: string, size: number) {
        this.heights.set(id, size)
    }

    onGetShiftedOffset<T extends ObjectWithId[]>(newItems: T) {
        return newItems.reduce((acc, message) => {
            return acc + (this.heights.get(message.id) || this.config.estimatedSize)
        }, 0)
    }

    onUpdateRange() {
        const start = Math.max(this.range.start, 0)
        this.updateRange(start, this.getEndByStart(start))
    }

    onScroll(newOffset: number) {
        this.direction = newOffset < this.offset ? DIRECTION.UP : DIRECTION.DOWN
        this.offset = newOffset

        if (this.direction === DIRECTION.UP) {
            this.handleScrollUp()
        } else if (this.direction === DIRECTION.DOWN) {
            this.handleScrollDown()
        }
    }

    onRecalculateOffset() {
        const { heights, offsets, config } = this

        let offsetAcc = 0

        config.uniqueIds.forEach((id) => {
            offsets.set(id, offsetAcc)
            offsetAcc += heights.get(id) || config.estimatedSize
        })
    }

    handleScrollUp() {
        const calculatedStart = this.calculateCurrentRange()

        if (calculatedStart > this.range.start) {
            return
        }

        const start = Math.max(calculatedStart - this.config.buffer, 0)
        this.syncRange(start, this.getEndByStart(start))
    }

    handleScrollDown() {
        const calculatedStart = this.calculateCurrentRange()

        if (calculatedStart < this.range.start + this.config.buffer) {
            return
        }

        this.syncRange(calculatedStart, this.getEndByStart(calculatedStart))
    }

    calculateCurrentRange() {
        const offset = this.offset

        if (offset <= 0) {
            return 0
        }

        let low = 0
        let middle = 0
        let middleOffset = 0
        let high = this.config.uniqueIds.length

        while (low <= high) {
            middle = Math.floor((high + low) / 2)
            middleOffset = this.getOffsetByIndex(middle)

            if (middleOffset === offset) {
                return middle
            } else if (middleOffset < offset) {
                low = middle + 1
            } else if (middleOffset > offset) {
                high = middle - 1
            }
        }

        return low > 0 ? low - 1 : 0
    }

    getOffsetByIndex(givenIndex: number) {
        let offset = this.offsets.get(this.config.uniqueIds[givenIndex])

        if (typeof offset !== 'number') {
            offset = givenIndex * this.config.estimatedSize
        }

        return offset
    }

    getLastIndex() {
        return Math.max(0, this.config.uniqueIds.length - 1)
    }

    syncRange(start: number, end: number) {
        const { keeps, uniqueIds } = this.config

        if (uniqueIds.length <= keeps) {
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
        this.range.padFront = this.calculateTopPadding()
        this.range.padBehind = this.calculateBottomPadding()
        this.emitOnRangeHandler(this.getRange())
    }

    getEndByStart(start: number) {
        const theoryEnd = start + this.config.keeps - 1
        return Math.min(theoryEnd, this.getLastIndex())
    }

    calculateTopPadding() {
        const { start } = this.range
        return this.getOffsetByIndex(start)
    }

    calculateBottomPadding() {
        const { end } = this.range

        const lastIndex = this.getLastIndex()
        const lastIndexOffset = this.getOffsetByIndex(lastIndex)
        const endOffset = this.getOffsetByIndex(end)

        return lastIndexOffset - endOffset
    }
}
