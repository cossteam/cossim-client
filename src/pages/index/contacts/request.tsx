import { RequestType } from '@/lib/enum'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RequestList from '@/components/common/rquest-list'

const RequestPage = () => {
    const [params] = useSearchParams()
    const [type, setType] = useState<RequestType>(RequestType.RequestContact)

    useEffect(() => {
        const type = params.get('type') as RequestType
        if (type) setType(type)
    }, [params])

    return <RequestList type={type} />
}

export default RequestPage
