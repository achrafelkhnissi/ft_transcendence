import UserInfo from "@/app/components/userProfile/UserInfo";
import Card from "@/app/components/userProfile/Card";
import {MdEmojiPeople} from "react-icons/md"

const Home = () => {
  return (
    <div className={`p-4 h-3/5 min-h-[500px]`}>
      <UserInfo />
      <div className="w-full h-full grid grid-flow-col grid-rows-2 gap-4">
      <Card header="achievements" icon="" >
              <div></div>
            </Card>

            <Card header="friends" icon= {<MdEmojiPeople/>}>
            <div></div>
          </Card>
          <div className="row-span-2">
          <Card header="game history" icon="" >
          </Card>

          </div>
      </div>

</div>
  );
};

export default Home;
