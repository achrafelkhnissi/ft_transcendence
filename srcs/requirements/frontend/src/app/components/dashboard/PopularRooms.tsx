import { AiFillFire } from 'react-icons/ai'
import ChannelCard from './ChannelCard';


const PopularRooms = () => {

    interface channlesProps {
        image: string;
        name: string;
      }
      
      const channels: channlesProps[] = [
        {
          image: "channel1.webp",
          name: "name",
        },
        {
          image: "channel2.webp",
          name: "name",
        },  
        {
          image: "channel3.webp",
          name: "name",
        },
        {
          image: "channel4.webp",
          name: "name",
        },
      ]

    return (
        <div className="w-full py-2">
            <div className='flex gap-1 pl-4'>
            <AiFillFire className="text-[#E89B05]"/>
            <p className="text-white font-semibold"> Popular Rooms Today </p>
            </div>
            <div className='h-full py-6 flex justify-center gap-6 flex-wrap'>
                {channels.map((item, index) => {
                    return (<ChannelCard key={index} imageSrc={item.image}/>);
                })}
            </div>
        </div>
    )
}

export default PopularRooms;