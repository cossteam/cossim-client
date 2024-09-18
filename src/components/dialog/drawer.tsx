import { ChatContext } from '@/context/chat-context'
import { useClickOutside } from '@reactuses/core'
import { useContext, useRef } from 'react'

const Drawer = () => {
    const { update } = useContext(ChatContext)
    const drawerRef = useRef<HTMLDivElement>(null)

    // useClickOutside(drawerRef, () => update({ isDrawerOpen: false }))

    return (
        <div
            className="absolute h-full w-[300px] bg-secondary right-0 top-0 shadow-custom animate-in fade-in"
            ref={drawerRef}
        >
            Drawer
        </div>
    )
}

export default Drawer
