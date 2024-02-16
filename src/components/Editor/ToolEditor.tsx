import { $t } from '@/shared'
import Engine, { type EngineOptions } from '@aomao/engine'
import Mention, { MentionComponent } from '@aomao/plugin-mention'
import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import './ToolEditor.scss'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	options?: EngineOptions
	defaultValue?: string
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	engine: Engine
	el: HTMLDivElement
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const editorRef = useRef<HTMLDivElement | null>(null)
	const [engine, setEngine] = useState<Engine>()

	useEffect(() => {
		if (!editorRef.current) return

		const cards = [MentionComponent]
		const plugins = [Mention]

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

		if (props.defaultValue) engine.setValue(props.defaultValue)

		setEngine(engine)
	}, [])

	useImperativeHandle(ref, () => ({
		engine: engine!,
		el: editorRef.current!
	}))

	return (
		<div className={clsx('w-full max-h-[150px]  overflow-y-auto text-[1rem]', props.className)} ref={editorRef} />
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
