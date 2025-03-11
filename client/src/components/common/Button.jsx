import { uploading_icon } from "../../assets/icon";

export default function Button(props) {
    const text = props.text;
    const onClick = props.onClick;
    const variant = props.variant ?? 'fit';
    const disabled = props.disabled ?? false;
    const uploading = props.uploading ?? false;
    console.log(disabled);

    const handleClick = (e) => {
        if (!disabled && onClick) {
            onClick(e);
        } else {
            console.log('disabled');
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={`${variant == 'fit' ? 'w-fit' : 'w-full'} ${
                    disabled
                        ? 'hover:bg-indigo-400 hover:text-gray-400 bg-indigo-400 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-indigo-500  text-white cursor-pointer'
                } h-12 px-8 py-4 bg-indigo-600 rounded-[32px] justify-center items-center gap-2 inline-flex cursor-pointer`}
            >
                {(uploading && disabled) ? <img src={uploading_icon} className="animate-spin w-8 h-8"/> :
                <div className="w-full h-5 text-center text-white text-base font-medium font-cabin">
                    {text}
                </div>}
            </div>
        </>
    );
}
