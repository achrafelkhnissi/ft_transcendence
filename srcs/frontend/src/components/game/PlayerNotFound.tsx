import { BsExclamationCircle } from 'react-icons/bs';

const PlayerNotFoundd = () => {
  return (
    <div
      className="w-[20rem] md:w-[35rem] md:h-[18rem] border-4 border-white/40 self-center bg-[#17194A] rounded-[2rem]
    flex flex-col md:gap-8 gap-4 justify-center shadow-lg p-4"
    >
      <BsExclamationCircle className="w-8 h-8 md:w-14 md:h-14 text-white self-center" />
      <div className="flex flex-col gap-4 self-center">
        <h1 className="text-sm md:text-2xl text-white font-bold self-center">
          No available players
        </h1>
        <p className="text-xs md:text-base text-white/60 self-center">you can try later</p>
      </div>
    </div>
  );
};

export default PlayerNotFoundd;
