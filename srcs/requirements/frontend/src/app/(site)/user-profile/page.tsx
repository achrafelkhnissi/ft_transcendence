import UserInfo from "@/app/components/userProfile/UserInfo";
import Card from "@/app/components/userProfile/Card";
import {MdEmojiPeople} from "react-icons/md"
import { GiAchievement } from "react-icons/gi"
import { RiChatHistoryFill } from "react-icons/ri"

const Home = () => {
  return (
    <div className={`p-4 h-3/5 min-h-[500px]`}>
      <UserInfo />
      <div className=" px-4 w-full h-full grid grid-flow-col grid-rows-2 gap-[1.25rem]">
      <Card header="achievements" icon= {<GiAchievement className="text-[#6C61A4] w-6 h-6"/>} >
              <div></div>
            </Card>

            <Card header="friends" icon= {<MdEmojiPeople className="text-[#6C61A4] w-6 h-6"/>}>
            <div></div>
          </Card>
          <div className="row-span-2">
          <Card header="game history" icon={<RiChatHistoryFill className="text-[#6C61A4] w-5 h-5" />}>
          </Card>

          </div>
      </div>

</div>
  );
};

export default Home;
