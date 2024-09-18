import { Badge } from '@/ui/badge'

interface ListItemProps {
    src: string
    name: string
    description?: string
    right?: {
        date: string
        unreadCount: number
    }
}

const ListItem: React.FC<ListItemProps> = ({ src, name, description, right }) => {
    return (
        <div className="w-full hover:bg-muted-foreground/10 p-2 cursor-pointer duration-300 flex gap-x-1.5 items-center">
            <div className="flex items-center size-14 justify-center flex-shrink-0">
                <img className="rounded-full size-12" src={src} alt="" />
            </div>

            <div className="flex flex-1 flex-col gap-y-1.5 overflow-hidden justify-center">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis flex-1">{name}</p>
                {description && (
                    <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs flex-1 text-gray-700">
                        {description}
                    </p>
                )}
            </div>

            {right && (
                <div className="w-12 flex-shrink-0 flex flex-col items-end gap-y-1.5">
                    <div className="text-xs text-gray-700 whitespace-nowrap">{right?.date}</div>
                    <Badge className="px-1.5 py-0 rounded-full bg-red-500" variant="destructive">
                        {right?.unreadCount}
                    </Badge>
                </div>
            )}
        </div>
    )
}

export default ListItem
