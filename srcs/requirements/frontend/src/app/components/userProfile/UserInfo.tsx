import Image from 'next/image'

const UserInfo = () => {
    return (
    <div className="w-full p-6">
        <div className="h-[300px] w-full rounded-xl border-2">
            <Image src="/images/profilebg.png" width={1200} height={600} alt="photo" className="rounded-xl w-full h-full object-cover" />
        </div>
    </div>
)}

export default UserInfo ;