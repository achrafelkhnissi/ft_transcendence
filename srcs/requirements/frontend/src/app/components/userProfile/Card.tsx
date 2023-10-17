interface CardProps {
    header: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, header, icon}) =>{

    return (
    <div className="w-full h-full bg-[#20204A] rounded-[3rem] overflow-hidden pb-4">
        <div className=' w-full h-16 rounded-t-[3rem] border-b-2 bg-[#20204A] border-b-[#6C61A4]/60 relative '>
            <div className="text-white font-bold flex gap-2 absolute top-5 left-6">
                {icon}
                {header.toUpperCase()}
            </div>
        </div>
        <div className="p-2 overflow-y-auto scroll-smooth max-h-[200px] ">
            {children}
        </div>
    </div>)

}

export default Card;
