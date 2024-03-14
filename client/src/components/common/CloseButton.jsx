import cross_icon from '../../assets/x.svg'

export default function({onClick}){

    return(<>
        <div className="w-6 h-6 cursor-pointer hover:rounded-full hover:bg-red-200" onClick={onClick}>
            <img src={cross_icon} />
        </div>
        </>)
}