import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'

interface QuillReadEditorProps {
    content: string
    className?: string
    replyContent?: string
    replyName?: string
    replyClassName?: string
}

const QuillReadEditor: React.FC<QuillReadEditorProps> = ({ content, className, replyContent, replyName }) => {
    const readEditorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!content) return
        if (!readEditorRef.current) return
        const html = DOMPurify.sanitize(content)
        // 回复
        if (replyContent) {
            const newContent =
                `<blockquote class="read-editor-reply">
                    <p class="read-editor-reply-name">${replyName}</p>
                    <p>${replyContent}</p>
                </blockquote>` + content
            content = newContent
        }

        readEditorRef.current.innerHTML = html
    }, [content])

    return <div ref={readEditorRef} className={clsx('read-editor', className)} />
}

export default QuillReadEditor
