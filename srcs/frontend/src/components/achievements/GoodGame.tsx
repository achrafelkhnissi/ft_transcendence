import Image from 'next/image';

const GoodGame = () => {
  return (
    <div
      className=" w-28 h-28  rounded-[1.5rem]
         bg-black p-1 shadow-xl shadow-black/30"
    >
      <Image
        width={400}
        height={400}
        src={'/images/goodGame.png'}
        alt={''}
        className="w-full h-full rounded-[1.5rem] object-fill"
      />
    </div>
  );
};
export default GoodGame;
