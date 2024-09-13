/**
 * hover 效果管理, 移除或恢复 hover 效果
 */
export class HoverEffect {
    private removedHoverRules: Map<number, { index: number; rule: CSSRule }[]>

    constructor() {
        this.removedHoverRules = new Map()
    }

    private getAllStyleSheets(): StyleSheetList {
        return document.styleSheets
    }

    /**
     * 移除所有 hover 效果
     */
    public removeHoverEffect(): void {
        const stylesheets = this.getAllStyleSheets()
        for (let i = 0; i < stylesheets.length; i++) {
            this.removeHoverRulesFromStyleSheet(stylesheets[i], i)
        }
    }

    /**
     * 从指定样式表中移除 hover 规则
     *
     * @param stylesheet   样式表
     * @param sheetIndex   样式表索引
     */
    private removeHoverRulesFromStyleSheet(stylesheet: StyleSheet, sheetIndex: number): void {
        try {
            const rules = (stylesheet as CSSStyleSheet).cssRules || (stylesheet as CSSStyleSheet).rules
            for (let j = 0; j < rules.length; j++) {
                this.processSingleRule(rules[j], sheetIndex, j, stylesheet as CSSStyleSheet)
            }
        } catch (err) {
            console.log(`处理样式表时出错: ${err}`)
        }
    }

    /**
     * 处理单个 CSS 规则
     *
     * @param rule           CSS 规则
     * @param sheetIndex     样式表索引
     * @param ruleIndex      规则索引
     * @param stylesheet     样式表
     */
    private processSingleRule(rule: CSSRule, sheetIndex: number, ruleIndex: number, stylesheet: CSSStyleSheet): void {
        if (rule.cssText.includes(':hover')) {
            this.storeHoverRule(sheetIndex, ruleIndex, rule)
            stylesheet.deleteRule(ruleIndex)
            // 由于删除了规则，调整索引
            ruleIndex--
        }
    }

    /**
     *  将移除的 hover 规则存储到 Map 中
     *
     * @param sheetIndex     样式表索引
     * @param ruleIndex      规则索引
     * @param rule           CSS 规则
     */
    private storeHoverRule(sheetIndex: number, ruleIndex: number, rule: CSSRule): void {
        if (!this.removedHoverRules.has(sheetIndex)) {
            this.removedHoverRules.set(sheetIndex, [])
        }
        this.removedHoverRules.get(sheetIndex)?.push({ index: ruleIndex, rule })
    }

    /**
     * 恢复 hover 效果
     */
    public restoreHoverEffect(): void {
        const stylesheets = this.getAllStyleSheets()
        this.removedHoverRules.forEach((rules, sheetIndex) => {
            const stylesheet = stylesheets[sheetIndex]
            this.restoreHoverRulesInStyleSheet(stylesheet as CSSStyleSheet, rules)
        })

        // 清空存储的规则
        this.removedHoverRules.clear()
    }

    /**
     *  在指定样式表中恢复存储的 hover 规则
     *
     * @param stylesheet    样式表
     * @param rules         移除的 hover 规则
     */
    private restoreHoverRulesInStyleSheet(stylesheet: CSSStyleSheet, rules: { index: number; rule: CSSRule }[]): void {
        rules.forEach(({ index, rule }) => {
            stylesheet.insertRule(rule.cssText, index)
        })
    }

    // 监听设备是否支持 hover，并动态移除或恢复 hover 效果
    public listenToDeviceChanges(): void {
        const hoverMediaQuery = window.matchMedia('(hover: hover)')

        const handleHoverChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                this.restoreHoverEffect() // 桌面设备恢复 hover
            } else {
                this.removeHoverEffect() // 移动设备移除 hover
            }
        }

        // 初始化时检测当前设备支持 hover
        if (hoverMediaQuery.matches) {
            this.restoreHoverEffect()
        } else {
            this.removeHoverEffect()
        }

        // 监听设备切换
        hoverMediaQuery.addEventListener('change', handleHoverChange)
    }
}
