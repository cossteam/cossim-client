import { useWindowSize } from '@reactuses/core'
import { useEffect } from 'react'

function useMobile() {
	// const [isMobile, setIsMobile] = useState<boolean>(false)
	const { width } = useWindowSize()

	useEffect(() => {}, [width])
}

export default useMobile
