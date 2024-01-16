import React from 'react'
import { f7, Page, Navbar, NavTitle, NavRight, Link } from 'framework7-react'
import PropType from 'prop-types'
import './updateUserInfo.less'
import { updatePassWordApi, updateUserInfoApi, getUserInfoApi } from '@/api/user'
import { useUserStore } from '@/stores/user'
import { mapKeys } from 'lodash-es'

UpdateUserInfo.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}

export default function UpdateUserInfo({ f7route, f7router }) {
	const TITLE = f7route?.query?.title
	const KEY = f7route?.params?.key

	const { updateUser, removeUser } = useUserStore()

	const saveUserInfo = (params) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { code, data, msg } = await updateUserInfoApi(params)
				if (code === 200) {
					const userInfo = await getUserInfoApi({
						user_id: data?.user_id,
						type: '1'
					})
					const reqData = {
						...userInfo.data
					}
					mapKeys(reqData, (value, key) => {
						if (key === 'nick_name') return 'nickname'
						return key
					})
					updateUser(reqData)
					resolve(reqData)
				}
				reject(new Error(msg))
			} catch (error) {
				reject(error)
			}
		})
	}

	const savePassWord = (praams) => {
		return new Promise(async (resolve, reject) => {
			try {
				const { code, data, msg } = await updatePassWordApi(praams)
				if (code === 200) {
					resolve(data)
				}
				reject(new Error(msg))
			} catch (error) {
				reject(error)
			}
		})
	}

	const InputDOM = (key, title, placeholder = `请输入${title}`) => {
		return (
			<li key={key}>
				<div className="item-content item-input">
					<div className="item-inner">
						<div className="item-title item-label">{title}</div>
						<div className="item-input-wrap">
							<input type="text" name={key} placeholder={placeholder} />
						</div>
					</div>
				</div>
			</li>
		)
	}

	const PassWordInput = (key, title, placeholder = `请输入${title}`) => {
		const keys = Array.isArray(key) ? key : [key]
		return keys.map((item, index) => {
			return (
				<li key={item}>
					<div className="item-content item-input">
						<div className="item-inner">
							<div className="item-title item-label">{title[index] || title}</div>
							<div className="item-input-wrap">
								<input type="password" name={item} placeholder={placeholder[index] || placeholder} />
							</div>
						</div>
					</div>
				</li>
			)
		})
	}

	const FormItems = () => {
		const items = []
		if (KEY === 'password') {
			items.push(
				PassWordInput(
					['old_password', 'password', 'confirm_password'],
					['旧密码', '新密码', '确认密码'],
					['请输入旧密码', '请输入新密码', '请再次输入新密码']
				)
			)
		} else {
			items.push(InputDOM(KEY, TITLE))
		}
		return items
	}

	const save = async () => {
		const formData = document.getElementById('userinfo-form').elements
		const params = {}
		for (let i = 0; i < formData.length; i++) {
			params[formData[i].name] = formData[i].value
		}
		try {
			f7.dialog.preloader('修改中...')
			const api = KEY === 'password' ? savePassWord : saveUserInfo
			await api(params)
			if (KEY === 'password') {
				f7.dialog.alert('请重新登录!', '密码修改成功', () => {
					removeUser()
					window.location.href = '/'
				})
			} else {
				f7router.back()
			}
		} catch (error) {
			f7.dialog.alert(error.message)
		} finally {
			f7.dialog.close()
		}
	}

	return (
		<Page className="userinfo-page" noToolbar messagesContent>
			<Navbar className="messages-navbar" backLink>
				<NavTitle>
					<div className="mr-4">{TITLE ? TITLE : '修改'}</div>
				</NavTitle>
				<NavRight>
					<Link>
						<div onClick={() => save()}>保存</div>
					</Link>
				</NavRight>
			</Navbar>
			<form className="list list-strong-ios list-dividers-ios list-outline-ios" id="userinfo-form">
				<ul>{FormItems()}</ul>
			</form>
		</Page>
	)
}
