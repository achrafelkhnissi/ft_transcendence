'use client'

import { useState } from "react";

const PreviewSwitch = () => {
    const [active, setActive] = useState<"messages" | "channels">("messages");
    return (
        <div className="
        w-[350px] h-14 bg-[#101038] m-auto rounded-[1rem] px-2
        shadow-[inset_0_10px_10px_5px_rgba(0,0,0,0.1)]
        flex justify-around
        text-[#453e76] font-bold
">
            <div className={`self-center
                ${active === "messages" && "border-2 border-white/40 text-white bg-[#363366]"} 
                px-[2.7rem] rounded-xl py-2 
                hover:cursor-pointer
                `}
            onClick={() => setActive('messages')}
            > 
                Messages 
            </div>
            <div className={`self-center
               ${active === "channels" && "border-2 border-white/40 text-white bg-[#363366]"} 
               px-[2.7rem] rounded-xl py-2
               hover:cursor-pointer
            `}
               onClick={() => setActive('channels')}
            > 
                Channels 
            </div>
        </div>
    )
}

export default PreviewSwitch;