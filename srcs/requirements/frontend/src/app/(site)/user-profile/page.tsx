import UserInfo from "@/app/components/userProfile/UserInfo";
import GameHistory from "@/app/components/userProfile/GameHistory";
import Achievements from "@/app/components/userProfile/Achievements";
import Friends from "@/app/components/userProfile/Friends";

const Home = () => {
  return (
    <div className={`p-4 max-w-`}>
      <UserInfo />
      <div className='px-4 w-full h-full grid grid-flow-col grid-rows-2 gap-[1.25rem] max-[880px]:grid-flow-row 
      max-[880px]:grid-rows-3  min-[880px]:grid-cols-2'>
        <Friends/>
        <Achievements/>     
        <div className="min-[880px]:row-span-2 ">
          <GameHistory/>
        </div>
      </div>

</div>
  );
};

export default Home;
