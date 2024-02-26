import AwsomeGame from '../achievements/AwsomeGame';
import GoodGame from '../achievements/GoodGame';
import Noob  from '../achievements/Noob';
import ProGamer  from '../achievements/ProGamer';
import Card from './Card';
import { GiAchievement } from 'react-icons/gi';

const Achievements = () => {
  return (
    <Card
      header="achievements"
      icon={<GiAchievement className="text-[#6C61A4] w-6 h-6 " />}
    >
      <div className=' p-2 flex flex-wrap max-h-[280px] gap-3 justify-center'>
        <Noob />
        <ProGamer />
        <GoodGame/>
        <AwsomeGame/>
      </div>
    </Card>
  );
};

export default Achievements;
