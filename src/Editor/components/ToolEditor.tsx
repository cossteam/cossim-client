import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import 'quill/dist/quill.core.css'
import './ToolEditor.scss'
// import { Editor } from '..'
import { useFocus } from '@reactuses/core'
// import Quill from 'quill'
import { $t } from '@/shared'
// import 'quill-mention'
// import Mention from 'quill-mention'
// import 'quill-mention/dist/quill.mention.min.css'
// import Mention from '../moudles/mention/mention'
import Quill from '../moudles'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	// options?: EngineOptions
	// defaultValue?: string
	// is_group?: boolean
	focus?: () => void
	blur?: () => void
	initValue?: string
	content?: string
	children?: React.ReactNode
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	// engine: Editor
	// el: HTMLDivElement
	focus: () => void
	// isFocus: boolean
	quill: Quill
}
// 2.0.0-rc.2
// async function suggestPeople(searchTerm) {
// 	const allPeople = [
// 		{
// 			id: 1,
// 			value: 'Fredrik Sundqvist'
// 		},
// 		{
// 			id: 2,
// 			value: 'Patrik Sjölin'
// 		}
// 	]
// 	return allPeople.filter((person) => person.value.includes(searchTerm))
// }

// Quill.register({
// 	'modules/mention': Mention
// })

// 配置提及的数据源

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const EditorRef = useRef<HTMLDivElement | null>(null)

	// const [engine, setEngine] = useState<Editor>()
	const [, setEditorFocus] = useFocus(EditorRef, true)

	const [quill, setQuill] = useState<Quill>()

	useEffect(() => {
		if (!EditorRef.current) return

		// console.dir(Mention)

		const quill = new Quill(EditorRef.current, {
			readOnly: props?.readonly ?? true,
			placeholder: props?.readonly ? '' : $t('请输入内容'),
			modules: {
				mention: {
					triggerChar: '@',
					source: async () => {
						return [{ data: 1 }]
					}
				}
			}
		})

		setQuill(quill)
	}, [])

	useEffect(() => {
		if (quill && props.initValue) {
			try {
				quill.root.innerHTML = props.initValue
			} catch {
				const content = JSON.parse(props.initValue)
				quill.setContents(content)
			}
		}
	}, [quill, props.initValue])

	useImperativeHandle(ref, () => ({
		focus: () => setEditorFocus(true),
		quill: quill!
	}))

	return (
		<div
			className={clsx('w-full text-[1rem]', props.className)}
			ref={EditorRef}
			onFocus={props.focus}
			onBlur={props.blur}
		>
			{props?.children}
		</div>
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
