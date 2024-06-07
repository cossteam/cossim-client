import { Avatar, Card, Divider, List, Switch, Typography } from 'antd'
import { UserAddOutlined, EllipsisOutlined, CopyOutlined } from '@ant-design/icons'

const { Meta } = Card

interface UserCardProps {
    avatar: string
    title: string
    description: string
    coverImage: string
    userInfoItem: Array<{ title: string; content: string; action?: boolean }>
    groupCount: number
}

const UserCard: React.FC<UserCardProps> = ({ avatar, title, description, coverImage, userInfoItem, groupCount }) => {
    return (
        <div className="bg-gray-100">
            <Card
                cover={<img alt="example" src={coverImage} />}
                actions={[<UserAddOutlined key="add" />, <EllipsisOutlined key="ellipsis" />]}
            >
                <Meta avatar={<Avatar size={64} src={avatar} />} title={title} description={description} />
            </Card>

            <div className="mt-2 bg-white">
                <List
                    split={false}
                    size="small"
                    dataSource={userInfoItem}
                    renderItem={(item) => (
                        <List.Item key={item.title} className="p-2">
                            <List.Item.Meta
                                title={
                                    <Typography.Text type="secondary" className="text-sm leading-tight text-gray-500">
                                        {item.title}
                                    </Typography.Text>
                                }
                                description={<Typography className="text-sm leading-tight">{item.content}</Typography>}
                            />
                            {item.action && (
                                <Typography.Text
                                    copyable={{
                                        icon: [
                                            <CopyOutlined
                                                className="text-gray-500 hover:text-primary"
                                                key="copy-icon"
                                            />
                                        ]
                                        // tooltips: ['click here', 'you clicked!!']
                                    }}
                                />
                            )}
                        </List.Item>
                    )}
                />
            </div>

            <div className="mt-2 bg-white flex flex-col justify-between">
                <div>
                    <div className="p-4 flex justify-between">
                        <Typography.Text className="text-sm leading-tight">共同的群</Typography.Text>
                        <Typography.Text className="text-sm leading-tight text-gray-500">{groupCount}</Typography.Text>
                    </div>
                    <Divider className="m-0" />
                </div>

                <div>
                    <div className="p-4 flex justify-between">
                        <Typography.Text className="text-sm leading-tight">置顶聊天</Typography.Text>
                        {/* <Typography.Text className="text-sm leading-tight text-gray-500">{groupCount}</Typography.Text> */}
                        <Switch />
                    </div>
                    <Divider className="m-0" />
                </div>

                <div>
                    <div className="p-4 flex justify-between">
                        <Typography.Text className="text-sm leading-tight">消息免打扰</Typography.Text>
                        <Switch />
                    </div>
                    <Divider className="m-0" />
                </div>

                <div>
                    <div className="p-4 flex justify-between">
                        <Typography.Text className="text-sm leading-tight">阅后即焚</Typography.Text>
                        <Switch />
                    </div>
                    <Divider className="m-0" />
                </div>

                <div>
                    <div className="p-4 flex justify-between">
                        <Typography.Text className="text-sm leading-tight">添加到黑名单</Typography.Text>
                        <Switch />
                    </div>
                    <Divider className="m-0" />
                </div>
            </div>
        </div>
    )
}

export default UserCard
