"use client"

import Image from 'next/image'
import Avatar from '../Avatar';
import ProfileAvatar from './ProfileAvatar';

const UserInfo = () => {
    return (
    <div className="w-full p-4">
    <div className='w-full relative  h-[400px]'>
        <div className="h-[350px] w-full rounded-2xl p-6">
            <Image src="/images/profilebg.png" width={1200} height={600} alt="photo" className="rounded-[2.5rem] w-full h-full object-cover" />
        </div>
        <div className='absolute w-full h-28 bottom-8 rounded-[2.5rem] bg-[#20204A]/90'>
            <div className='w-full relative h-full'>
                <div className='absolute left-1/2 transform  -translate-x-1/2 -translate-y-1/2'>
                    <ProfileAvatar />
                </div>
            </div>
        </div>
    </div>
</div>
)}
export default UserInfo ;