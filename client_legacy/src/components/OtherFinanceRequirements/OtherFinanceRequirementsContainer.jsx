import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

const OtherFinanceRequirementsContainer = () => {
  const [wait  , setWait] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setWait(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex justify-center w-[1000px] text-red text-base mt-24 text-6xl">
      <p className="text-6xl">There are some issues over the network , please retry after some time....</p>
      {wait && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </div>
  )
}

export default OtherFinanceRequirementsContainer