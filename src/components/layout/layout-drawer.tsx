import { $t } from '@/i18n'
import { generateUserInfo } from '@/mock/data'
import { SettingOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Avatar, Drawer, DrawerProps, Flex, Divider, Typography, Switch, Button } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import CustomIcon from '@/components/icon'
import Modal from '@/components/modal'
import { LightIcon, DarkIcon } from '@/components/icon/icon'
import useCommonStore from '@/stores/common'
import { THEME } from '@/utils/enum'
import { SMALL_SCREEN } from '@/utils/constants'
import type { DrawerStyles } from 'antd/es/drawer/DrawerPanel'
import ContactList from '@/components/contact-list'
import GroupCreate from '@/components/group/group-create'
import Profile from '@/components/profile'
import useMobile from '@/hooks/useMobile'
import useUserStore from '@/stores/user'
import { useNavigate } from 'react-router-dom'
import { createFingerprint } from '@/utils/fingerprint'
import { getUserInfoApi } from '@/api/user'
import AddContact from '@/components/add-contact'
import { tr } from '@faker-js/faker'

interface Menus {
    icon: React.ForwardRefExoticComponent<any>
    title: string
    component: JSX.Element
}

interface LayoutDrawerProps extends DrawerProps {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const mockUserInfo = generateUserInfo()

const drawerStyles: DrawerStyles = {
    body: {
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0px'
    }
}

const LayoutDrawer: React.FC<Partial<LayoutDrawerProps>> = (props) => {
    const userStore = useUserStore()
    const navigate = useNavigate()
    const commonStore = useCommonStore()

    const { width } = useMobile()

    useEffect(() => {
        if (userStore.userId) {
            getUserInfoApi({ id: userStore.userId })
                .then((res) => {
                    userStore.update({
                        userInfo: res.data
                    })
                })
                .catch((error) => {
                    console.log('获取用户信息失败: ', error)
                })
        }
    }, [userStore.userId])

    const userInfo = {
        avatar: userStore.userInfo?.avatar || mockUserInfo.avatar,
        nickname: userStore.userInfo?.nickname || mockUserInfo.nickname,
        email: userStore.userInfo?.email || mockUserInfo.email
    }

    const isLight = useMemo(() => commonStore.theme === THEME.LIGHT, [commonStore.theme])

    const menus = useMemo<Menus[]>(
        () => [
            {
                icon: UsergroupAddOutlined,
                title: $t('新建群组'),
                component: <GroupCreate />
            },
            {
                icon: UserOutlined,
                title: $t('联系人'),
                component: <ContactList />
            },
            {
                icon: UserOutlined,
                title: $t('添加联系人'),
                component: (
                    <AddContact
                        onClick={(item: any) => {
                            console.log('添加联系人', item)
                            // setIs(true)
                        }}
                    />
                )
            },
            {
                icon: SettingOutlined,
                title: $t('设置'),
                component: <Profile />
            },
            {
                icon: SettingOutlined,
                title: $t('好友信息'),
                component: <s />
            }
        ],
        []
    )

    const [is, setIs] = useState(false)

    const s = () => {
        return (
            <Modal
                wrapClassName="ant-modal-content-p-0"
                open={modalOpen}
                title={<div className="text-center pt-4">ss</div>}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <div>wbnj</div>
            </Modal>
        )
    }

    const [activeIndex, setActiveIndex] = useState<number>(0)
    const handlerMenusClick = (item: Menus, index: number) => {
        props.setOpen && props.setOpen(false)
        setModalTitle(item.title)
        setModalOpen(true)
        setActiveIndex(index)
    }

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>('')

    const Component = useMemo(() => menus[activeIndex].component, [activeIndex, menus])

    // 退出登录
    const [openLogoutModal, setOpenLogoutModal] = useState(false)
    const logout = async () => {
        try {
            const data = await userStore.logout({
                driver_id: createFingerprint()
            })
            console.log($t('退出登录'), data)
        } catch (error) {
            console.log(error)
        } finally {
            navigate('/account/login', {
                replace: true
            })
        }
    }

    return (
        <>
            <Drawer
                className="p-0"
                placement="left"
                width={width < SMALL_SCREEN ? '70%' : '300px'}
                closable={false}
                styles={drawerStyles}
                {...props}
            >
                <Flex className="mobile:px-5 px-3" align="center">
                    <Avatar className="mr-4 min-w-[64px] min-h-[64px]" src={userInfo.avatar} size={64} />
                    <Flex vertical>
                        <Typography.Text className="!mb-1 font-bold mobile:text-xl text-lg">
                            {userInfo.nickname}
                        </Typography.Text>
                        <Typography.Text className="break-all line-clamp-1 mobile:text-base text-sm">
                            {userInfo.email}
                        </Typography.Text>
                    </Flex>
                </Flex>

                <Divider />

                <Flex vertical>
                    {menus.map((item, index) => (
                        <Flex
                            className="mobile:py-3 py-2 mobile:px-5 px-4 select-none hover:bg-background-hover cursor-pointer rounded"
                            key={index}
                            gap="middle"
                            onClick={() => handlerMenusClick(item, index)}
                        >
                            <CustomIcon className="mobile:text-2xl text-xl text-gray-500" component={item.icon} />
                            <Typography.Text className="mobile:text-lg text-base">{item.title}</Typography.Text>
                        </Flex>
                    ))}
                    <Flex
                        className="mobile:py-3 py-2 mobile:px-5 px-4 select-none hover:bg-background-hover cursor-pointer rounded"
                        gap="middle"
                        justify="space-between"
                        onClick={() => commonStore.update({ theme: isLight ? THEME.DARK : THEME.LIGHT })}
                    >
                        <Flex gap="middle">
                            <CustomIcon
                                className="mobile:text-2xl text-xl text-gray-500"
                                component={isLight ? DarkIcon : LightIcon}
                            />
                            <Typography.Text className="mobile:text-lg text-base">
                                {isLight ? $t('夜间模式') : $t('日间模式')}
                            </Typography.Text>
                        </Flex>
                        <Switch checked={!isLight} />
                    </Flex>
                </Flex>
                <Flex className="flex-1 h-fit" justify="center" align="flex-end">
                    <Button
                        className="w-full mx-[24px] p-[20px] flex justify-center items-center"
                        type="primary"
                        danger
                        onClick={() => setOpenLogoutModal(true)}
                    >
                        {$t('退出登陆')}
                    </Button>
                </Flex>
            </Drawer>

            <Modal
                wrapClassName="ant-modal-content-p-0"
                open={modalOpen}
                title={<div className="text-center pt-4">{modalTitle}</div>}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                {Component}
            </Modal>

            <Modal
                title={$t('退出登陆')}
                centered
                open={openLogoutModal}
                onOk={() => {
                    logout()
                    setOpenLogoutModal(false)
                }}
                onCancel={() => setOpenLogoutModal(false)}
            >
                <p>{$t('确定要退出登陆吗？')}</p>
            </Modal>
        </>
    )
}

export default LayoutDrawer
