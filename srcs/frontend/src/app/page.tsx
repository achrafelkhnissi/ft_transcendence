'use client';

import { SparklesCore } from '@/ui/sparkles';
import Logo_42 from '../components/logos/Logo_42';
import { pixelifySans, roboto } from '../fonts';
import Link from 'next/link';
import { PureComponent, useState } from 'react';

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div className="relative">
      {/* <Back /> */}
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.4}
          maxSize={0.9}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div
        className={`
        flex
        flex-col
      w-full 
      h-full 
      py-96 
      absolute 
      top-0 
      left-0`}
      >
        <h1
          className={`text-blue-300/90 
            lg:text-9xl 
            font-extrabold  
            text-center text-7xl 
            drop-shadow-[0px_20px_20px_rgba(0,0,0,0.6)]
            ${pixelifySans.className ? pixelifySans.className : ''}`}
        >
          <span className="text-white text-2xl">It&rsquo;s</span>
          PongTime
        </h1>
        <p className={`text-white pt-6 font-light px-6 text-center mt-4 \}`}>
          Welcome to our Pong game! Get ready to bounce and let the ball roll.
        </p>
        <div className="self-center mt-16">
          <Link
            className=""
            href={
              `${process.env.BACKEND}/api/auth/ft`
              /* TODO: Handle errors! onClick maybe? */
            }
          >
            <div className="inline-block">
              <button
                className={` 
          flex m-auto  
          px-5 py-3 
          bg-transparent  
          border-2 
          border-blue-300
          text-blue-300 
          font-bold 
          rounded-2xl 
          shadow-xl
          shadow-blue-300/20 
          gap-2
          hover:bg-gray-100/10
          active:bg-gray-100/5
          active:shadow-blue-300/10 
          `}
                disabled={isClicked}
                onClick={() => {
                  setIsClicked((prev) => !prev);
                }}
              >
                {isClicked && (
                  <div role="status" className="flex gap-4 ">
                    <span className="text-blue-300/80 font-normal">
                      Loading...
                    </span>
                    <svg
                      aria-hidden="true"
                      className="inline w-6 h-6 text-blue-300/60 animate-spin dark:text-gray-600 fill-blue-300  
                      "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
                {!isClicked && (
                  <div className="flex gap-2">
                    <span>Login with intra</span>
                    <Logo_42 color="#93C4FD" width="26px" height="26px" />
                  </div>
                )}
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
