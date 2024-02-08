import { BsExclamationCircle } from 'react-icons/bs';

const PlayerNotFoundd = () => {
  return (
    <div
      className="md:w-[35rem] md:h-[18rem] border-8 border-white/40 self-center bg-[#17194A] rounded-[3.5rem]
    flex flex-col gap-8 justify-center  shadow-lg"
    >
      <BsExclamationCircle className="w-14 h-14 text-white self-center" />
      <div className="flex flex-col gap-4 self-center">
        <h1 className="text-2xl text-white font-bold self-center">
          No available players
        </h1>
        <p className="text-white/60 self-center">you can try later</p>
      </div>
    </div>
  );
};

export default PlayerNotFoundd;
