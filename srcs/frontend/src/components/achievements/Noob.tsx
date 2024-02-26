import Image from 'next/image';

const Noob = () => {
  return (
    <div
      className="c w-28 h-28  rounded-[1.5rem]
         bg-black p-1 shadow-xl"
    >
      <Image
        width={400}
        height={400}
        src={'/images/noob.png'}
        alt={''}
        className="w-full h-full rounded-[1.5rem] object-fill"
      />
    </div>
  );
};
export default Noob;
