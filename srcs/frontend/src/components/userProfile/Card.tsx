interface CardProps {
  header: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, header, icon }) => {
  return (
    <div className="w-full h-full bg-[#20204A] rounded-[3rem] overflow-hidden pb-4 shadow-2xl">
      <div className=" w-full h-[3.7rem] rounded-t-[3rem] border-b-[0.1rem] bg-[#20204A] border-b-[#6C61A4]/60 relative ">
        <div className="text-white font-bold flex gap-2 absolute top-5 left-6">
          {icon}
          {header.toUpperCase()}
        </div>
      </div>
      <div className="py-4 overflow-y-auto scroll-smooth max-[880px]:max-h-[250px]">
        {children}
      </div>
    </div>
  );
};

export default Card;
