const Avatar: React.FC<any> = (props) => {
	console.log('props', props)
	return (
		<div {...props}>
			<img src={props.src} alt="" className="w-full h-full object-cover rounded-full bg-black bg-opacity-10" />
		</div>
	)
}

export default Avatar
