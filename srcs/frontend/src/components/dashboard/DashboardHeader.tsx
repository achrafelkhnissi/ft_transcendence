import Link from "next/link";

const DashboardHeader = () => {
  return (
    <div className="w-full h-80 px-4 ">
      <div className="w-full h-full rounded-[1.6rem] relative shadow-2xl">
        <video
          className="w-full 
                                h-full 
                                rounded-[1.6rem] 
                                object-cover 
                                absolute
                                    "
          autoPlay
          loop
        >
          <source src="/videos/pong.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Link href="/play/0"
          className="absolute 
                            text-[#60B3FF] 
                            bg-[#4E4B8B]/70 
                            py-2 
                            px-8
                            text-lg
                            font-semibold 
                            rounded-xl
                            left-1/2
                            bottom-14
                            transform
                            -translate-x-1/2
                            shadow-xl
                            hover:bg-[#4E4B8B]
                            hover:text-[#64beff]
                            active:shadow-none
            "
        >
          Play Now
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
