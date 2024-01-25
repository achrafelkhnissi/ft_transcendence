import Card from './Card';
import { GiAchievement } from 'react-icons/gi';

const Achievements = () => {
  return (
    <Card
      header="achievements"
      icon={<GiAchievement className="text-[#6C61A4] w-6 h-6" />}
    >
      <div></div>
    </Card>
  );
};

export default Achievements;
