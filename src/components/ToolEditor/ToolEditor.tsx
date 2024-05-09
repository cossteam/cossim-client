import clsx from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import 'quill/dist/quill.core.css'
import './ToolEditor.scss'
import GroupService from '@/api/group'
import 'quill-mention-react'
import Quill from 'quill'
import useMessageStore from '@/stores/message'
import { emojiOrMore } from '@/shared'

interface ToolEditorProps {
	className?: string
	readonly?: boolean
	initValue?: string
	content?: string
	children?: React.ReactNode
	placeholder?: string
	id?: string | number
	is_group?: boolean
	onChange?: (content: string) => void
	defaultValue?: string
}

// 暴露给父组件的方法类型
export interface ToolEditorMethods {
	quill: Quill
}

const ToolEditor: React.ForwardRefRenderFunction<ToolEditorMethods, ToolEditorProps> = (props, ref) => {
	const EditorRef = useRef<HTMLDivElement | null>(null)
	const [quill, setQuill] = useState<Quill>()
	const messageStore = useMessageStore()

	useEffect(() => {
		if (!EditorRef.current) return

		const modules = {
			mention: {
				visable: true,
				triggerChar: ['@'],
				source: async () => {
					try {
						const { data } = await GroupService.groupMemberApi({ group_id: Number(props.id ?? 0) })
						const members = [{ id: 0, name: '全体成员' }].concat(
							data.map((v: any) => ({ ...v, name: v.nickname }))
						)
						return members
					} catch (error) {
						return []
					}
				},
				onSelect: (item: any) => {
					console.log('index', item)
					if (item.id === 0) {
						// msgStore.updateAtAllUser(true)
						messageStore.update({ atAllUser: 1 })
					} else {
						// const atUsers = messageStore.atUsers.
						messageStore.update({ atAllUser: 0, atUsers: [...messageStore.atUsers, item.user_id] })
						// msgStore.updateAtAllUser(false)
						// msgStore.updateAtUsers(item.user_id)
					}
				}
			}
		}
		const quill = new Quill(EditorRef.current, {
			readOnly: props.readonly ?? true,
			placeholder: props?.placeholder,
			modules: props.is_group ? modules : {}
		})

		quill.on('text-change', () => {
			if (props.onChange) {
				const content = quill.getSemanticHTML()
				props.onChange(content)
			}
		})

		if (props.defaultValue) {
			quill.root.innerHTML = props.defaultValue
		}

		setQuill(quill)

		return () => {
			quill.off('text-change')
		}
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
		quill: quill!
	}))

	return (
		<div
			className={clsx('w-full text-[1rem]', props.className)}
			ref={EditorRef}
			onFocus={() => messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })}
		/>
	)
}

export const EditorComponent = forwardRef(ToolEditor)
export default EditorComponent
