"use client";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  id: string;
}

const Auth: React.FC<Props> = ({ id }) => {
  const queryClient = new QueryClient();
  const router = useRouter();
  console.log(id);
  useEffect(() => {
    const strodeId = localStorage.getItem("id");
    if (!strodeId) localStorage.setItem("id", id);
  }, [id]);
  
  queryClient.prefetchQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/whoami",
        {
          withCredentials: true,
        }
      );
      return data;
    },
  });

  // if (isLoading) {
  //   return <div className="flex justify-center">Loading...</div>;
  // }
  router.push('http://localhost:1337/dashboard')
  return (
    <div className=" text-white flex justify-center ">
      <div>{id}</div>
    </div>
  );
};

export default Auth;
