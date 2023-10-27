import {TbMessageCircle2Filled} from 'react-icons/tb'
import {TiUserAdd} from 'react-icons/ti'
import Logo_42 from '../logos/Logo_42';
import Link from 'next/link';

const Contacts = () => {

    interface ContactsProps {
        label: string;
        href: string;
        color: string;
        icon: React.ReactNode;
    }
    
    const ContactsItems: ContactsProps[] = [
        {
            label: "send a message",
            href : "/conversation",
            color : "#31A350",
            icon : <TbMessageCircle2Filled className="text-white w-6 h-6 bg-[#31A350]"/>,
        },
        {
            label: "send a friend request",
            href : "/friend-request",
            color : "#3385FF",
            icon : <TiUserAdd className="text-white w-6 h-6 bg-[#3385FF]"/>,
        },
        {
            label: "intra profile ",
            href : "/profile-intra",
            color : "#6257FE",
            icon : <Logo_42 color="white" width='1.7rem' height='1.5rem'/>,
        }
    ]

    return (
        <div className='flex justify-center gap-4 px-6'>
            {ContactsItems.map( (item, index) => {
                return (
                    <Link
                    key={index}
                    href={item.href} 
                    className={`
                    rounded-xl
                    bg-[${item.color}]
                    p-2
                    `}>
                         {item.icon}
                    </Link>
                )
            })}
        </div>
    )
}

export default Contacts;

