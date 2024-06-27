import React from 'react';
import * as Switch from '@radix-ui/react-switch';
import './switch.css';

export default function({isChecked, setIsChecked, label}){
    
// console.log('from switched', isChecked)

return(
    <div className={'flex items-center'}>
      <label className="Label pr-[15px]" htmlFor="airplane-mode" >
        {label}
      </label>
      <Switch.Root checked={isChecked} onCheckedChange={(checked)=>setIsChecked(checked)} className="SwitchRoot" id="airplane-mode">
        <Switch.Thumb className="SwitchThumb" />
      </Switch.Root>
    </div>
    );
}