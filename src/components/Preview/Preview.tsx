import { usePreviewStore } from '@/stores/preview'
import { Button, Popup } from 'framework7-react'

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
			<div className="h-full bg-black relative flex flex-col justify-center items-center">
				<div className="w-full h-14 px-4 z-10 flex justify-between items-center  absolute top-0 left-0">
					<Button onClick={() => previewStore.close()}>关闭</Button>
				</div>
				{previewStore.list.map((item, index) =>
					item.type === 'video' ? (
						<video className="h-full" key={index} src={item.url} autoPlay loop muted controls />
					) : (
						<img key={index} src={item.url} alt="" />
					)
				)}
			</div>
		</Popup>
	)
}

export default Preview
