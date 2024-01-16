'use client'

import { useRouter } from 'next/navigation';
import confirmCode from "@/services/confirmCode";
import { ChangeEvent } from "react";
import { ToastContainer } from 'react-toastify';

const Verify = () => {

    const router = useRouter();

    const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value;
        const regex = /^\d{6}$/;

        if (regex.test(code)){
    
            confirmCode(code, code).then(res => 
                {   
                    if (res)
                        router.push("/dashboard");
                    else {
                        // router.push('http://localhost:3000/api/auth/logout');
                        e.target.value = ""
                    }
                        
                })
        }
    }

    return (
        <div className="flex justify-center  h-full">
            <ToastContainer position="top-right" autoClose={5000}/>
            <form className="self-center h-4/5 text-center flex flex-col justify-center gap-6">
                {/* <div className="w-12 h-12 flex flex-col gap-0 relative"> */}
                <p className="text-[1.6rem] text-center text-blue-400/80 -mt-2">
                    Athenticate You Account
                </p>
                <input
                    type="text"
                    id="0"
                    maxLength={6}
                    onChange={(e) => handleInput(e)}
                    placeholder="0 0 0 0 0 0"
                    className=" self-center w-3/5 h-16 text-center text-[2rem] tracking-widest bg-transparent outline-none text-white border-b-[0.2rem] border-blue-400/50 z-10
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                    placeholder:text-white/30 placeholder:font-extralight "       
                />
                {/* <p className=" text-center absolute bottom-0 text-white/80 text-lg left-[0.45rem]">____</p> */}
                {/* </div> */}
            </form>
        </div>
    )
}

export default Verify;