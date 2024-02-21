import { $t } from '@/shared'
import Engine, { type EngineOptions } from '@aomao/engine'
import Mention, { MentionComponent } from '@aomao/plugin-mention'
import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import './ToolEditor.scss'
import { useFocus } from '@reactuses/core'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	options?: EngineOptions
	defaultValue?: string
	is_group?: boolean
	focus?: () => void
	blur?: () => void
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	engine: Engine
	el: HTMLDivElement
	focus: () => void
	// isFocus: boolean
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const editorRef = useRef<HTMLDivElement | null>(null)
	const [engine, setEngine] = useState<Engine>()
	const [, setEditorFocus] = useFocus(editorRef, true)
	// const [isFocus, setIsFocus] = useState(false)

	useEffect(() => {
		if (!editorRef.current) return

		// console.log('props.is_group', props.is_group)

		const cards = props.is_group || props.readonly ? [MentionComponent] : []
		const plugins = props.is_group || props.readonly ? [Mention] : []

		// 实例化引擎
		const engine = new Engine(editorRef.current, {
			readonly: props?.readonly || false,
			placeholder: props?.readonly ? '' : $t('请输入内容'),
			cards,
			plugins,
			config: {
				[Mention.name]: {}
			},
			markdown: {
				mode: false
			},
			className: 'aomao-editor',
			...props?.options
		})

		setEngine(engine)
	}, [])

	useEffect(() => {
		if (engine && props.defaultValue) {
			engine.setValue(props.defaultValue)
		}
	}, [engine, props.defaultValue])

	useImperativeHandle(ref, () => ({
		engine: engine!,
		el: editorRef.current!,
		focus: () => setEditorFocus(true)
		// isFocus
	}))

	return (
		<div
			className={clsx('w-full max-h-[150px]  overflow-y-auto text-[1rem]', props.className)}
			ref={editorRef}
			onFocus={props.focus}
			onBlur={props.blur}
		/>
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
