import { IoIosInformationCircleOutline } from 'react-icons/io';
import React, { useState } from 'react';

interface InfoIconProps {
  clicked: boolean;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  clicked,
}) => {

  return (
    <div className='relative '>
      <IoIosInformationCircleOutline
        className={`w-[1.6rem] h-[1.6rem] 
        ${clicked ? 'text-[#b6b6f9]' : 'text-[#59598E]'}
        drop-shadow-[0_3px_4px_rgba(255,255,255,0.3)] cursor-pointer`}
      />
    </div>
  );
};

export default InfoIcon;
