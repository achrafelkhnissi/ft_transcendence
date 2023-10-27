import UserInfo from "../../../components/userProfile/UserInfo";
import GameHistory from "../../../components/userProfile/GameHistory";
import Achievements from "../../../components/userProfile/Achievements";
import Friends from "../../../components/userProfile/Friends";

const Home = () => {
  return (
    <div className={`p-4`}>
      <UserInfo />
      <div className='px-4 w-full h-full grid grid-flow-col grid-rows-2 gap-[1.25rem] max-[880px]:grid-flow-row 
      max-[880px]:grid-rows-3  min-[880px]:grid-cols-2'>
        <div className="min-[880px]:row-span-2 ">
          <GameHistory/>
        </div>
        <Friends/>
        <Achievements/>     
      </div>

</div>
  );
};

export default Home;
