import Image from "next/image";

const ProfileAvatar = () => {
    return (<div className=" w-full h-full ">
        <div className="">
            <Image
            src="/images/fathjami.jpeg" 
            width={40} 
            height={40} 
            alt="profile" 
            className={
                `w-24 
                h-24
                rounded-3xl
                `}/>
        </div>
    </div>);
};

export default ProfileAvatar;