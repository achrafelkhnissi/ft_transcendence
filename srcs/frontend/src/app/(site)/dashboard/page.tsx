import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import PopularRooms from "@/app/components/dashboard/PopularRooms";
import TopPlayers from "@/app/components/dashboard/TopPlayers";

const Home = () => {
  return (
    <div className=" w-full max-w-[75rem] p-4 mx-auto flex flex-col gap-8">
        <DashboardHeader/>
        <PopularRooms/>
        <TopPlayers/>
    </div>
    
  );
};

export default Home;
