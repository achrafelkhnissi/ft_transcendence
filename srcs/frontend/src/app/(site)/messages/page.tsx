import Preview from "@/components/messages/Preview";
import Conversation from "@/components/messages/Conversation";

const Home = () => {
    return (
    <div className=" flex gap-6 w-full h-screen px-6 py-4 ">
       <Preview/>
       <Conversation/> 
    </div>)
}

export default Home;