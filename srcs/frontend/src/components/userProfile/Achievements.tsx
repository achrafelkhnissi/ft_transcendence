import AwsomeGame from '../achievements/AwsomeGamer';
import GoodGame from '../achievements/GoodGame';
import Noob  from '../achievements/Noob';
import ProGamer  from '../achievements/ProGamer';
import LevelUp  from '../achievements/LevelUp';
import Card from './Card';
import Play from '../achievements/Play';
import { GiAchievement } from 'react-icons/gi';
import { Achievement } from './types';
import AwsomeGamer from '../achievements/AwsomeGamer';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <Card
      header="achievements"
      icon={<GiAchievement className="text-[#6C61A4] w-6 h-6 " />}
    >
      <div className="p-6 flex flex-wrap max-h-[280px] gap-3 justify-center">
        {achievements.map((achievement, index) => {
          switch (achievement.name) {
            case 'noob':
              return <Noob key={index}/>;
            case 'proGamer':
              return <ProGamer key={index}/>;
            case 'goodGame':
              return <GoodGame key={index} />;
            case 'awsomeGamer':
              return <AwsomeGamer key={index}/>;
            case 'levelUp':
              return <LevelUp key={index}/>;
            case 'play':
              return <Play key={index}/>;
            default:
              return null;
          }
        })}
      </div>
    </Card>
  );
};

export default Achievements;
