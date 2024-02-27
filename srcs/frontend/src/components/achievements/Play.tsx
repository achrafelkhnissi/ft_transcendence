import Image from 'next/image';

const Play = () => {
  return (
    <div
      className="c w-28 h-28  rounded-[1.5rem] border-4 border-pink-400/10
      bg-pink-500/10 p-1 shadow-xl shadow-black/30"
    >
      <Image
        width={400}
        height={400}
        src={'/images/play.png'}
        alt={''}
        className="w-full h-full rounded-[1.5rem] object-fill"
      />
    </div>
  );
};
export default Play;
