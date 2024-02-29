import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import 'quill/dist/quill.core.css'
import './ToolEditor.scss'
import { useFocus } from '@reactuses/core'
import Quill, { type Data } from '../../moudles'
import GroupService from '@/api/group'
import { useMessageStore } from '@/stores/message'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	focus?: () => void
	blur?: () => void
	initValue?: string
	content?: string
	children?: React.ReactNode
	placeholder?: string
	id?: string
	is_group?: boolean
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	focus: () => void
	quill: Quill
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const EditorRef = useRef<HTMLDivElement | null>(null)

	// const [engine, setEngine] = useState<Editor>()
	const [, setEditorFocus] = useFocus(EditorRef, true)

	const [quill, setQuill] = useState<Quill>()

	const msgStore = useMessageStore()

	useEffect(() => {
		if (!EditorRef.current) return

		const modules = {
			mention: {
				visable: true,
				triggerChar: ['@'],
				source: async () => {
					try {
						const { data } = await GroupService.groupMemberApi({ group_id: Number(props.id ?? 0) })
						const members = data.map((v: any) => ({ ...v, name: v.nickname }))
						return members
					} catch (error) {
						return []
					}
				},
				onSelect: (item: Data) => {
					console.log('index', item)
					if(item.id === 0) {
						msgStore.updateAtAllUser(true)
					} else {
						msgStore.updateAtAllUser(false)
						msgStore.updateAtUsers(item.user_id)
					}
				}
			}
		}

		const quill = new Quill(EditorRef.current, {
			readOnly: props?.readonly ?? true,
			placeholder: props?.placeholder,
			modules: props.is_group ? modules : {}
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
