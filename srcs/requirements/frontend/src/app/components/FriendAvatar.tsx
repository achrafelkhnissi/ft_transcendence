import Image from "next/image"

const FriendAvatar = () => {
    return (<div className=" flex gap-1 flex-col justify-center p-1">
        <div className="relative self-center p-1">
            <Image src={'/images/fathjami.jpeg'} alt="" width={60} height={60} 
            className=' rounded-full relative w-12 h-`12   
                        outline 
                        outline-2 
                        outline-offset-[1.5px]
                        outline-gray-400/70 '/>
        </div>
        <p className="self-center text-white/70 text-sm font-light">
            fathjami
        </p>
    </div>)
}

export default FriendAvatar