import { $t } from '@/i18n'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Divider, Flex, Typography } from 'antd'
import { useState } from 'react'
import LayoutDrawer from './layout-drawer'
import IconButton from '@/components/icon/icon-button'

export const headerHeight = 64

const LayoutHeader = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <Flex className="sticky top-0 z-10 bg-background pl-3 " style={{ height: headerHeight }} align="center">
                <Flex className="flex-1 bg-background2 h-8 rounded-lg px-5 cursor-pointer" align="center">
                    <div className="m-auto">
                        <SearchOutlined className="mr-2 text-gray-500 text-base" />
                        <Typography.Text className="text-gray-500 text-sm ">{$t('搜索')}</Typography.Text>
                    </div>
                </Flex>

                <IconButton
                    className="text-gray-500 text-xl"
                    buttonClassName="mr-1"
                    component={PlusOutlined}
                    onClick={() => setOpen(true)}
                />
            </Flex>
            <Divider className="m-0" />
            <LayoutDrawer open={open} onClose={() => setOpen(false)} setOpen={setOpen} />
        </>
    )
}

export default LayoutHeader
