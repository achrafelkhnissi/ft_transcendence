import Image from "next/image";

const ProfileAvatar = () => {
    return (<div className=" w-full h-full ">
        <div className="rectangulaire-progress-bar rounded-2xl flex justify-center">
        <div className="self-center">
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
        </div>

        </div>
    </div>);
};

export default ProfileAvatar;