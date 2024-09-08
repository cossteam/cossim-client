import style from '@/styles/loading.module.css'

export const Loading = () => {
    return (
        <div className={style.loading}>
            {Array.from({ length: 5 }).map((_, index) => (
                <span className={style.span} key={index} />
            ))}
        </div>
    )
}
