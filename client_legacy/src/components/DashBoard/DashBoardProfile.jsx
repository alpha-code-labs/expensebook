import { useNavigate } from "react-router-dom"
import { frame259, frame260, frame476, frame490, frame505, profilePic } from "../../assets/icon"


const DashBoardProfile = () => {
    const navigate = useNavigate();

    const redirectToProfile = () =>{
        navigate('/userProfile')
    }
    return(
        <div className="absolute top-[50px] left-[284px] flex flex-row items-center justify-start gap-[8px] text-base text-black">
        <img
          className="relative rounded-81xl w-8 h-8 overflow-hidden shrink-0 object-cover"
          alt=""
          src={profilePic}
          onClick={ redirectToProfile}
        />
        <div className="relative tracking-[-0.04em]" onClick={redirectToProfile}>Welcome Sumesh</div>
      </div>
    )
}

export default DashBoardProfile