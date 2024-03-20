import { useState } from "react"

const CommInput = ({ title, onChange }: { title: string, onChange: Function }) => {
    const [value, setValue] = useState('');
    const handleClear = () => {
        setValue('');
    };
    return (
        <div className='custom-input-container flex flex-col px-5 gap-y-1'>
            <span className='ml-3 text-gray-700'>{title}</span>
            <div className="w-full flex">
                <input value={value} onChange={(e) => {
                    onChange(e.target.value)
                    setValue(e.target.value)
                }} className='rounded-md h-10 w-full bg-gray-100 px-3'></input>
                {value && ( // 仅在输入框有值时显示清除按钮
                    <button className="clear-button w-4 h-4 text-xs rounded-full text-white bg-gray-300" style={{ position: 'relative', right: '25px', top: '12px'  }} onClick={handleClear}>
                        X
                    </button>
                )}
            </div>

        </div>
    )
}

export default CommInput