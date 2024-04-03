import { $t } from '@/shared'
import { usePreviewStore } from '@/stores/preview'
import { Link, NavRight, Navbar, Page, PageContent, Popup } from 'framework7-react'

const Preview: React.FC = () => {
	const previewStore = usePreviewStore()

	// const photos = useMemo(() => {
	// 	return previewStore.list.map((item) => {
	// 		return {
	// 			url: item.url,
	// 			caption: item.type === 'video' ? '视频' : '图片'
	// 		}
	// 	})
	// }, [])
	// const standaloneDarkRef = useRef<any>(null)
	// useEffect(() => {
	// 	console.log(previewStore.opened)
	// 	previewStore.opened && standaloneDarkRef.current?.open()
	// }, [previewStore.opened])
	return (
		// <PhotoBrowser photos={photos} theme="dark" ref={standaloneDarkRef} />
		<Popup opened={previewStore.opened} tabletFullscreen closeByBackdropClick={false}>
			<Page>
				<Navbar>
					<NavRight>
						<Link className="px-2" onClick={() => previewStore.close()}>
							{$t('关闭')}
						</Link>
					</NavRight>
				</Navbar>
				<PageContent className="p-0 bg-white">
					<div className="h-full overflow-auto relative flex flex-col justify-center items-center">
						{previewStore.list.map((item, index) =>
							item.type === 'video' ? (
								<video className="h-full" key={index} src={item.url} autoPlay loop muted controls />
							) : (
								<img className="" key={index} src={item.url} alt="" />
							)
						)}
					</div>
				</PageContent>
			</Page>
		</Popup>
	)
}

export default Preview
