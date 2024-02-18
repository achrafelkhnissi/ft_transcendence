
interface StatsProps {
  wins: number;
  losses: number;
}

const Stats: React.FC<StatsProps> = ({
  wins,
  losses,
}) => {
  const total = wins + losses;
  const w = wins * 100 / total ? wins * 100 / total : 0;
  const l = losses * 100 / total ? losses * 100 / total : 0;

  return (
    <div className=" flex justify-between  pl-2 divide-x-[0.17rem] divide-[#6C61A4]/60">
          <div
            className="text-white flex flex-col gap-1 px-4 text-sm"
          >
            <p className="self-center text-[#6C61A4] font-semibold ">
              Total Games
            </p>
            <p className="self-center font-semibold">{total}</p>
          </div>
          <div
            className="text-white flex flex-col gap-1 px-4 text-sm"
          >
            <p className="self-center text-[#6C61A4] font-semibold ">
              Wins
            </p>
            <p className="self-center font-semibold">{w}%</p>
          </div>
          <div
            className="text-white flex flex-col gap-1 px-4 text-sm"
          >
            <p className="self-center text-[#6C61A4] font-semibold ">
              Loss
            </p>
            <p className="self-center font-semibold">{l}%</p>
          </div>
    </div>
  );
};

export default Stats;
