import Logo_42 from "./components/Logo_42";
import Back from "./components/Back";
import { pixelifySans, roboto } from "./fonts";

export default function Home() {
  return (
    <div>
      <Back />
      <div
        className={`
      w-full 
      h-full 
      py-96 
      absolute 
      top-0 
      left-0`}
      >
        <h1
          className={`text-blue-300 
            lg:text-9xl 
            font-extrabold  
            text-center text-7xl 
            ${pixelifySans.className}`}
        >
          <span className="text-white text-2xl">It&rsquo;s </span>
          PongTime
        </h1>
        <p
          className={`text-white pt-6 font-light px-6 text-center mt-4 ${roboto.className}}`}
        >
          Welcome to our Pong game! Get ready to bounce and let the ball roll.
        </p>
        <button
          className={` flex m-auto  
          px-5 py-3 
          bg-transparent  
          border-2 
          border-blue-300
          text-blue-300 
          font-bold 
          mt-16 
          rounded-2xl 
          shadow-xl
          shadow-blue-300/20 
          gap-2
          hover:bg-gray-100/10
          active:bg-gray-100/5
          active:shadow-blue-300/10 
          
          `}
        >
          <span>Login with intra</span>
          <Logo_42 color="#93C4FD" width="26px" height="26px" />
        </button>
      </div>
    </div>
  );
}
