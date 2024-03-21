import { useEffect, useRef, useState } from 'react'

interface TimerProps {
	timeout?: number
	onTimeout?: () => void
}

const Timer: React.FC<TimerProps> = ({ timeout, onTimeout }) => {
	const [seconds, setSeconds] = useState<number>(0)
	const timerRef = useRef<NodeJS.Timeout>()

	useEffect(() => {
		timerRef.current = setInterval(() => {
			setSeconds((seconds) => seconds + 1)
		}, 1000)
		return () => clearInterval(timerRef.current)
	}, [])

	useEffect(() => {
		if (!timeout) return
		if (seconds >= timeout) {
			clearInterval(timerRef.current)
			onTimeout && onTimeout()
		}
	}, [seconds, timeout, onTimeout])

	const formatTime = () => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	return (
		<>
			<span>
				{/* {timeout ? '超时模式: ' : '计时模式: '} */}
				{formatTime()}
			</span>
		</>
	)
}

export default Timer
