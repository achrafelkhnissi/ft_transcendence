import { AiFillFire } from 'react-icons/ai'
import ChannelCard from './ChannelCard';

const PopularRooms = () => {
    return (
        <div className="w-full h-[25rem] p-4">
            <div className='flex gap-1'>
            <AiFillFire className="text-[#E89B05]"/>
            <p className="text-white font-semibold"> Popular Rooms Today </p>
            </div>
            <div className='h-full py-4 flex justify-center gap-6 '>
                <ChannelCard />
                <ChannelCard />
                <ChannelCard />
            </div>
        </div>
    )
}

export default PopularRooms;