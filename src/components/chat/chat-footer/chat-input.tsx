import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/ui/scroll-area'

import Quill from 'quill'
import '@/styles/scss/quill.scss'
// import { Mention, MentionBlot } from 'quill-mention'
import 'quill-mention/autoregister'

// Quill.register({ 'blots/mention': MentionBlot, 'modules/mention': Mention })

const atValues = [
    { id: 1, value: 'Fredrik Sundqvist' },
    { id: 2, value: 'Patrik Sjölin' }
]

const hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
]

function ChatInput() {
    const textInputRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill | null>(null)

    useEffect(() => {
        if (!textInputRef.current) return

        const quill = new Quill(textInputRef.current, {
            placeholder: '输入消息...',
            modules: {
                mention: {
                    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                    mentionDenotationChars: ['@', '#'],
                    // @ts-ignore
                    source: function (searchTerm, renderList, mentionChar) {
                        let values

                        if (mentionChar === '@') {
                            values = atValues
                        } else {
                            values = hashValues
                        }

                        if (searchTerm.length === 0) {
                            renderList(values, searchTerm)
                        } else {
                            const matches = []
                            for (let i = 0; i < values.length; i++) {
                                if (values[i].value.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    matches.push(values[i])
                                }
                            }
                            renderList(matches, searchTerm)
                        }
                    }
                }
            }
        })

        quillRef.current = quill
    }, [])

    return (
        <ScrollArea className="flex-1 relative max-h-[150px]">
            <div className="quill-editor" ref={textInputRef} />
        </ScrollArea>
    )
}

export default ChatInput
