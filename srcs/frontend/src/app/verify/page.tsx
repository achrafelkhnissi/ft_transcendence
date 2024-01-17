import Verify from "@/components/Verify";

export default function Home() {
    return (
      <div className="flex justify-center w-full h-full">
        <div className="self-center w-[500px] h-[400px]  relative rounded-[2rem] shadow-[0_20px_70px_15px_rgba(0,0,0,0.2)] border-4 border-white/5  p-4">
            <Verify />
        </div>
      </div>
    );
  }