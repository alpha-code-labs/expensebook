import { useState, useRef, useEffect } from "react";
import { titleCase } from "../utilis/handyFunctions";

export default function Input(props) {
    const placeholder = props.placeholder || "Placeholder Text";
    const value = props.value || '';
    const title = props.title || "Title";
    const type = props.type || 'text';
    const min = props.min 
    const onBlur = props.onBlur;
    const onChange = props.onChange;
    const showLocationSymbol = props.showLocationSymbol ?? false;
    const inputRef = useRef(null);
    const [textInput, setTextInput] = useState(titleCase(value));
    const error = props.error || { set: false, message: '' };
    const [inputEntered, setInputEntered] = useState(!!value);

    useEffect(() => {
        setTextInput(titleCase(value));
    }, [value]);

    const handleChange = (e) => {
        e.preventDefault();
        setTextInput(e.target.value);
        if (e.target.value === '') {
            setInputEntered(false);
        } else {
            setInputEntered(true);
        }
        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = (e) => {
        setTextInput((pre) => titleCase(pre));
        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <div className={`${showLocationSymbol ? 'min-w-[184px]' : 'min-w-[200px]'} w-full md:w-fit max-w-[403px] h-[73px] flex-col justify-start items-start gap-2 inline-flex`}>
            {/* title */}
            <div className="text-zinc-600 text-sm font-cabin">{title}</div>

            {/* input */}
            <div className="relative w-full h-full bg-white items-center flex">
                <div className="relative text-neutral-700 w-full h-full text-sm font-normal font-cabin">
                    <input
                        min={min}
                        type={type}
                        ref={inputRef}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full h-full decoration:none ${showLocationSymbol ? 'pr-6 pl-12' : 'px-6'} py-2 border rounded-md border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600`}
                        value={textInput}
                        placeholder={placeholder}>
                    </input>
                </div>
                <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                    {error.set && !inputEntered && error.message}
                </div>
            </div>
        </div>
    );
}