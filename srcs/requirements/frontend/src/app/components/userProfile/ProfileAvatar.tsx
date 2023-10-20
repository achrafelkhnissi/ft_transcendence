import Image from "next/image";
import { useEffect, useRef } from "react";

const ProfileAvatar = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const xp = 70; //user xp points

    useEffect(() => {

        const width = progressRef.current?.offsetWidth ;
        const height = progressRef.current?.offsetHeight;
        const totalLength =  width && height? width * 2 + height * 2 : 0;
        const progressLength = (totalLength * xp) / 100;

        var backgroundSize = "";
        var backgroundPosition = "";
        const halfBottomEdge = (totalLength / 4) / 2;

        if (xp <= 12.5){ //the right bottom edge: why 12.5? each edge is 25% and the bottom edgde is devided by 2

            backgroundSize = `  
                            100% 10px,   
                            10px 100%, 
                            36% 10px, 
                            ${xp * 2.4}% 10px, 
                            10px 100% ,
                            100% 100%;`
            //the right bottom edge is (30% width so 30% equal 12.5% of the whole length so to calculate the percentage we need to multply it by (30 / 12.5) = 2.4
            backgroundPosition = ` 
                                -100px -100px, 
                                -100px 0px, 
                                0px -100px , 
                                70px 100px, 
                                -100px 0px, 
                                0px 0px;`

        } else if ( xp > 12.5 && xp <= 37.5){ // 12.5 < xp <= 12.5 + 25
        
            backgroundSize = ` 
                            100% 10px, 
                            10px 100%, 
                            36% 10px, 
                            30% 10px, 
                            10px 100% ,
                            100% 100%;`

            backgroundPosition = ` 
                                -100px -100px, 
                                100px ${110 - (progressLength - halfBottomEdge)}px, 
                                0px -100px , 
                                70px 100px, 
                                -100px -100px, 
                                0px 0px;`

            //why 110 - (progressLength - halgBottomEdge)? : hight of the border - (the length calculated - the pat already filled)
        } else if ( xp > 37.5 && xp <= 62.5){

            backgroundSize = ` 
                            100% 10px, 
                            10px 100%,
                            30% 10px, 
                            36% 10px, 
                            10px 100% ,
                            100% 100%;`

            backgroundPosition = `
                                 ${110 -( progressLength - halfBottomEdge - (totalLength / 4))}px 0px, 
                                 100px 0px, 
                                 0px -100px , 
                                 70px 100px, 
                                 -100px -100px, 
                                 0px 0px;`

        } else if (xp > 62.5 && xp <= 87.5){

            backgroundSize = ` 
                            100% 10px, 
                            10px 100%,
                            36% 10px, 
                            30% 10px, 
                            10px 100% ,
                            100% 100%;`

            backgroundPosition = ` 
                                0px 0px, 
                                100px 0px, 
                                0px -100px , 
                                70px 100px, 0px ${-110 + ( progressLength - halfBottomEdge - (totalLength / 2))}px, 
                                0px 0px,
                                0px 0px;`
                                // width - the parts already filled
        }
        else{
            backgroundSize = `
                            100% 10px, 
                            10px 100%, 
                            ${(xp - 87.5) * 2.88 }% 10px, 
                            30% 10px, 
                            10px 100% ,
                            100% 100%;`
            //why 2.88? : 36 / 12.5 = 2.88
            backgroundPosition = ` 
                                0px 0px, 
                                100px 0px, 
                                0px 100px , 
                                70px 100px, 
                                0px 0px, 
                                0px 0px;`
        }
        const style = `
            background-size: ${backgroundSize};
            background-position: ${backgroundPosition};

    `;
    progressRef.current?.setAttribute('style', style);

    }, [xp]);

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
                <div className={`
                                absolute 
                                bg-[#6d3de7] 
                                text-white/75 
                                flex 
                                justify-center 
                                h-[1.6rem] 
                                w-[1.8rem] 
                                rounded-md 
                                -bottom-[0.9rem] 
                                left-1/2 
                                transform 
                                -translate-x-1/2 
                                font-semibold 
                                text-s
                                shadow-inner `}>
                    <p className="self-center">4</p>
                </div>
        </div>

        </div>
    </div>);
};

export default ProfileAvatar;

