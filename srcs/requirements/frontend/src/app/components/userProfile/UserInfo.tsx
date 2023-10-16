"use client"

import Image from 'next/image'
import Avatar from '../Avatar';
import ProfileAvatar from './ProfileAvatar';
import UserName from './UserName'
import Stats from './Stats';
import Contacts from './Contacts';

const UserInfo = () => {
    return (
    <div className="w-full p-4">
    <div className='w-full relative  h-[400px]'>
        <div className="h-[350px] w-full rounded-2xl p-6">
            <Image src="/images/profilebg.png" width={1200} height={600} alt="photo" className="rounded-[2.5rem] w-full h-full object-cover" />
        </div>
        <div className='absolute w-full h-28 bottom-8 rounded-[2.5rem] bg-[#20204A]/90 '>
            <div className='w-full relative h-full flex justify-center'>
                <div className='absolute left-1/2 transform  -translate-x-1/2 -translate-y-1/2'>
                    <ProfileAvatar />
                </div>
                <div className=' absolute bottom-2 '>
                    <UserName name="fathjami"/>
                </div>
                <div className='flex justify-between px-12  w-full'>
                    <div className='self-center'>
                        <Stats/>
                    </div>
                    <div className='self-center'>
                        <Contacts/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
)}
export default UserInfo ;