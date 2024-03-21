import { InputHTMLAttributes, useState } from "react"
import './CommInput.scss'
import { Icon } from "framework7-react";

interface CommInputProps {
    title?: string;
    clearButton?: boolean;
    onChange?: (value: any) => any
}

const CommInput: React.FC<CommInputProps & InputHTMLAttributes<HTMLInputElement>> = ({ clearButton = true, onChange, ...resetProps }) => {
    const [value, setValue] = useState(resetProps.defaultValue);

    const handleClear = () => {
        setValue('');
    };

    return (
        <div className='custom-input-container flex flex-col px-5 gap-y-1 mt-3'>
            <span className='ml-3 text-gray-700'>{resetProps?.title}</span>
            <div className="w-full input">
                <input value={value} onChange={(e) => {
                    onChange && onChange(e.target.value)
                    setValue(e.target.value)
                }} {...resetProps} className='input' />
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