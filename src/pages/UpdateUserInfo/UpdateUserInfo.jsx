import React from 'react'
import { f7, Page, Navbar, NavTitle, NavRight, Link } from 'framework7-react'
import PropType from 'prop-types'
import './updateUserInfo.less'
import { updateUserInfoApi, getUserInfoApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

UpdateUserInfo.propTypes = {
	f7route: PropType.object.isRequired,
	f7router: PropType.object.isRequired
}

export default function UpdateUserInfo({ f7route, f7router }) {
	const title = f7route?.query?.title
	const key = f7route?.params?.key

	const { user, updateUser } = useUserStore()

	const save = async () => {
		const formData = document.getElementById('userinfo-form').elements
		const params = {}
		for (let i = 0; i < formData.length; i++) {
			params[formData[i].name] = formData[i].value
		}
		try {
			f7.dialog.preloader('修改中...')
			const data = await updateUserInfoApi(params)
			if (data.code === 200) {
				const userInfo = await getUserInfoApi({
					user_id: data?.data?.user_id,
					type: '1'
				})
				console.log(userInfo)
				updateUser({
					...userInfo.data
				})
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
					<div className="mr-4">{title ? title : '修改'}</div>
				</NavTitle>
				<NavRight>
					<Link>
						<div onClick={() => save()}>保存</div>
					</Link>
				</NavRight>
			</Navbar>
			<form className="list list-strong-ios list-dividers-ios list-outline-ios" id="userinfo-form">
				<ul>
					<li>
						<div className="item-content item-input">
							<div className="item-inner">
								<div className="item-title item-label">{title}</div>
								<div className="item-input-wrap">
									<input type="text" name={key} placeholder={`请输入${title}`} />
								</div>
							</div>
						</div>
					</li>
				</ul>
			</form>
		</Page>
	)
}
