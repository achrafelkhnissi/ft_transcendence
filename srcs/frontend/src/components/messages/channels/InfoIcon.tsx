import { IoIosInformationCircleOutline } from 'react-icons/io';
import { useState } from 'react';

const InfoIcon = () => {

  return (
    <div className='relative '>
      <IoIosInformationCircleOutline
        className="w-[1.6rem] h-[1.6rem] text-[#59598E]
        drop-shadow-[0_3px_4px_rgba(255,255,255,0.3)] cursor-pointer"
      />
    </div>
  );
};

export default InfoIcon;
