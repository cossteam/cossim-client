import { usePreviewStore } from '@/stores/preview'
import { Button, Popup } from 'framework7-react'

const Preview: React.FC = () => {
	const previewStore = usePreviewStore()

	return (
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
