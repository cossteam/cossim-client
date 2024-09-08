import Quill from 'quill'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import 'quill/dist/quill.core.css'
import '@/styles/quill.scss'
import { $t } from '@/i18n'

interface QuillEditEditorProps {
    readOnly?: boolean
    placeholder?: string
    textChange?: (content: string) => void
}

interface QuillEditEditorHandler {
    quill: Quill | null
}

const QuillEditEditor: React.ForwardRefRenderFunction<QuillEditEditorHandler, QuillEditEditorProps> = (
    { readOnly = false, placeholder, textChange },
    ref
) => {
    const quillRef = useRef<HTMLDivElement>(null)
    const [quill, setQuill] = useState<Quill | null>(null)

    useEffect(() => {
        if (!quillRef.current) return
        const quill = new Quill(quillRef.current, {
            readOnly,
            placeholder: placeholder || $t('请输入内容'),
            modules: {}
        })

        quill.on('text-change', (_delta, _oldDelta, source) => {
            if (textChange && source === Quill.sources.USER) {
                const content = quill.getSemanticHTML()
                textChange(content)
            }
        })

        setQuill(quill)

        return () => {
            quill?.off('text-change')
        }
    }, [quillRef])

    useImperativeHandle(
        ref,
        () => ({
            quill: quill
        }),
        [quill]
    )

    return <div className="w-full" ref={quillRef} />
}

QuillEditEditor.displayName = 'QuillEditEditor'

export default forwardRef(QuillEditEditor)
