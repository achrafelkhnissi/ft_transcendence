import Image from "next/image"

const FriendAvatar = () => {
    return (<div className=" flex gap-1 flex-col justify-center ">
        <div className="relative self-center">
            <Image src={'/images/fathjami.jpeg'} alt="" width={60} height={60} 
            className=' rounded-full relative'/>
            <div className="h-[0.6rem] w-[0.6rem]  rounded-full bg-green-500 absolute bottom-1 right-1 "></div>
        </div>
        <p className="self-center text-white/80 text-sm">
            fathjami
        </p>
    </div>)
}

export default FriendAvatar