import emptyFileIllustration from '../../assets/emptyFileIllustration.jpg';
import HollowButton from './HollowButton';

export default function({message, onclick, buttonTitle}){

    return(
        <div>            
            <div className='mx-auto bg-white flex flex-col items-center'>
                <img src={emptyFileIllustration} className='w-[400px] h-[400px]'/>
                <h1 className='font-cabin text-lg mb-4'>{message}</h1>
                <HollowButton variant='fit' title={buttonTitle} onClick={onclick} />
            </div>
        </div>
    )
}