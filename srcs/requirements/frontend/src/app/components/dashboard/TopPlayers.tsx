import { FaCrown } from 'react-icons/fa'

const TopPlayers = () => {
    return (
    <div className='py-4 w-full'>
        <div className='flex gap-1 pl-4 pb-6'>
            <FaCrown className="text-[#E89B05]"/>
            <p className="text-white font-semibold"> Popular Rooms Today </p>
        </div>
        <div className='w-full h-[26rem] bg-[#20204A] rounded-[2rem] '>
            
        </div>
    </div>)
}

export default TopPlayers