import React, { useState, useRef, useEffect } from 'react'
import PropType from 'prop-types'
import clsx from 'clsx'
// import AomaoEditor from '@/utils/editor'
import Engine from '@aomao/engine'
import Mention, { MentionComponent } from '@aomao/plugin-mention'
import Quote from '@aomao/plugin-quote'
import { $t } from '@/i18n'
import './Editor.less'

export default function Editor({ setEditor, readonly, options, defaultValue, ...props }) {
	const editorRef = useRef(null)

	const [engine, setEngine] = useState(null)

	useEffect(() => {
		if (!editorRef.current) return

		// 实例化引擎
		const engine = new Engine(editorRef.current, {
			readonly: readonly ? readonly : false,
			placeholder: readonly ? '' : $t('请输入内容'),
			cards: [MentionComponent],
			plugins: [Quote, Mention],
			config: {
				[Mention.name]: {}
			},
			markdown: {
				mode: false
			},
			...options
		})

		defaultValue && engine.setValue(defaultValue)

		// 设置引擎
		setEngine(engine)
		setEditor && setEditor(engine)

		return () => {
			engine?.destroy()
		}
	}, [])

	useEffect(() => {
		if (defaultValue) engine?.setValue(defaultValue)
	}, [defaultValue])

	return <div className={clsx('w-full', props.className)} ref={editorRef} />
}

Editor.propTypes = {
	className: PropType.string,
	setEditor: PropType.func,
	readonly: PropType.bool,
	is_at: PropType.bool,
	options: PropType.object,
	defaultValue: PropType.string
}
