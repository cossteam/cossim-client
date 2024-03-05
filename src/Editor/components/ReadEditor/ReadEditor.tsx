import DOMPurify from 'dompurify'
import { useEffect, useRef } from 'react'
import './ReadEditor.scss'
import clsx from 'clsx'

interface ReadEditorProps {
	content: string
	replyContent?: string
	replyName?: string
	className?: string
}

const ReadEditor: React.FC<ReadEditorProps> = (props) => {
	const ReadEditorRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!ReadEditorRef.current) return
		let content = DOMPurify.sanitize(props.content)
		// 回复
		if (props.replyContent) {
			const newContent =
				`<blockquote class="read-editor-reply">
                    <p class="read-editor-reply-name">${props.replyName}</p>
                    <p>${props.replyContent}</p>
                </blockquote>` + content
			content = newContent
		}

		ReadEditorRef.current.innerHTML = content

	}, [props.content])

	return <div ref={ReadEditorRef} className={clsx('read-editor', props.className)} />
}

export default ReadEditor
