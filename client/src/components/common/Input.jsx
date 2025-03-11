// import { useState, useRef, useEffect } from "react";
// import { titleCase } from "../../utils/handyFunctions";
// import visibility_on_icon from '../../assets/visibility_on.svg';
// import visibility_off_icon from '../../assets/visibility_off.svg';
// import { mail_Icon } from "../../assets/icon";

// export default function Input(props) {
//     const placeholder = props.placeholder || "Placeholder Text";
//     const value = props.value;
//     const textCase = props.textCase;
//     const title = props.title || "Title";
//     const onBlur = props.onBlur;
//     const type = props.type ?? 'text';
//     const onChange = props.onChange;
//     const inputRef = useRef(null);
//     const titlecase = props.titleCase ?? true;
//     const [textInput, setTextInput] = useState(value ? titleCase(value) : '');
//     const error = props.error || { set: false, message: '' };
//     const [inputEntered, setInputEntered] = useState(false);
//     const [visibility, setVisibility] = useState(false);

//     const handleChange = (e) => {
//         e.preventDefault();
//         setTextInput(e.target.value);
//         if (e.target.value === '') setInputEntered(false);
//         else setInputEntered(true);
//         if (onChange) onChange(e);
//     };

//     const handleBlur = (e) => {
//         if (titlecase) setTextInput((prev) => titleCase(prev));
//         if (onBlur) onBlur(e);
//     };

//     const handleCountryCodeChange = (selectedCountryCode) => {
//         // Handle selected country code here
//     };

//     return (
//         <>
//             <div className="min-w-[200px] w-full  h-[73px] flex-col justify-start items-start gap-2 inline-flex grow">
//                 {/* title */}
//                 <div className="text-zinc-600 text-sm font-cabin">{title}</div>

//                 {/* input */}
//                 <div className="relative w-full h-full bg-white items-center flex">
//                     <div className="relative text-neutral-700 w-full h-full text-sm font-normal font-cabin flex items-center justify-between">
//                         {type === 'contact' ? (
//                             <>
//                                 <select
//                                     onChange={(e) => handleCountryCodeChange(e.target.value)}
//                                     className="h-full border-r border-neutral-300 bg-white appearance-none px-3 py-2 rounded-l-md focus-visible:outline-0 focus-visible:border-indigo-600"
//                                 >
//                                     {/* Option list for country codes */}
//                                     <option className="h-[48px]" value="+1">+1</option>
//                                     <option value="+44">+44</option>
//                                     {/* Add more country codes here */}
//                                 </select>
//                                 <input
//                                     ref={inputRef}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     type={visibility ? 'text' : 'text'}
//                                     className={` ${textCase === 'titleCase' ? 'capitalize' : ''} w-full h-full decoration:none px-6 py-2 rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 `}
//                                     value={textInput}
//                                     placeholder={placeholder}
//                                 />
//                             </>
//                         ) : (
//                             <input
//                                 ref={inputRef}
//                                 onChange={handleChange}
//                                 onBlur={handleBlur}
//                                 type={visibility ? 'text' : type}
//                                 className={` ${textCase === 'titleCase' ? 'capitalize' : ''} w-full h-full decoration:none px-6 py-2 rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600 `}
//                                 value={textInput}
//                                 placeholder={placeholder}
//                             />
//                         )}
//                         {type === 'password' && (
//                             <img
//                                 src={visibility ? visibility_on_icon : visibility_off_icon}
//                                 className="absolute w-6 right-2 bg-white cursor-pointer"
//                                 onClick={() => setVisibility((prev) => !prev)}
//                             />
//                         )}
//                         {type === 'email' && (
//                             <img
//                                 src={mail_Icon}
//                                 className="absolute w-5 right-2 bg-white cursor-pointer"
//                                 onClick={() => setVisibility((prev) => !prev)}
//                             />
//                         )}
//                     </div>

//                     <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
//                         {error.set && error.message}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import { useState, useEffect, forwardRef } from "react";
import { titleCase } from "../../utils/handyFunctions";
import visibility_on_icon from '../../assets/visibility_on.svg';
import visibility_off_icon from '../../assets/visibility_off.svg';
import { mail_Icon } from "../../assets/icon";

const Input = forwardRef((props, ref) => {
    const placeholder = props.placeholder || "Placeholder Text";
    const value = props.value;
    const textCase = props.textCase;
    const title = props.title || "Title";
    const onBlur = props.onBlur;
    const type = props.type ?? 'text';
    const onChange = props.onChange;
    const titlecase = props.titleCase ?? true;
    const [textInput, setTextInput] = useState(value ? titleCase(value) : '');
    const error = props.error || { set: false, message: '' };
    const [inputEntered, setInputEntered] = useState(false);
    const [visibility, setVisibility] = useState(false);

    // Handle auto-filled values
    useEffect(() => {
        if (ref && ref.current) {
            setTimeout(() => {
                if (ref.current.value) {
                    setTextInput(ref.current.value);
                    setInputEntered(true);
                }
            }, 100); // Adjust timeout for autofill detection
        }
    }, [ref]);

    const handleChange = (e) => {
        if (e.target.value !== '' || e.target.value !== 'undefined' || e.target.value !== null)
            {setInputEntered(e.target.value)
        setTextInput(e.target.value)}
        else setFilled(null)
    }

    const handleBlur = (e) => {
        if (titlecase) setTextInput((pre) => titleCase(pre));
        if (onBlur) onBlur(e);
    };

    return (
        <>
            <div className="min-w-[200px] w-full max-w-[500px] h-[73px] flex-col justify-start items-start gap-2 inline-flex grow">
                {/* title */}
                <div className="text-zinc-600 text-sm font-cabin">{title}</div>

                {/* input */}
                <div className="relative w-full h-full bg-white items-center flex">
                    <div className="relative text-neutral-700 w-full h-full text-sm font-normal font-cabin flex items-center justify-between">
                        <input
                            ref={ref}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type={visibility ? 'text' : type}
                            className={` ${textCase === 'titleCase' ? 'capitalize' : ''} w-full h-full decoration:none px-6 py-2 rounded-md border border-neutral-300 focus-visible:outline-0 focus-visible:border-indigo-600`}
                            value={textInput}
                            placeholder={placeholder}
                        />
                        {type === 'password' && (
                            <img
                                src={visibility ? visibility_on_icon : visibility_off_icon}
                                className="absolute w-6 right-2 bg-white cursor-pointer"
                                onClick={() => setVisibility((pre) => !pre)}
                            />
                        )}
                        {type === 'email' && (
                            <img
                                src={mail_Icon}
                                className="absolute w-5 right-2 bg-white cursor-pointer"
                            />
                        )}
                    </div>

                    <div className="absolute text-xs text-red-600 left-0 px-6 top-[44px]">
                        {error.set && error.message}
                    </div>
                </div>
            </div>
        </>
    );
});

export default Input;

