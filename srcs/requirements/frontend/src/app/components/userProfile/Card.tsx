interface CardProps {
    header: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, header, icon}) =>{
    return (<div className={`
             w-full
             h-full
             rounded-[3rem]
             bg-[#20204A]
             relative
    `}>
                                
        <div className="text-white absolute top-5 left-10 font-bold text-xl">
            {icon}
            {header.toUpperCase()}
        </div>
        <div className="absolute w-full border-[0.1rem] top-16 border-[#6C61A4]/60"></div>
        {children}
    </div>)

}

export default Card;