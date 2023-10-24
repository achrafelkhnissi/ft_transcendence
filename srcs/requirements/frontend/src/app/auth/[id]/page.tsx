import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Auth from "./Auth";

const Home = ({params}: {params: { id: string}}) => {

  return (
    <div className="text-white">
      <Auth id={params.id}/>
    </div>
  );
};

export default Home;
