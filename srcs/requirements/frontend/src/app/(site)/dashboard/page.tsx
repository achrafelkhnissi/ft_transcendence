import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import PopularRooms from "@/app/components/dashboard/PopularRooms";
import TopPlayers from "@/app/components/dashboard/TopPlayers";

const Home = () => {
  return (
    <div className=" w-full p-4 flex flex-col gap-8">
        <DashboardHeader/>
        <PopularRooms/>
        <TopPlayers/>
    </div>
    
  );
};

export default Home;
