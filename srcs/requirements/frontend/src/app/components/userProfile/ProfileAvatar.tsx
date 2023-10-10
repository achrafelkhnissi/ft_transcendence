import Image from "next/image";
import { useEffect, useRef } from "react";

const ProfileAvatar = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const xp = 12;

    useEffect(() => {   
        const totalLength = progressRef.current ? progressRef.current.offsetWidth * 2 + progressRef.current.offsetHeight * 2 : 0;
        const side:number = totalLength / 4;
        var backgroundSize = "";
        var backgroundPosition = "";

        console.log("totalLength", totalLength);
        console.log("side", side);

        

    }, []);

    return (<div className=" w-full h-full ">
        <div  ref={progressRef} className=" rectangulaire-progress-bar rounded-2xl flex justify-center">
        <div className="self-center relative">
            <Image
            src="/images/fathjami.jpeg" 
            width={40} 
            height={40} 
            alt="profile" 
            className={
                `w-[6.1rem] 
                h-[6.1rem]
                rounded-xl

                `}/>
                <div className={`absolute bg-[#7743F9] text-white flex justify-center h-[1.6rem] w-[1.8rem] rounded-md -bottom-3 left-1/2 transform -translate-x-1/2 font-semibold text-xs 
                 shadow-inner `}>
                    <p className="self-center">10</p>
                </div>
        </div>

        </div>
    </div>);
};

export default ProfileAvatar;


/*
background-size: 100% 10px, 10px 100%, 50% 10px, 50% 10px, 10px 100% ,100% 100%; */
/**
 * background-position: how far from left edge , how far from top ( negative how far from bottom)
      0px 0px,  top edge
      100px 0px,  right edge 
      0px 100px ,  bottom left 
      50px 100px,  bottom right 
      0px 0px,  left edge
      0px 0px; gradient fill

 */