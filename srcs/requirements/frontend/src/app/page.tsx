import FullScreenSvg from "./components/FullScreenSvg";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <FullScreenSvg />
      <div className="absolute top-0 left-0 w-full h-full pl-20 pt-80">
        <p className="text-white">It&apos;s</p>
        <h1 className="text-white text-7xl font-extrabold ">PongTime</h1>

        <p className="text-white pt-6 text-lg font-extralight">
          Welcome to our Pong game! Get ready to bounce and let the ball roll.
        </p>
        <button className=" flex  px-5 py-3 bg-white text-black font-bold mt-10 rounded-2xl shadow-xl shadow-gray-900/60 gap-2">
          <span>Login with intra</span>
          <Image src="/42-logo.png" alt="Logo" width={26} height={26} />
        </button>
        <Image
          src="/pong.jpeg"
          alt="ong"
          width={500}
          height={500}
          className="absolute  right-10 bottom-50%"
        />
      </div>
    </div>
  );
}
