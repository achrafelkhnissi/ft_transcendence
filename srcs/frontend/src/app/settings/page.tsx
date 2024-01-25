import Settings from '@/components/settings/Settings';

export default function Home() {
  return (
    <div className="flex justify-center w-full h-full">
      <div className="self-center w-[500px] h-[600px]  relative rounded-[2rem] shadow-[0_20px_70px_15px_rgba(0,0,0,0.2)] border-4 border-white/10  p-4">
        <Settings />
      </div>
    </div>
  );
}
