import ChannelCard from "@/components/dashboard/ChannelCard";
const Home = () => {
  interface channlesProps {
    image: string;
    name: string;
  }

  const channels: channlesProps[] = [
    {
      image: "channel1.webp",
      name: "name",
    },
    {
      image: "channel2.webp",
      name: "name",
    },
    {
      image: "channel3.webp",
      name: "name",
    },
    {
      image: "channel4.webp",
      name: "name",
    },
    {
        image: "channel1.webp",
        name: "name",
      },
      {
        image: "channel2.webp",
        name: "name",
      },
      {
        image: "channel3.webp",
        name: "name",
      },
      {
        image: "channel4.webp",
        name: "name",
      },
      {
        image: "channel1.webp",
        name: "name",
      },
      {
        image: "channel2.webp",
        name: "name",
      },
      {
        image: "channel3.webp",
        name: "name",
      },
      {
        image: "channel4.webp",
        name: "name",
      },
  ];

  return (
    <div className="w-full py-2">
        <p className="text-xl text-white flex justify-center pt-8  pb-4 font-semibold">All Rooms</p>
      <div className="flex gap-1 pl-4">
        <div className="h-full py-6 flex justify-center gap-6 flex-wrap">
          {channels.map((item, index) => {
            return <ChannelCard key={index} imageSrc={item.image} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
