import { $t } from "@/shared"
import { f7 } from "framework7-react"
import { useState } from "react"

function useLoading() {
    const [loading, setLoading] = useState(false);
    // 异步加载钩子
    async function watchAsyncFn<T>(fn: (...args: any[]) => Promise<T>, content: string = '加载中...') {
        f7.dialog.preloader($t(content))
        setLoading(true)
        return fn().finally(() => {
            setLoading(false)
            f7.dialog.close()
        })
    }

    return {
        loading,
        watchAsyncFn
    }
}

export default useLoading