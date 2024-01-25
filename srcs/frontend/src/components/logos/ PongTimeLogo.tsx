import Hourglass from './Hourglass';
import { pixelifySans } from '../../fonts';

const Logo = () => {
  return (
    <div
      className={`flex text-3xl items-center text-[#93C4FD]  gap-[0.1rem] justify-center ${pixelifySans.className} drop-shadow-[0_3px_4px_rgba(147,196,253,0.9)]`}
    >
      PON
      <Hourglass color="" width="1.6rem" height="1.6rem" />
    </div>
  );
};

export default Logo;
