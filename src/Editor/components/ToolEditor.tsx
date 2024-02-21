import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import './ToolEditor.scss'
import { Editor } from '..'
import { useFocus } from '@reactuses/core'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	// options?: EngineOptions
	// defaultValue?: string
	// is_group?: boolean
	// focus?: () => void
	// blur?: () => void
	initValue?: string
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	engine: Editor
	// el: HTMLDivElement
	focus: () => void
	// isFocus: boolean
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const EditorRef = useRef<HTMLDivElement | null>(null)

	const [engine, setEngine] = useState<Editor>()
	const [, setEditorFocus] = useFocus(EditorRef, true)

	useEffect(() => {
		if (!EditorRef.current) return

		// 实例化引擎
		const engine = new Editor(EditorRef.current, {
			readonly: props?.readonly ?? true,
		})

		setEngine(engine)
	}, [])

	useEffect(() => {
		if (engine && props.initValue) {
			engine.insertElement(props.initValue, { render: true })
		}
	}, [engine, props.initValue])

	useImperativeHandle(ref, () => ({
		engine: engine!,
		// el: editorRef.current!,
		focus: () => setEditorFocus(true)
		// isFocus
	}))

	return (
		<div className={clsx('w-full max-h-[150px]  overflow-y-auto text-[1rem]', props.className)} ref={EditorRef} />
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
