import { useState, useEffect } from 'react'
import { Button, Form, Input, Tooltip, Space, Divider, Avatar, List, Checkbox, Radio } from 'antd'
import { $t } from '@/i18n'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { Contact, generateContactList, createGroup } from '@/mock/data'

const layout = {
	labelCol: { span: 10 },
	wrapperCol: { span: 12 }
}

const tailLayout = {
	wrapperCol: { offset: 8, span: 16 }
}

const GroupCreate = () => {
	const [form] = Form.useForm()
	const [showContacts, setShowContacts] = useState(false)
	const [groupType, setGroupType] = useState('public')
	const [data, setData] = useState<{ key: string; list: Contact[] }[]>([])
	const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])

	//完成创建群组
	const onFinish = (values: any) => {
		createGroup(values)
		// console.log(values);
		// console.log('Selected Contacts:', selectedContacts);
	}

	useEffect(() => {
		const arr = []
		const contactList = generateContactList(100)
		for (const key in contactList.list) {
			if (Object.prototype.hasOwnProperty.call(contactList.list, key)) {
				arr.push({
					list: contactList.list[key],
					key
				})
			}
		}
		setData(arr.sort((a, b) => a.key.localeCompare(b.key)))
	}, [])

	const onReset = () => {
		form.resetFields()
		setShowContacts(false)
		setGroupType('public')
		setSelectedContacts([])
	}

	const handleShowContacts = () => {
		setShowContacts(!showContacts)
	}

	const handleCheckboxChange = (contact: Contact) => (e: CheckboxChangeEvent) => {
		const checked = e.target.checked
		setSelectedContacts((prevSelected) => {
			if (checked) {
				return [...prevSelected, contact]
			} else {
				return prevSelected.filter((c) => c.user_id !== contact.user_id)
			}
		})
	}

	const handleAvatarClick = (userId: string) => {
		setSelectedContacts((prevSelected) => prevSelected.filter((contact) => contact.user_id !== userId))
	}

	return (
		<Form
			{...layout}
			form={form}
			name="control-hooks"
			onFinish={onFinish}
			layout="vertical"
			style={{ maxWidth: 600 }}
		>
			<Form.Item name="name" label={$t('名称')} rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item name="type" label={$t('类型')} initialValue={'public'}>
				<Radio.Group value={groupType}>
					<Radio.Button value="public">{$t('公开群')}</Radio.Button>
					<Radio.Button value="private">{$t('私密群')}</Radio.Button>
				</Radio.Group>
			</Form.Item>
			<Form.Item>
				<Button type="dashed" onClick={handleShowContacts}>
					{$t('选择联系人')}
				</Button>
			</Form.Item>
			<Avatar.Group maxCount={10}>
				{selectedContacts.map((contact) => (
					<Tooltip title={contact.nickname} placement="top" key={contact.user_id}>
						<Avatar
							src={contact.avatar}
							onClick={() => handleAvatarClick(contact.user_id)}
							style={{ cursor: 'pointer' }}
						/>
					</Tooltip>
				))}
			</Avatar.Group>
			<Form.Item {...tailLayout} className="my-3">
				<Space>
					<Button type="primary" htmlType="submit">
						{$t('确定')}
					</Button>
					<Button htmlType="button" onClick={onReset}>
						{$t('重置')}
					</Button>
				</Space>
			</Form.Item>
			<Divider />
			{showContacts && (
				<Form.Item name="contact" label={$t('联系人')} className="text-nowrap" wrapperCol={{ span: 25 }}>
					<List
						itemLayout="horizontal"
						dataSource={data}
						style={{ maxHeight: 300, overflow: 'auto' }}
						renderItem={(item) => (
							<div key={item.key}>
								{item.key}
								<List
									dataSource={item.list}
									renderItem={(c) => (
										<List.Item key={c.user_id}>
											<Checkbox
												onChange={handleCheckboxChange(c)}
												className="mr-3"
												checked={selectedContacts.some(
													(contact) => contact.user_id === c.user_id
												)}
											></Checkbox>
											<List.Item.Meta avatar={<Avatar src={c.avatar} />} title={c.nickname} />
										</List.Item>
									)}
								/>
							</div>
						)}
					/>
				</Form.Item>
			)}
		</Form>
	)
}

export default GroupCreate
