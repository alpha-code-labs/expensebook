import Icon from "../components/common/Icon";
import Error from "../components/common/Error";

export default function MainLayoutWithLoader({children, loading, loadingErrMsg}){


    return(<>
            {loading && <Error message={loadingErrMsg}/>}
                {!loading && <div className="w-full h-full relative bg-white md:px-24 md:mx-0 sm:px-0 sm:mx-auto py-12 select-none">
                {/* app icon */}
                <div className='w-full flex justify-center  md:justify-start lg:justify-start'>
                    <Icon/>
                </div>

                {children}
            </div>}
    </>)
}