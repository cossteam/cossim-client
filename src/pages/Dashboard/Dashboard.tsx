import DesktopLayout from '@/components/Layout/DesktopLayout'
import MobileLayout from '@/components/Layout/MobileLayout'
import { useWindowSize } from '@reactuses/core'
import { useMemo } from 'react'

const Dashboard = () => {
	const { width } = useWindowSize()

	const isMobile = useMemo(() => width < 750, [width])

	return isMobile ? <MobileLayout /> : <DesktopLayout />
}

export default Dashboard
