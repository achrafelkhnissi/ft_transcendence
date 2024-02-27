import Image from 'next/image';

const AwsomeGamer = () => {
  return (
    <div
      className="border-4 w-28 h-28  rounded-[1.5rem]
        border-pink-400/10 bg-purple-200 p-1 shadow-xl shadow-white/15"
    >
      <Image
        width={400}
        height={400}
        src={'/images/aswomeGame.png'}
        alt={''}
        className="w-full h-full rounded-[1.5rem] object-fill"
      />
    </div>
  );
};
export default AwsomeGamer;
