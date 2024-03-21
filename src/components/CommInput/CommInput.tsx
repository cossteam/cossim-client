import { useEffect, useState } from "react"
import './CommInput.scss'
import { Icon } from "framework7-react";
const CommInput = ({ title, defaultValue, clearButton = true, type = 'text', onChange }: 
    { title: string, defaultValue: string | number, clearButton?: boolean, type?: string, onChange: Function }) => {
    const [value, setValue] = useState<string | number>();
    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])
    const handleClear = () => {
        setValue('');
    };

    return (
        <div className='custom-input-container flex flex-col px-5 gap-y-1'>
            <span className='ml-3 text-gray-700'>{title}</span>
            <div className="w-full">
                <input value={value} type={type} onChange={(e) => {
                    onChange(e.target.value)
                    setValue(e.target.value)
                }} className='input' />
                {value && clearButton && ( // 仅在输入框有值时显示清除按钮
                    <button className="clear-button w-4 h-4 text-xs rounded-full text-white bg-gray-300" onClick={handleClear}>
                        <Icon size={11} f7="xmark"/>
                    </button>
                )}
            </div>

        </div>
    )
}

export default CommInput