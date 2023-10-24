"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

interface Props {
  id: string;
}

const Auth: React.FC<Props> = ({ id }) => {
  console.log(id);
  useEffect(() => {
    const strodeId = localStorage.getItem("id");
    if (!strodeId) localStorage.setItem("id", id);
  }, []);

  const { data, isLoading, isError } = useQuery({
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

  if (isLoading) {
    return <div className="flex justify-center">Loading...</div>;
  }
  return (
    <div className=" text-white flex justify-center ">
      <div>{id}</div>
    </div>
  );
};

export default Auth;
