interface MemberProps {
  id: number | undefined;
  username: string;
  avatar: string;
  role: string;
  status: string;
}

const Member: React.FC<MemberProps> = ({
  avatar,
  username,
  role,
  status,
  id,
}) => {
  return (
    <div className="w-full h-14 bg-white/10  rounded-2xl flex justify-between px-4 relative">
      <div className="self-center flex justify-center gap-2 md:text-sm text-xs ">
        <img
          src={avatar}
          alt=""
          className="w-10 h-10 rounded-full self-center object-cover"
        />
        <p className="self-center">{username}</p>
      </div>
      <p className="self-center text-sm text-white/30">{role}</p>
      {/* { <div className=" border-2 w-24 h-[10rem] right-1"></div>} */}
    </div>
  );
};

export default Member;
