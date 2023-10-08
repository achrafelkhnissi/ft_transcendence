import Hourglass from "./Hourglass";
import { pixelifySans } from "../../fonts";

const Logo = () => {
  return (
    <div
      className={`flex text-4xl items-center text-[#93C4FD] -gap-6 ${pixelifySans.className} drop-shadow-[0_3px_4px_rgba(147,196,253,0.9)]`}
    >
      PON
      <Hourglass color="" width="2rem" height="2rem" />
    </div>
  );
};

export default Logo;
