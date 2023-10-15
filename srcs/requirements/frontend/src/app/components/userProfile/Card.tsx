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
             shadow-xl
    `}>
                                
        <div className='
                        text-white 
                        absolute 
                        top-5 
                        left-6 
                        font-bold  
                        flex 
                        gap-2
                       '>
            {icon}
            {header.toUpperCase()}
        </div>
        <div className="absolute w-full border-[0.09rem] top-14 border-[#6C61A4]/60"></div>
        {children}
    </div>)

}

export default Card;